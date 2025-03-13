import lo from "lodash";

export default class VpsCertbot {
  constructor() {
    this.db = localdb("certs-installed-cache");
  }

  #filterCerts(certs, sites) {
    if (!lo.isArray(sites) || lo.isEmpty(sites)) return certs;

    return lo.filter(certs, (c) => sites.includes(c.domain));
  }

  #unwindCerts(certs) {
    const domainsMap = [];
    for (const c of certs) {
      c.domains = c.domains.split(" ");
      c.domains.forEach((d) => {
        domainsMap.push({
          ...c,
          domain: d,
          expiry: new Date(c?.expiry_date.substring(0, 25)).toISOString(),
          days_left: this.#daysLeft(c?.expiry_date.substring(0, 25)),
        });
      });
    }

    return domainsMap;
  }

  #daysLeft(validTo) {
    const currentDate = new Date();
    const validToDate = new Date(validTo);
    const DAY_IN_MS = 1000 * 60 * 60 * 24;
    const diff_in_ms = Math.abs(validToDate - currentDate);
    return Math.floor(diff_in_ms / DAY_IN_MS);
  }

  async list(sites) {
    try {
      let saved = this.db.getData();
      if (saved && saved.length > 0) {
        return this.#filterCerts(this.#unwindCerts(saved), sites);
      }

      // fetching raw certificate from sample/cli
      let certRaw;
      if (process.env.NUXT_APP_ENV.startsWith("dev")) {
        certRaw = readFile("~/.localdb/certbot-certificates-raw-sample.txt");
      } else {
        certRaw = await sudoExec("certbot certificates");
      }

      // remove un-necessary lines
      let lines = certRaw.split("\n").filter((line) => {
        if (!line) return false;
        if (/^(\-|found)/i.test(line)) return false;
        return true;
      });

      // remove white-spaces & parse each line
      lines = lo
        .chain(lines)
        .map(lo.trim)
        .reverse()
        .map((each) => {
          const [k, ...v] = each.split(":");
          return [lo.snakeCase(k), lo.trim(v.join(":"))];
        })
        .value();

      // bundling each certificate in their room
      let object = {};
      let result = [];
      for (const line of lines) {
        const [key, val] = line;

        object[key] = val;
        if (key === "certificate_name") {
          // result[val] = object;
          result.push(object);
          object = {};
        }
      }

      this.db.setData(result, "1min");

      // calling self to return from saved/cached data
      return await this.list(...arguments);
    } catch (error) {
      console.error("VpsCertbot ~ list:", error);
      return [];
    }
  }

  async listMapping(sites) {
    const result = await this.list(sites);
    return Object.fromEntries(result.map((c) => [c.domain, c.certificate_name]));
  }

  #sanitizeDomains(val) {
    if (!val) return "";

    const validDomain = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/i;
    val = String(val || "")
      // domain with spaces separated
      .replace(/[^a-z0-9\-\.]/gi, " ")
      // remove multiple spaces
      .replace(/\s+/g, " ")
      // to array
      .split(" ");

    // remove duplicates, filter valid domains, then sorting
    val = Array.from(new Set(val)).filter((site) => validDomain.test(site));
    val.sort();
    return val;
  }

  async install(domains) {
    domains = this.#sanitizeDomains(domains).map((d) => `--domain ${d}`);
    await sudoExec("certbot certonly --nginx --no-redirect " + domains.join(" "));
    this.deleteData();
  }

  async delete(domain) {
    [domain] = this.#sanitizeDomains(domain);
    await sudoExec("certbot delete --cert-name " + domain);
    this.deleteData();
  }
}
