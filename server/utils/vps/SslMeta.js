// import fsPath from "node:path";
// import fs from "fs-extra";
import https from "node:https";
import tls from "node:tls";
import lo from "lodash";

export default class SslMeta {
  constructor() {
    if (SslMeta.instance) {
      return SslMeta.instance;
    }

    this.db = localdb("certs-monitored");
    this.deletedDb = localdb("certs-monitored", "deletedData");
    this.cacheDb = localdb("certs-monitored-cache");
    this.cachedAtDb = localdb("certs-monitored-cache", "cachedAt");

    SslMeta.instance = this;
  }

  async fetch(domain) {
    try {
      if (!domain) throw new Error("Domain is missing");

      // return saved cache for success
      const cached = this.cacheDb.selectDataKey(domain, true).getData();
      if (cached && !cached?.error) return cached;

      const options = {
        host: domain,
        port: 443,
        method: "GET",
        timeout: 10000,
        rejectUnauthorized: false, // Allow self-signed certificates
        agent: new https.Agent({ maxCachedSessions: 0 }), // Disable session caching
      };

      const resp = await this.#httpsRequest(options);
      const peerCert = resp?.socket.getPeerCertificate();

      if (!peerCert || Object.keys(peerCert).length === 0) {
        throw new Error("INVALID_PEER_CERTIFICATE");
      }
      if (peerCert?.issuer && peerCert?.subject && JSON.stringify(peerCert?.issuer) === JSON.stringify(peerCert?.subject)) {
        throw new Error("SELF_SIGNED_SSL_CERTIFCATE");
      }

      const cert = {};
      cert.domain = domain;
      cert.error = null;
      cert.isCertAuth = peerCert?.ca;
      cert.subject_name = peerCert?.subject?.CN;
      cert.subject_names = lo([]).concat(peerCert?.subject?.CN, peerCert?.subjectaltname.replaceAll("DNS:", "").split(",")).map(lo.trim).uniq().value();
      cert.subject_alt_name = peerCert?.subjectaltname.replaceAll("DNS:", "").split(",");
      // Check if any of the certificate names (including wildcards) match the domain
      cert.validNames = cert.subject_names.filter((n) => this.#isWildcardMatch(domain, n));
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
      cert.isExpired = cert.days_left <= 0;
      cert.isValid = cert?.validNames.length > 0 && cert.days_left > 0;
      cert.remarks = this.#remarks(cert);
      if (!cert?.isValid) throw new Error("INVALID_SSL");
      if (cert?.isExpired) throw new Error("EXPIRED_SSL");

      // cache result
      this.cacheDb.selectDataKey(domain, true).setData(cert);
      return cert;
    } catch (err) {
      const cert = {};
      cert.domain = domain || "";
      cert.error = err?.message || err;
      cert.remarks = this.#remarks(cert);

      // cache result
      this.cacheDb.selectDataKey(domain, true).setData(cert);
      return cert;
    }
  }

  fetchAll(domains) {
    // make it lowercase for case insensitivity
    if (domains && Array.isArray(domains)) {
      domains = domains.map((domain) => domain.toLowerCase());
    }

    // fetch and merge data
    domains = cleanArray(this.db.getData(), domains);
    if (!Array.isArray(domains) && domains.length <= 0) return [];

    // update cachedAt value
    const dateNow = new Date();
    this.cachedAtDb.setData({ valueOf: dateNow.valueOf(), toISOString: dateNow.toISOString() });

    // Get certificates for all domains in parallel
    return Promise.all(domains.map((domain) => this.fetch(domain))).then((out) => cleanArray(out));

    // const final = {
    //   resolved: result?.filter((res) => res?.status !== "rejected").map((res) => res?.value),
    //   rejected: result?.filter((res) => res?.status === "rejected").map((res) => res?.reason),
    // };
  }

  fetchAllCached(domains) {
    // make it lowercase for case insensitivity
    if (domains && Array.isArray(domains)) {
      domains = domains.map((domain) => domain.toLowerCase());
    }

    // fetch and merge data
    domains = cleanArray(this.db.getData(), domains);
    if (!Array.isArray(domains) && domains.length <= 0) return [];

    // Get certificates for all domains in parallel
    const promises = domains.map((d) => {
      const data = this.cacheDb.selectDataKey(d, true).getData();
      if (data?.remarks) return data;

      return { domain: d, error: "NO_DATA", remarks: "Caching Failed" };
    });
    return Promise.all(promises).then((out) => cleanArray(out));
  }

  getCachedAt() {
    return this.cachedAtDb.getData();
  }

  list() {
    return cleanArray(this.db.getData());
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
    domains.map((domain) => this.cacheDb.selectDataKey(domain, true).deleteData());
  }

  hardRefresh(domains) {
    if (!Array.isArray(domains)) {
      throw new Error("Input must be an array");
    }
    // make it lowercase for case insensitivity
    domains = domains.map((domain) => domain.toLowerCase());

    // clear cache, fetch result
    const promises = domains.map(async (d) => {
      await this.cacheDb.selectDataKey(d, true).deleteData();
      return await this.fetch(d);
    });

    return Promise.all(promises);
  }

  purgeCacheAll() {
    // delete all cache entries
    this.cacheDb.deleteAllData();
  }

  async getCertsExpiringIn(dayCount) {
    // fetch all installed certs
    const monitored = await this.fetchAllCached();
    // choose certs expiring in 1 day (dayCount)
    const expiring = monitored.filter((itm) => itm?.days_left <= (dayCount || -1));
    // filter missing domains
    const sanitized = expiring.filter((itm) => itm.validNames.length);
    // validating single domains only
    const validated = sanitized.map((itm) => {
      if (itm?.validNames.length < 1) throw new Error("Domain is missing"); // this will never happen
      if (itm?.validNames.length !== 1) throw new Error("Mulitple domains are not allowed");
      return itm;
    });

    return validated.sort((a, b) => a?.days_left - b?.days_left);
  }

  #daysLeft(validTo) {
    const currentDate = new Date();
    const validToDate = new Date(validTo);
    const DAY_IN_MS = 1000 * 60 * 60 * 24;
    const diff_in_ms = validToDate - currentDate;
    return Math.floor(diff_in_ms / DAY_IN_MS);
  }

