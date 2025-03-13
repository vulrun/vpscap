import lo from "lodash";
import tls from "node:tls";
import https from "node:https";

export default class SslMeta {
  constructor() {
    this.db = localdb("certs-monitored");
    this.deletedDb = localdb("certs-monitored", "deletedData");
    this.cacheDb = localdb("certs-monitored-cache");
  }

  async fetchInBulk(domains) {
    // make it lowercase for case insensitivity
    if (domains && Array.isArray(domains)) {
      domains = domains.map((domain) => domain.toLowerCase());
    }

    // fetch and merge data
    const savedDomains = this.db.getData([]);
    domains = savedDomains.concat(domains).filter(Boolean);

    if (!Array.isArray(domains) && domains.length <= 0) return [];

    // Get certificates for all domains in parallel
    const result = await Promise.all(domains.map((domain) => this.fetch(domain)));
    return result;

    // const final = {
    //   resolved: result?.filter((res) => res?.status !== "rejected").map((res) => res?.value),
    //   rejected: result?.filter((res) => res?.status === "rejected").map((res) => res?.reason),
    // };
  }

  fetch(domain) {
    const TIMEOUT = 10000;
    return new Promise((resolve) => {
      // return cache saved
      const cached = this.cacheDb.selectDataKey(domain, true).getData();
      if (cached) return resolve(cached);

      const options = {
        host: domain,
        port: 443,
        method: "GET",
        timeout: TIMEOUT,
        rejectUnauthorized: false, // Allow self-signed certificates
        agent: new https.Agent({ maxCachedSessions: 0 }), // Disable session caching
      };

      const req = https.request(options, (res) => {
        const peerCert = res.socket.getPeerCertificate();

        if (!peerCert || Object.keys(peerCert).length === 0) {
          return resolve({ domain, error: "Certificate not found" });
        }

        const cert = {};
        cert.domain = domain;
        cert.error = null;
        cert.isValid = null;
        cert.isCertAuth = peerCert?.ca;
        cert.subject_name = peerCert?.subject?.CN;
        cert.subject_names = lo([]).concat(peerCert?.subject?.CN, peerCert?.subjectaltname.replaceAll("DNS:", "").split(",")).map(lo.trim).uniq().value();
        cert.subject_alt_name = peerCert?.subjectaltname.replaceAll("DNS:", "").split(",");
        // Check if any of the certificate names (including wildcards) match the domain
        cert.isValid = cert.subject_names.some((n) => this.#isWildcardMatch(domain, n));
        cert.issuer_name = peerCert?.issuer?.CN;
        cert.issuer_org = peerCert?.issuer?.O;
        cert.issuer_loc = peerCert?.issuer?.C;
        cert.issuer = !cert.issuer_org ? "" : `(${cert.issuer_name}) ${cert.issuer_org}, ${cert.issuer_loc}`;
        cert.serial_number = peerCert?.serialNumber;
        cert.fingerprint = peerCert?.fingerprint;
        cert.valid_from = new Date(peerCert?.valid_from).toISOString();
        cert.valid_to = new Date(peerCert?.valid_to).toISOString();
        cert.expiry = new Date(peerCert?.valid_to).toISOString();
        cert.days_left = this.#daysLeft(peerCert?.valid_to);
        cert.remarks = this.#remarks(cert);
        this.cacheDb.selectDataKey(domain, true).setData(cert, "30d");
        return resolve(cert);
      });

      req.setTimeout(TIMEOUT, function () {
        this.abort();
      });

      req.on("error", (err) =>
        resolve({
          domain: domain || "",
          error: err?.message || err || "---FAILED---",
          remarks: `ERRORED: ${err?.message || err || "---FAILED---"}`,
        })
      );
      req.end();
    });
  }

  insert(domains) {
    if (!Array.isArray(domains)) {
      throw new Error("Input must be an array");
    }
    // make it lowercase for case insensitivity
    domains = domains.map((domain) => domain.toLowerCase());

    // fetch and merge data
    const savedDomains = this.db.getData([]);
    domains = savedDomains.concat(domains);

    // remove duplicates and update db
    const uniqueDomains = lo(domains).uniq().sortBy().value();
    this.db.setData(uniqueDomains);
  }

  delete(domains) {
    if (!Array.isArray(domains)) {
      throw new Error("Input must be an array");
    }
    // make it lowercase for case insensitivity
    domains = domains.map((domain) => domain.toLowerCase());

    // fetch data
    let savedDomains = this.db.getData([]);
    let deletedDomains = this.deletedDb.getData([]);

    // manipulate data
    savedDomains = savedDomains.filter((domain) => !domains.includes(domain));
    deletedDomains = deletedDomains.concat(domains);

    // remove duplicates
    savedDomains = lo(savedDomains).uniq().sortBy().value();
    deletedDomains = lo(deletedDomains).uniq().sortBy().value();

    // update db values
    this.db.setData(savedDomains);
    this.deletedDb.setData(deletedDomains);
  }

  #isWildcardMatch(domain, wildcard) {
    if (domain === wildcard) return true;
    if (!wildcard.startsWith("*.")) return false;
    if (wildcard.split(".").length < 3) return false;

    // Remove "*." from the wildcard and compare
    const baseDomain = wildcard.slice(2);
    return domain.endsWith(baseDomain) && domain.split(".").length === baseDomain.split(".").length + 1;
  }

  #daysLeft(validTo) {
    const currentDate = new Date();
    const validToDate = new Date(validTo);
    const DAY_IN_MS = 1000 * 60 * 60 * 24;
    const diff_in_ms = Math.abs(validToDate - currentDate);
    return Math.floor(diff_in_ms / DAY_IN_MS);
  }

  #remarks(cert) {
    cert.error = String(cert?.error || "");
    if (/EPROTO/.test(cert.error)) return "SSL NOT ACTIVE";
    if (/ENOTFOUND/.test(cert.error)) return "DOMAIN NOT FOUND";
    if (cert.error.length) return cert.error;
    if (cert?.isValid) return `${cert?.days_left} days left`;
    return "EXPIRED";
  }

  #___getCertificates(domain, port = 443) {
    return new Promise((resolve, reject) => {
      const options = {
        host: domain,
        port: port,
        rejectUnauthorized: false,
      };
      const socket = tls.connect(options, () => {
        const peerCertificate = socket.getPeerCertificate(true);
        if (!peerCertificate || Object.keys(peerCertificate).length === 0) {
          reject(new Error("No certificates found."));
          socket.end();
          return;
        }

        const certificates = [];
        let currentCert = peerCertificate;
        while (currentCert) {
          const issuerCertificate = currentCert.issuerCertificate;
          // Remove properties not needed for the chain
          delete currentCert.issuerCertificate;
          delete currentCert.modulus;
          delete currentCert.pubkey;
          delete currentCert.raw;
          certificates.push(currentCert);
          currentCert = issuerCertificate !== currentCert ? issuerCertificate : null;
        }
        resolve({ domain, certificates });
        socket.end();
      });

      socket.on("error", (err) => reject(err));
    });
  }

  #___rawCertificateToPem(raw) {
    const base64Cert = raw.toString("base64");
    const pem = `-----BEGIN CERTIFICATE-----\n${base64Cert.match(/.{0,64}/g)?.join("\n")}-----END CERTIFICATE-----\n`;
    return pem;
  }
}
