import fsPath from "node:path";
import fs from "fs-extra";
import dns from "node:dns/promises";
import lo from "lodash";
// import { z } from "zod";
import shell from "@@/server/utils/shell";
import SslAcme from "@@/server/utils/vps/SslAcme";
import SslMeta from "@@/server/utils/vps/SslMeta";
import NginxHandler from "@@/server/utils/vps/NginxHandler";
import AccountJson from "@@/server/utils/vps/AccountJson";

export default class WebSites {
  constructor() {
    if (WebSites.instance) {
      return WebSites.instance;
    }

    const accountJson = new AccountJson();
    const accountObj = accountJson.getData("*");

    if (!accountObj?.vpsUser) {
      console.log("Please setup admin user first");
      process.exit();
    }

    this.sslMeta = new SslMeta();
    this.sslAcme = new SslAcme({ webSites: this, email: accountObj?.username });
    this.nginx = new NginxHandler({ webSites: this });
    this.nginxReload = debounce(() => this.nginx.reload(), 1000);
    this.confDirPath = fsPath.resolve(accountObj?.localDir, "sites.conf.d");
    this.touch();

    WebSites.instance = this;
  }

  touch() {
    if (fs.existsSync(this.confDirPath) === false) {
      fs.mkdirSync(this.confDirPath);
    }
  }

  async list(options) {
    if (!shell.test("-d", this.confDirPath)) throw new Error("Invalid Path");
    const confFiles = shell.find(this.confDirPath);
    const sslDomains = options?.minimal ? [] : await this.findSslDomains();
    const sslMonitors = options?.minimal ? [] : await this.sslMeta.list();

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
        hasSSLMonitor: sslMonitors.includes(confData?.domain),
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
    await this.#checkDomainsInUse(validated?.domain);

    // generating configuration files
    for (const _domain of validated?.domain) {
      await this.#setConfData({ ...validated, domain: _domain });
    }
  }

  async update(confId, options) {
    const { path, file } = this.#parseHexaId(confId);
    const isDumped = path.endsWith(".dump");
    const isDefault = path.endsWith("_default.conf");
    if (isDefault) return await this.#newDefaultConf(options);

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
      return await this.#newDefaultConf(siteConf);
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
    const defaultConfPath = fsPath.resolve(this.confDirPath, "_default.conf");
    if (!shell.test("-f", defaultConfPath)) {
      return await this.#newDefaultConf();
    }

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
      args.confPath = `${this.confDirPath}/${this.#generateFilename(args?.domain)}${args?.isDumped ? ".dump" : ".conf"}`;
    }

    if (!process?.env?.APP_ENV?.startsWith("dev")) {
      const dnsData = await this.#dnsIpLookup(args?.domain);
      if (!dnsData?.status) throw new Error(`DNS A record for \`__**${args?.domain}**__\` must be pointed to \`**${dnsData?.vpsIp}**\` instead of \`**${dnsData?.dnsIp}\`**.`);
    }