  #remarks(cert) {
    cert.error = String(cert?.error?.message || cert?.error || "");

    if (/EPROTO/.test(cert?.error)) return "SSL not active";
    if (/EAI_AGAIN/.test(cert?.error)) return "Domain not found";
    if (/ENOTFOUND/.test(cert?.error)) return "Domain not found";
    if (/TIMEDOUT/.test(cert?.error)) return "Domain server is down";
    if (/ECONNREFUSED/.test(cert?.error)) return "Domain server is down";
    if (/INVALID_SSL/.test(cert?.error)) return `SSL certificate is invalid`;
    if (/INVALID_PEER_CERTIFICATE/.test(cert?.error)) return `Peer certificate is invalid`;
    if (/SELF_SIGNED_SSL_CERTIFCATE/.test(cert?.error)) return `SSL certificate is self signed`;
    if (cert?.isExpired) return `SSL certifcate expired`;
    if (cert?.isValid) return `${cert?.days_left} days left`;

    return cert?.error || `UNKNOWN ERROR`;
  }

  #httpsRequest(options) {
    return new Promise((resolve, reject) => {
      const req = https.request(options, (res) => resolve(res));

      if (options?.timeout) req.setTimeout(options?.timeout, () => req.destroy([new Error("REQUEST_TIMEDOUT")]));
      req.on("error", (err) => reject(err));
      req.end();
    });
  }

  #isWildcardMatch(domain, wildcard) {
    if (domain === wildcard) return true;
    if (!wildcard.startsWith("*.")) return false;
    if (wildcard.split(".").length < 3) return false;

    // Remove "*." from the wildcard and compare
    const baseDomain = wildcard.slice(2);
    return domain.endsWith(baseDomain) && domain.split(".").length === baseDomain.split(".").length + 1;
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
    return `-----BEGIN CERTIFICATE-----\n${base64Cert.match(/.{0,64}/g)?.join("\n")}-----END CERTIFICATE-----\n`;
  }
}
