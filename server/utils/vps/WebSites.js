import fsPath from "node:path";
import fs from "fs-extra";
// import fs from "node:fs/promises";
// import fs from "node:fs";
// import os from "node:os";
import dns from "node:dns/promises";
import lo from "lodash";
// import { z } from "zod";
import shell from "@/server/utils/shell";
import SslAcme from "@/server/utils/vps/SslAcme";
import NginxHandler from "@/server/utils/vps/Nginx";

const cleanArray = (val) => [].concat(val).filter(Boolean);
const LOCAL_DB_DIR = process?.env?.NUXT_LOCAL_DB_DIR || ".localdb/";

export default class WebSites {
  #accountFilePath = fsPath.resolve(LOCAL_DB_DIR, "account.json");
  #confDirPath = fsPath.resolve(LOCAL_DB_DIR, "sites.conf.d");

  constructor() {
    const accountObj = fs.readJsonSync(this.#accountFilePath);
    if (!accountObj?.vpsUser) throw new Error("Please setup admin user first");

    this.sslAcme = new SslAcme({ webSites: this, email: accountObj?.username });
    this.nginx = new NginxHandler({ webSites: this });
    this.nginxReload = debounce(() => this.nginx.reload(), 1000);
    this.touch();
  }

  touch() {
    if (fs.existsSync(this.#confDirPath) === false) {
      fs.mkdirSync(this.#confDirPath);
    }
  }

  async list() {
    if (!shell.test("-d", this.#confDirPath)) throw new Error("Invalid Path");
    const confFiles = shell.find(this.#confDirPath);
    const sslDomains = await this.findSslDomains();

    const data = [];
    for (const confPath of confFiles) {
      //  ignore files other then .CONF or .DUMP
      if (!/\.(conf|dump)$/i.test(confPath)) {
        continue;
      }

      const confId = hexEncode(confPath);
      const confName = confPath.split("/").pop();
      const confData = await this.nginx.readConf(confPath);
      const isActive = confName.split(".").pop() === "conf";
      const isDefault = confPath.endsWith("_default.conf");
      if (!confData?.domain?.length) continue;

      data.push({
        confId,
        confPath,
        confName,
        confType: confData?.confType || null,
        certName: confData?.sslCert || null,
        domain: confData?.domain,
        target: confData?.target,
        enableIndexing: confData?.enableIndexing || false,
        hasSSL: sslDomains.includes(confData?.domain),
        enableSSL: confData?.enableSSL,
        forceSSL: confData?.forceSSL,
        isDefault,
        isActive,
      });
    }

    return data;
  }

  async create(args) {
    // validating input payload
    const validated = await this.nginx.validateAndSanitize(args);

    // check for domain conflicts
    await this.#checkDomainsInUse(validated?.domain, { exclude: siteConf?.domain?.split(" ") });

    // generating configuration files
    for (const _domain of validated?.domain) {
      await this.#setConfData({ ...validated, domain: _domain });
    }
  }

  async update(confId, options) {
    const { path, file } = this.#parseHexaId(confId);
    const isDumped = path.endsWith(".dump");
    const isDefault = path.endsWith("_default.conf");
    if (isDefault) return await this.#setDefaultConf(options);

    // validating input payload
    const validated = await this.nginx.validateAndSanitize(options);

    // fetching current configuration
    const siteConf = await this.nginx.readConf(path);

    // check for domain conflicts
    await this.#checkDomainsInUse(validated?.domain, { exclude: siteConf?.domain?.split(" ") });

    // updating if only for 1 domain
    if (validated?.domain.length === 1 && siteConf?.confType) {
      return await this.#setConfData({ ...validated, confPath: path });
    }
    // else deleting current configuration and creating new ones
    for (const _domain of validated?.domain) {
      await this.#setConfData({ ...validated, isDumped, domain: _domain });
    }

    await this.delete(confId);
  }

  async delete(confId) {
    const { path, file } = this.#parseHexaId(confId);

    const isDefaultConf = path.endsWith("_default.conf");
    if (isDefaultConf) throw new Error("Action not allowed");

    await shell.mv(path, file?.dir + "/.trashed-" + file?.name + ".trash");
    await this.nginxReload();
  }

  async enable(confId) {
    const { path, file } = this.#parseHexaId(confId);

    const isDefaultConf = path.endsWith("_default.conf");
    if (isDefaultConf) throw new Error("Action not allowed");

    await shell.mv(path, file.dir + "/" + file.name + ".conf");
    await this.nginxReload();
  }

  async disable(confId) {
    const { path, file } = this.#parseHexaId(confId);

    const isDefaultConf = path.endsWith("_default.conf");
    if (isDefaultConf) throw new Error("Action not allowed");

    await shell.mv(path, file.dir + "/" + file.name + ".dump");
    await this.nginxReload();
  }

  async rebuild(confId) {
    // fetching current configuration
    const { path, file } = this.#parseHexaId(confId);
    const isDefault = path.endsWith("_default.conf");
    const siteConf = await this.nginx.readConf(path);

    if (isDefault) {
      return await this.#setDefaultConf(siteConf);
    }

    // validating input payload and updating
    const validated = await this.nginx.validateAndSanitize(siteConf);
    await this.update(confId, validated);
  }

  async rebuildAll() {
    const sites = await this.list();
    const promises = sites.map((site) => this.rebuild(site?.confId));

    await Promise.all(promises);
    await this.nginxReload();
  }

  async rebuildDefaultConf() {
    const defaultConfPath = fsPath.resolve(this.#confDirPath, "_default.conf");
    const defaultConfId = hexEncode(defaultConfPath);

    await this.rebuild(defaultConfId);
  }

  // ====================== Private Site Methods ====================== //
  #parseHexaId(id) {
    const path = hexDecode(id);
    if (!shell.test("-f", path)) throw new Error("Invalid Path");

    const file = fsPath.parse(path);
    return { path, file };
  }

  #generateFilename(domain) {
    domain = domain.replace(/^www\./, "").toLowerCase();
    domain = domain.replace(/[^0-9a-z]/g, " ");
    const randomStr = Math.random().toString(36).substring(2, 6);
    return `${lo.snakeCase(domain)}_${randomStr}`;
  }

  async #setConfData(args) {
    if (!args?.confPath) {
      args.confPath = `${this.#confDirPath}/${this.#generateFilename(args?.domain)}${args?.isDumped ? ".dump" : ".conf"}`;
    }

    if (!process?.env?.APP_ENV.startsWith("dev")) {
      const dnsData = await this.#dnsIpLookup(args?.domain);
      if (!dnsData?.status) throw new Error(`DNS A record for [${args?.domain}] must be pointed to ${dnsData?.vpsIp}`);
    }

    const result = await this.nginx.writeConf(args?.confPath, args);
    await this.nginxReload();
    return result;
  }

  async #setDefaultConf(args) {
    const confPath = this.#confDirPath + "/_default.conf";

    // if (!forceUpdate) {
    //   /**
    //    * ignoring as this seems to be un-necessary task,
    //    * file _default.conf exists, but not updating the target.
    //    * we would be proceeding only, if file doesn't exists or target needs to be updated
    //    */
    //   const isEditCall = Object.values(args || {})?.filter((i) => i !== undefined)?.length > 0;
    //   if (shell.test("-f", confPath) && !isEditCall) return;
    // }

    const result = await this.nginx.writeConf(confPath, {
      confType: "serve",
      target: args?.target || "/var/www/html",
      enableIndexing: args?.enableIndexing || false,
      enableSSL: args?.enableSSL || false,
      forceSSL: args?.forceSSL || true,
    });

    console.log(`✅ nginx default configuration are set`);
    await this.nginxReload();
    return result;
  }

  async #dnsIpLookup(domain) {
    domain = this.nginx.sanitizeDomains(domain)?.[0];

    const [vpsIp, dnsIp] = await Promise.all([
      //
      fetchApi(`https://api.ipify.org`),
      dns
        .resolve4(domain)
        .then((res) => cleanArray(res))
        .catch((err) => []),
    ]);

    return {
      vpsIp,
      dnsIp,
      status: dnsIp.includes(vpsIp),
      domain,
    };
  }

  async #checkDomainsInUse(domains, options) {
    domains = this.nginx.sanitizeDomains(domains);
    if (domains.length <= 0) throw new Error("Domains are missing");

    // validating domains
    const availableSites = await this.list();
    const domainsInUse = lo([])
      .concat(availableSites)
      .map((v) => this.nginx.sanitizeDomains(v?.domain))
      .flattenDeep()
      .uniq()
      .sort()
      .pull(...cleanArray(options?.exclude))
      .value();

    // checking if domain is used somewhere else
    const conflicts = domains.filter((d) => domainsInUse.includes(d));
    if (conflicts.length > 0) throw new Error(`Domain(s) already in use: ${conflicts.join(", ")}`);
  }

  // =========== certificate methods ===========   //

  async installCert(domain) {
    if (process?.env?.APP_ENV.startsWith("dev")) {
      console.log(`🗿 Skipping, certificate installation on development server is not possible`);
      return;
    }

    domain = this.nginx.sanitizeDomains(domain);
    if (domain.length < 1) throw new Error("Domain is missing");
    if (domain.length !== 1) throw new Error("Mulitple domains are not allowed");

    await this.sslAcme.initialize();
    await this.sslAcme.issueCertificate(domain);
  }
  async deleteCert(domain) {
    domain = this.nginx.sanitizeDomains(domain);
    if (domain.length < 1) throw new Error("Domain is missing");
    if (domain.length !== 1) throw new Error("Mulitple domains are not allowed");

    await this.sslAcme.initialize();
    await this.sslAcme.trashCertificate(domain?.[0]);

    // todo: rebuild nginx conf for that domain
    const sites = await this.list();
    const site = sites.find((s) => s?.domain === domain?.[0]);
    await this.update(site?.confId, {
      enableIndexing: site?.enableIndexing,
      enableSSL: false,
      forceSSL: site?.forceSSL,
      confType: site?.confType,
      domain: site?.domain,
      target: site?.target,
    });
  }
  async findCert(sites) {
    try {
      const installed = await this.sslAcme.listCertificates();

      return this.#filterCerts(this.#unwindCerts(installed), sites);
    } catch (error) {
      console.error("~ findCert:", error);
      return [];
    }
  }
  async findOneCert(sites) {
    const certs = await this.findCert(sites);

    return [].concat(certs)?.[0];
  }
  async findSslDomains() {
    const certs = await this.findCert();
    return lo([])
      .concat(certs)
      .map((itm) => itm?.altNames)
      .flattenDeep()
      .uniq()
      .sort()
      .value();
  }
  async listSslMappings(sites) {
    const result = await this.findCert(sites);
    return Object.fromEntries(result.map((c) => [c.domain, c.subject]));
  }
  getCertDirPaths() {
    return this.sslAcme.getPaths();
  }
  // todo: renew certificates
  async renewOutdatedCerts() {}

  // ====================== Private Cert Methods ====================== //
  #filterCerts(certs, sites) {
    if (!lo.isArray(sites) || lo.isEmpty(sites)) return certs;

    return lo.filter(certs, (c) => sites.includes(c.domain));
  }

  #unwindCerts(certs) {
    const domainsMap = [];
    for (const c of certs) {
      for (const d of c?.altNames) {
        const daysLeft = this.#daysLeft(c?.expiresAt);
        domainsMap.push({
          ...c,
          isExpired: daysLeft <= 0,
          daysLeft,
          remarks: daysLeft > 0 ? `${daysLeft} days left` : "EXPIRED",
          domain: d,
        });
      }
    }

    return domainsMap;
  }

  #daysLeft(validTo) {
    const currentDate = new Date();
    const validToDate = new Date(validTo);
    const DAY_IN_MS = 1000 * 60 * 60 * 24;
    const diff_in_ms = validToDate - currentDate;
    return Math.floor(diff_in_ms / DAY_IN_MS);
  }
}