    const result = await this.nginx.writeConf(args?.confPath, args);
    await this.nginxReload();
    return result;
  }
  async #newDefaultConf(args) {
    const confPath = this.confDirPath + "/_default.conf";

    const result = await this.nginx.writeConf(confPath, {
      confType: "serve",
      domain: args?.domain || "example.com",
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
    domain = sanitizeDomains(domain)?.[0];

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
    domains = sanitizeDomains(domains);
    if (domains.length <= 0) throw new Error("Domains are missing");

    // validating domains
    const availableSites = await this.list();
    const domainsInUse = lo([])
      .concat(availableSites)
      .map((v) => sanitizeDomains(v?.domain))
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
    if (process?.env?.APP_ENV?.startsWith("dev")) {
      console.log(`🗿 Skipping, certificate installation on development server is not possible`);
      return;
    }

    domain = sanitizeDomains(domain);
    if (domain.length < 1) throw new Error("Domain is missing");
    if (domain.length !== 1) throw new Error("Mulitple domains are not allowed");

    await this.sslAcme.initialize();
    await this.sslAcme.issueCertificate(domain);
  }
  async deleteCert(domain) {
    domain = sanitizeDomains(domain);
    if (domain.length < 1) throw new Error("Domain is missing");
    if (domain.length !== 1) throw new Error("Mulitple domains are not allowed");

    await this.sslAcme.initialize();
    await this.sslAcme.trashCertificate(domain?.[0]);

    const sites = await this.list();
    const site = sites.find((s) => s?.domain === domain?.[0]);
    this.update(site?.confId, {
      enableIndexing: site?.enableIndexing,
      enableSSL: false,
      forceSSL: site?.forceSSL,
      confType: site?.confType,
      domain: site?.domain,
      target: site?.target,
    }).then();
  }
  async renewCert(domain) {
    if (process?.env?.APP_ENV?.startsWith("dev")) {
      console.log(`🗿 Skipping, certificate installation on development server is not possible`);
      throw new Error(`🗿 Skipping, certificate installation on development server is not possible`);
    }

    // check invalid domains
    if (domain.length < 1) throw new Error("Domain is missing");
    if (domain.length !== 1) throw new Error("Mulitple domains are not allowed");

    // check domain renew availability
    const ___domain = sanitizeDomains(domain)?.[0];
    const installed = await this.findAllCert();
    const domainCert = installed.filter((itm) => itm?.domains.includes(___domain));
    if (domainCert.length < 1) throw new Error("Domain is not available for renew, please install a fresh ssl instead");

    // generating the new certificate
    console.log("🔄 Renewing SSL certificate...");
    await this.sslAcme.initialize();
    return this.sslAcme.issueCertificate(domain);
  }
  async renewCerts() {
    if (process?.env?.APP_ENV?.startsWith("dev")) {
      console.log(`🗿 Skipping, certificate installation on development server is not possible`);
      throw new Error(`🗿 Skipping, certificate installation on development server is not possible`);
    }

    // fetch all installed certs expiring in 1 day
    const sanitized = await this.findCertsExpiringIn(1);
    const promises = sanitized.map((itm) => {
      return this.sslAcme.issueCertificate(itm?.domains);
    });

    // loop through generating the new certificate
    console.log("🔄 Renewing SSL certificate...");
    await this.sslAcme.initialize();
    return await Promise.allSettled(promises);
  }

  async findAllCert() {
    try {
      const activeSites = await this.findActiveSites();
      const installed = await this.sslAcme.listCertificates();
      return this.#unwindCerts(installed, activeSites);
    } catch (error) {
      return [];
    }
  }
  async findCert(domain) {
    const certs = await this.findAllCert();
    return this.#filterCerts(certs, domain);
  }
  async findOneCert(domain) {
    const certs = await this.findCert(domain);
    return [].concat(certs)?.[0];
  }
  async findSslDomains() {
    const installed = await this.sslAcme.listCertificates();
    const certs = this.#unwindCerts(installed);

    return lo([])
      .concat(certs)
      .map((itm) => itm?.altNames)
      .flattenDeep()
      .uniq()
      .sort()
      .value();
  }
  async findActiveSites() {
    const sites = await this.list({ minimal: true });

    return lo([])
      .concat(sites)
      .filter((itm) => itm?.isActive)
      .map((itm) => itm?.domain)
      .flattenDeep()
      .uniq()
      .sort()
      .value();
  }
  async findCertsExpiringIn(dayCount) {
    // fetch all installed certs
    const installed = await this.findAllCert();
    // choose certs expiring in 1 day (dayCount)
    const expiring = installed.filter((itm) => itm?.daysLeft <= (dayCount || -1));
    // filter missing domains
    const sanitized = expiring.filter((itm) => itm.domains.length);
    // validating single domains only
    const validated = sanitized.map((itm) => {
      if (itm?.domains.length < 1) throw new Error("Domain is missing"); // this will never happen
      if (itm?.domains.length !== 1) throw new Error("Mulitple domains are not allowed");
      return itm;
    });

    return validated.sort((a, b) => a?.daysLeft - b?.daysLeft);
  }
  async listSslMappings(domain) {
    const result = await this.findCert(domain);
    return Object.fromEntries(result.map((c) => [c.domain, c.subject]));
  }
  getCertDirPaths() {
    return this.sslAcme.getPaths();
  }

  // ====================== Private Cert Methods ====================== //
  #filterCerts(certs, domain) {
    domain = sanitizeDomains(domain);
    if (!lo.isArray(domain) || lo.isEmpty(domain)) {
      return lo.filter(certs, (c) => !c?.isExpired);
    }

    return lo.filter(certs, (c) => !c?.isExpired && domain.includes(c?.domain));
  }
  #unwindCerts(certs, activeSites) {
    const getRemarks = ({ inActive, daysLeft }) => {
      if (inActive) {
        return daysLeft > 0 ? `CONF_NF: ${daysLeft} days left` : "CONF_NF";
      }

      return daysLeft > 0 ? `${daysLeft} days left` : "EXPIRED";
    };

    const domainsMap = [];
    for (const cert of certs) {
      for (const domain of cert?.altNames) {
        // const validNames = this.#isWildcardMatch(domain, n)
        const daysLeft = this.#daysLeft(cert?.expiresAt);
        const inActive = ![].concat(activeSites).includes(domain);

        domainsMap.push({
          ...cert,
          // validNames,
          isValid: daysLeft > 0,
          isExpired: daysLeft <= 0,
          daysLeft,
          remarks: getRemarks({ inActive, daysLeft }),
          domain: domain,
          domains: sanitizeDomains(domain),
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
  #isWildcardMatch(domain, wildcard) {
    if (domain === wildcard) return true;
    if (!wildcard.startsWith("*.")) return false;
    if (wildcard.split(".").length < 3) return false;

    // Remove "*." from the wildcard and compare
    const baseDomain = wildcard.slice(2);
    return domain.endsWith(baseDomain) && domain.split(".").length === baseDomain.split(".").length + 1;
  }
}
