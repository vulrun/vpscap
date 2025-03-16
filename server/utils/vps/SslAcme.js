import fsPath from "node:path";
import fs from "fs-extra";
// import fs from "node:fs/promises";
// import fs from "node:fs";
// import os from "node:os";
import lo from "lodash";
import shell from "@/server/utils/shell";
import acme from "acme-client";
import forge from "node-forge";
import crypto from "node:crypto";

const cleanArray = (val) => [].concat(val).filter(Boolean);
const LOCAL_DB_DIR = process?.env?.NUXT_LOCAL_DB_DIR || ".localdb/";
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export default class SslAcme {
  #certsRootPath = fsPath.resolve(LOCAL_DB_DIR, "acme-ssl");
  #certsLivePath = fsPath.resolve(LOCAL_DB_DIR, "acme-ssl", "certs");
  #certsTrashPath = fsPath.resolve(LOCAL_DB_DIR, "acme-ssl", "trashed-certs");
  #challengesPath = fsPath.resolve(LOCAL_DB_DIR, "acme-ssl", "challenges");
  #accountKeyPath = fsPath.resolve(LOCAL_DB_DIR, "acme-ssl", "account-key.pem");
  #accountObjPath = fsPath.resolve(LOCAL_DB_DIR, "acme-ssl", "account-acme.json");
  #sslDhParamsPath = fsPath.resolve(LOCAL_DB_DIR, "acme-ssl", "ssl-dhparams.pem");
  #sslOptionsNginx = fsPath.resolve(LOCAL_DB_DIR, "acme-ssl", "options-ssl-nginx.conf");

  #client;

  constructor(args) {
    if (!emailRegex.test(args?.email)) throw new Error("Invalid Email Provided");
    this.email = args?.email;
    this.#setupDirectories();
  }

  async listCertificates() {
    if (!shell.test("-d", this.#certsLivePath)) throw new Error("Invalid Path");
    const certsDomain = fs.readdirSync(this.#certsLivePath);

    const data = [];
    for (const domain of certsDomain) {
      const certDir = fsPath.resolve(this.#certsLivePath, domain);
      const stat = fs.statSync(certDir);
      if (!stat.isDirectory()) continue;

      // locate certificate and key files
      const certFiles = fs.readdirSync(certDir).map((path) => fsPath.resolve(certDir, path));
      const certMainFile = certFiles.find((file) => this.#isCertMainFile(file));
      const certKeyFile = certFiles.find((file) => this.#isCertKeyFile(file));

      // read and parse certificate data
      const certData = fs.readFileSync(certMainFile, "utf8");
      const certInfo = forge.pki.certificateFromPem(certData);

      extendObj(certInfo, {
        signature: undefined,
        "_parsed.issuer": toObject(certInfo?.issuer.attributes, "name", "value"),
        "_parsed.subject.commonName": toObject(certInfo?.subject.attributes, "name", "value")?.commonName,
        "_parsed.subject.altNames": certInfo?.extensions?.find((i) => i.name === "subjectAltName")?.altNames?.map((i) => i.value),
      });

      const _parsed = certInfo?._parsed;
      const tmpData = {};
      tmpData.dirName = domain;
      tmpData.certPath = certMainFile || null;
      tmpData.certKeyPath = certKeyFile || null;
      tmpData.serialNo = certInfo?.serialNumber;
      tmpData.certName = _parsed?.subject?.commonName;
      tmpData.altNames = cleanArray(typeof _parsed?.subject?.altNames === "string" ? _parsed?.subject?.altNames?.split(" ") : _parsed?.subject?.altNames);
      tmpData.issuedBy = _parsed?.issuer;
      tmpData.issuedAt = new Date(certInfo?.validity?.notBefore).valueOf();
      tmpData.issuedAtIso = certInfo?.validity?.notBefore;
      tmpData.expiresAt = new Date(certInfo?.validity?.notAfter).valueOf();
      tmpData.expiresAtIso = certInfo?.validity?.notAfter;
      data.push(tmpData);
    }

    return data;
  }

  getPaths() {
    return {
      certsRootPath: this.#certsRootPath,
      certsLivePath: this.#certsLivePath,
      certsTrashPath: this.#certsTrashPath,
      challengesPath: this.#challengesPath,
      accountKeyPath: this.#accountKeyPath,
      accountObjPath: this.#accountObjPath,
      sslDhParamsPath: this.#sslDhParamsPath,
      sslOptionsNginx: this.#sslOptionsNginx,
    };
  }

  async initialize() {
    const accountKey = await this.#getOrCreateAccountKey();

    this.#client = new acme.Client({
      accountKey,
      // accountUrl: "https://acme-v02.api.letsencrypt.org/acme/acct/12345678",
      // directoryUrl: acme.directory.letsencrypt.staging,
      directoryUrl: acme.directory.letsencrypt.production,
    });

    // Register account with Let's Encrypt
    // await this.#client.createAccount({
    //   termsOfServiceAgreed: true,
    //   contact: [`mailto:${this.email}`],
    // });
    // await this.#getOrSaveAccountUrl();
  }

  async issueCertificate(domain) {
    try {
      if (!domain) throw new Error("SSLManager: Domain is missing");

      const csrData = await this.#generateCsr(domain);

      console.log("🔏 Requesting CA for certificates...");
      const cert = await this.#client.auto({
        csr: csrData?.csr,
        email: this.email,
        termsOfServiceAgreed: true,
        challengeCreateFn: this.#handleHttpChallenge.bind(this),
        challengeRemoveFn: this.#cleanupHttpChallenge.bind(this),
      });

      await this.#saveCertificate(domain, cert, csrData?.csr, csrData?.key);
      console.log("✅ SSL Certificate issued successfully!");
    } catch (error) {
      console.error("❌ Error issuing certificate:", error);
    }
  }

  async trashCertificate(domain) {
    const certLiveDomainPath = fsPath.resolve(this.#certsLivePath, domain);
    const certTrashDomainPath = fsPath.resolve(this.#certsTrashPath, domain);

    const dirExists = await fs
      .access(certLiveDomainPath, fs.constants.R_OK | fs.constants.W_OK)
      .then(() => true)
      .catch(() => false);

    if (!dirExists) throw new Error(`Certifcate not found for [${domain}]`);

    await fs.move(certLiveDomainPath, certTrashDomainPath);
  }

  // todo: renew certificates
  async renewCertificate(domain) {
    if (!domain) throw new Error("SSLManager: Domain is missing");

    const certPath = fsPath.join(this.#certsLivePath, domain, `cert.crt`);
    if (!fs.existsSync(certPath)) {
      console.log("⚠️ No existing certificate found. Issuing a new one...");
      return this.issueCertificate();
    }

    console.log("🔄 Renewing SSL certificate...");
    await this.issueCertificate();
  }

  // ====================== Private Methods ====================== //
  #setupDirectories() {
    fs.ensureDirSync(this.#certsLivePath);
    fs.ensureDirSync(this.#certsTrashPath);
    fs.ensureDirSync(this.#challengesPath);
    this.#generateOptionsSslNginxConf();
    this.#generateDhParams();
  }

  async #generateOptionsSslNginxConf() {
    // creating options-ssl-nginx.conf
    const optionsSslNginxConf = `IyBUaGlzIGZpbGUgY29udGFpbnMgaW1wb3J0YW50IHNlY3VyaXR5IHBhcmFtZXRlcnMuIElmIHlvdSBtb2RpZnkgdGhpcyBmaWxlCiMgbWFudWFsbHksIFdlIHdvdWxkIGJlIHVuYWJsZSB0byBhdXRvbWF0aWNhbGx5IHByb3ZpZGUgZnV0dXJlIHNlY3VyaXR5CiMgdXBkYXRlcy4gSW5zdGVhZCwgd2lsbCBwcmludCBhbmQgbG9nIGFuIGVycm9yIG1lc3NhZ2Ugd2l0aCBhIHBhdGggdG8KIyB0aGUgdXAtdG8tZGF0ZSBmaWxlIHRoYXQgeW91IHdpbGwgbmVlZCB0byByZWZlciB0byB3aGVuIG1hbnVhbGx5IHVwZGF0aW5nCiMgdGhpcyBmaWxlLgoKc3NsX3Nlc3Npb25fY2FjaGUgc2hhcmVkOmxlX25naW54X1NTTDoxMG07CnNzbF9zZXNzaW9uX3RpbWVvdXQgMTQ0MG07CnNzbF9zZXNzaW9uX3RpY2tldHMgb2ZmOwoKc3NsX3Byb3RvY29scyBUTFN2MS4yIFRMU3YxLjM7CnNzbF9wcmVmZXJfc2VydmVyX2NpcGhlcnMgb2ZmOwoKc3NsX2NpcGhlcnMgIkVDREhFLUVDRFNBLUFFUzEyOC1HQ00tU0hBMjU2OkVDREhFLVJTQS1BRVMxMjgtR0NNLVNIQTI1NjpFQ0RIRS1FQ0RTQS1BRVMyNTYtR0NNLVNIQTM4NDpFQ0RIRS1SU0EtQUVTMjU2LUdDTS1TSEEzODQ6RUNESEUtRUNEU0EtQ0hBQ0hBMjAtUE9MWTEzMDU6RUNESEUtUlNBLUNIQUNIQTIwLVBPTFkxMzA1OkRIRS1SU0EtQUVTMTI4LUdDTS1TSEEyNTY6REhFLVJTQS1BRVMyNTYtR0NNLVNIQTM4NCI7Cg==`;
    fs.writeFileSync(this.#sslOptionsNginx, Buffer.from(optionsSslNginxConf, "base64"));
  }

  async #generateDhParams() {
    if (fs.existsSync(this.#sslDhParamsPath)) return;

    console.log("🔏 Generating SSL DH Params...");

    // Generate Diffie-Hellman parameters with 2048 bits
    const dh = crypto.createDiffieHellman(2048);
    const prime = dh.getPrime();
    const generator = dh.getGenerator();

    // Save the generated parameters to a file
    fs.writeFileSync(this.#sslDhParamsPath, this.#createPemContent(prime, "DH PARAMETERS"));
    console.log("DH Parameters saved to dhparam.pem", "Generator:", generator.toString());
  }

  async #getOrCreateAccountKey() {
    if (!fs.existsSync(this.#accountKeyPath)) {
      console.log("🔑 Generating new account key...");
      const accountKey = await acme.crypto.createPrivateEcdsaKey();
      await fs.outputFile(this.#accountKeyPath, accountKey);
    }
    return fs.readFileSync(this.#accountKeyPath, "utf8");
  }

  async #getOrSaveAccountUrl() {
    if (!fs.existsSync(this.#accountObjPath)) {
      console.log("🔑 Saving account url...");
      const accountUrl = this.#client.getAccountUrl();
      fs.writeJsonSync(this.#accountObjPath, { url: accountUrl });
    }
    return fs.readJsonSync(this.#accountObjPath);
  }

  async #generateCsr(domain) {
    if (!domain) throw new Error("SSLManager: Domain is missing");

    console.log("🔏 Generating CSR and key...");
    const [key, csr] = await acme.crypto.createCsr({ altNames: domain });
    return { key, csr };
  }

  async #saveCertificate(domain, cert, csr, key) {
    if (!domain) throw new Error("SSLManager: Domain is missing");
    const certPath = fsPath.resolve(this.#certsLivePath, String(cleanArray(domain)?.[0]));

    await fs.ensureDir(certPath);
    await fs.outputFile(`${certPath}/cert.pem`, cert);
    await fs.outputFile(`${certPath}/cert.crt`, cert);
    await fs.outputFile(`${certPath}/priv.pem`, key);
    await fs.outputFile(`${certPath}/priv.key`, key);
    await fs.outputFile(`${certPath}/sign.pem`, csr);
    await fs.outputFile(`${certPath}/sign.csr`, csr);
    console.log(`📜 [${domain}] certificate and key saved!`);
  }

  async #handleHttpChallenge(authz, challenge, keyAuthorization) {
    const challengeFilePath = fsPath.join(this.#challengesPath, challenge?.token);
    await fs.outputFile(challengeFilePath, keyAuthorization || "");

    console.log(`📂 Challenge file created: ${challengeFilePath}`);
    return challengeFilePath;
  }

  async #cleanupHttpChallenge(authz, challenge, keyAuthorization) {
    const challengeFilePath = fsPath.join(this.#challengesPath, challenge?.token);
    await fs.remove(challengeFilePath);

    console.log(`🧹 Challenge file removed: ${challengeFilePath}`);
  }

  #createPemContent(base64Str, boundaryName) {
    base64Str = Buffer.isBuffer(base64Str) ? base64Str.toString("base64") : base64Str.toString();
    boundaryName = (boundaryName || "DATA").toUpperCase();

    const maxLineLength = 64;
    let result = `-----BEGIN ${boundaryName}-----\n`;

    // Loop through the base64 string and split it into lines of 64 characters
    for (let i = 0; i < base64Str.length; i += maxLineLength) {
      result += base64Str.slice(i, i + maxLineLength) + "\n";
    }

    result += `-----END ${boundaryName}-----\n`;
    return result;
  }

  #isCertKeyFile(filePath) {
    if (!filePath) return false;

    const pathInfo = fsPath.parse("" + filePath);
    const fileData = fs.readFileSync("" + filePath, "utf8");
    const isValid = !!~fileData.indexOf(`PRIVATE KEY--`);

    const fileNameLowerCased = (pathInfo?.base || "").toLowerCase();
    if (isValid && fileNameLowerCased.endsWith(".key")) return true;
    if (isValid && fileNameLowerCased.endsWith(".pem") && fileNameLowerCased.startsWith("priv")) return true;

    return false;
  }
  #isCertMainFile(filePath) {
    if (!filePath) return false;

    const pathInfo = fsPath.parse("" + filePath);
    const fileData = fs.readFileSync("" + filePath, "utf8");
    const isValid = !!~fileData.indexOf(`--BEGIN CERTIFICATE--`);

    const fileNameLowerCased = (pathInfo?.base || "").toLowerCase();
    if (isValid && fileNameLowerCased?.endsWith(".crt")) return true;
    if (isValid && fileNameLowerCased?.endsWith(".cer")) return true;
    if (isValid && fileNameLowerCased?.endsWith(".pem") && fileNameLowerCased?.startsWith("cert")) return true;

    return false;
  }
}
