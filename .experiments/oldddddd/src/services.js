const lo = require("lodash");
const os = require("os");
const fs = require("fs");
fs.path = require("path");
const axios = require("jstub/utils/axios");
const shell = require("../utils/shell");
const nginx = require("../utils/NginxParser");
const funcs = require("jstub/functions");
const { TtlCache: cache } = require("jstub/utils/cache");

const confPath = process.env.NGINX_CONF_DIR;

class WebSites {
  constructor() {}

  parseHexaId(id) {
    const path = funcs.hexDecode(id);
    if (!shell.test("-f", path)) throw new Error("Invalid Path");

    const file = fs.path.parse(path);
    return { path, file };
  }

  async list() {
    const files = shell.find(confPath);
    const certs = await findCertificates("*");

    const ssls = []; // to be suggested on certificates page
    const data = [];
    for (const path of files) {
      //  ignore files other then .CONF or .DUMP
      if (!/\.(conf|dump)$/i.test(path)) {
        continue;
      }

      const _hex = funcs.hexEncode(path);
      const file = path.split("/").pop();
      const conf = await readConf(path);
      const isActive = file.split(".").pop() === "conf";

      data.push({
        _hex,
        path,
        file,
        sites: conf.sites,
        sitex: `/certs?domains=${funcs.hexEncode(conf.sites.join(","))}`,
        target: conf.target,
        sslCert: conf.sslCert,
        isActive,
        certs,
      });

      conf.sites.forEach((s) => {
        ssls.push(s);
        return;
      });
    }

    cache.set("all_domains", ssls, "6h");
    return data;
  }

  async find(id) {
    try {
      const { path, file } = this.parseHexaId(id);
      const conf = await readConf(path);
      return {
        action: "edit_site",
        config: {
          fileName: file?.name || "",
          sites: (conf?.sites || []).join(" "),
          target: conf?.target || "",
        },
      };
    } catch (e) {
      return {
        action: "new_site",
        config: {
          fileName: "",
          sites: "",
          target: "",
        },
      };
    }
  }

  async new({ fileName, sites, target }) {
    fileName = fileName || sites.split(" ")[0];
    fileName = fileName.replace(/[^0-9a-z]/gi, "_");

    const path = confPath + "/" + fileName + ".conf";
    await writeConf(path, {
      sites: sites,
      target: target,
    });
    incPendingUpdatesCount();
  }

  async edit(id, { fileName, sites, target }) {
    const { path, file } = this.parseHexaId(id);

    const conf = await readConf(path);
    const certs = await findCertificates(conf.sites);
    const sslDomains = Object.keys(certs);

    await writeConf(path, {
      sites: sites,
      target: target,
      sslCert: sslDomains.length ? certs[sslDomains[0]] : null,
    });

    fileName = fileName || sites.split(" ")[0];
    fileName = fileName.replace(/[^0-9a-z]/gi, "_");

    await shell.mv(path, file.dir + "/" + fileName + ".conf");
    incPendingUpdatesCount();
  }

  async enable(id) {
    const { path, file } = this.parseHexaId(id);

    await shell.mv(path, file.dir + "/" + file.name + ".conf");
    incPendingUpdatesCount();
  }

  async disable(id) {
    const { path, file } = this.parseHexaId(id);

    await shell.mv(path, file.dir + "/" + file.name + ".dump");
    incPendingUpdatesCount();
  }

  async delete(id) {
    const { path, file } = this.parseHexaId(id);

    await shell.mv(path, file.dir + "/.trashed-" + file.name + ".trash");
    incPendingUpdatesCount();
  }

  async rebuild() {
    if (!shell.test("-d", confPath)) throw new Error("Invalid Path");

    const files = shell.find(confPath);
    const promises = files
      .filter((path) => /\.(conf|dump)$/i.test(path))
      .map(async (path) => {
        const conf = await readConf(path);
        const cert = await findCertificates(conf.sites);
        const sslDomains = Object.keys(cert);

        return writeConf(path, {
          sites: conf.sites,
          target: conf.target,
          sslCert: sslDomains.length ? cert[sslDomains[0]] : null,
        });
      });

    await Promise.all(promises);
    incPendingUpdatesCount();
  }
}

class Certificates {
  constructor() {}

  async list({ includeSuggestions }) {
    const certs = await findCertificates();

    if (includeSuggestions) {
      const installed = certs.map((i) => i.domain);
      const domains = cache.get("all_domains") || [];
      lo.difference(domains, installed).forEach((i) => {
        return certs.push({
          certificate_name: i,
          certificate_path: "---",
          domains: "---",
          expiry_date: "---",
          key_type: "---",
          private_key_path: "---",
          serial_number: "---",
          domain: i,
        });
      });
    }

    return certs;
  }

  async install(domains) {
    domains = _sanitizeDomains(domains).map((d) => `--domain ${d}`);
    await shell.sudoExec("certbot certonly --nginx --no-redirect " + domains.join(" "));
    incPendingUpdatesCount();
    cache.delete("findCertificates");
  }

  async delete(domain) {
    [domain] = _sanitizeDomains(domain);
    await shell.sudoExec("certbot delete --cert-name " + domain);
    incPendingUpdatesCount();
    cache.delete("findCertificates");
  }
}

module.exports = {
  sites: new WebSites(),
  certs: new Certificates(),
};

function incPendingUpdatesCount(num) {
  num = num || 1;
  let count = cache.get("pending_update_count") || 0;
  count = count + num;

  cache.set("pending_update_count", count, "1day");
  return count;
}

// helpers for write handle
async function readConf(path) {
  try {
    const raw = shell.cat(path);
    if (!raw) return {};

    // parse from json-string
    const match = String(raw).match(/\#\#\#\s*(.+)\s*\#\#\#/);
    if (!match) throw "oops";

    const jsonConf = JSON.parse(match[1]);
    jsonConf.target = jsonConf.target.split(":::")[1] || jsonConf.target.split(":::")[0];

    return jsonConf;
  } catch (e) {
    // parse from configuration
    const config = nginx.toJSON(raw);
    if (!config?.server) return {};

    const findSslCert = (val) => {
      const match = String(val).match(/letsencrypt\/live\/([^\/]+)\//i);
      return match[1] || match;
    };

    const output = {};
    output.sites = (config?.server?.server_name || "").split(" ").filter(Boolean);
    output.target = config?.server["location /"]?.rewrite || config?.server["location /"]?.proxy_pass || config?.server["location /"]?.root || config?.server?.root || "";
    output.sslCert = findSslCert(config?.server?.ssl_certificate);

    return output;
  }
}

async function writeConf(path, obj) {
  try {
    obj = { ...obj };

    if (!obj.target) return null;
    obj.sites = _sanitizeDomains(obj.sites);
    obj.target = _detectTargets(obj.target);

    const listen = ["80", "[::]:80"];
    let sslConf;
    if (obj.sslCert) {
      listen.push("443 ssl", "[::]:443 ssl");
      sslConf = {
        include: "/etc/letsencrypt/options-ssl-nginx.conf",
        ssl_dhparam: "/etc/letsencrypt/ssl-dhparams.pem",
        ssl_certificate: `/etc/letsencrypt/live/${obj.sslCert}/fullchain.pem`,
        ssl_certificate_key: `/etc/letsencrypt/live/${obj.sslCert}/privkey.pem`,
      };
    }

    // handling configuration data
    const jsonString = JSON.stringify({
      sites: obj.sites,
      target: obj.target,
      sslCert: obj.sslCert || null,
    });

    const configData = nginx.toConf({
      server: {
        listen,
        server_name: obj.sites.join(" "),
        error_page: ["404 /404.html", "500 502 503 504 /50x.html"],
        ["location /"]: _build_Location(obj.target),
        ...sslConf,
      },
    });

    await shell.echo("###" + jsonString + "###\n\n" + configData).to(path);
    return readConf(path);
  } catch (err) {
    console.error(err);
    return null;
  }
}

async function findCertificates(sites) {
  try {
    let cached = cache.get("findCertificates");
    if (cached && cached.length > 0) {
      return sites ? _filterCertificates(cached, sites) : _unwindCertificates(cached);
    }

    // fetching raw certificate from cli/logs
    let certRaw;
    if (process.env.NODE_ENV === "production") {
      certRaw = await shell.sudoExec("certbot certificates");
    } else {
      certRaw = require("../utils/test-certificates-rawlogs")();
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
    cache.set("findCertificates", result.map(funcs.sortObj), "5min");
    return await findCertificates(...arguments);
  } catch (error) {
    console.error("findCertificates", error);
    return [];
  }
}

function _unwindCertificates(certs) {
  const domainsMap = [];
  for (const c of certs) {
    c.domains.split(" ").forEach((d) => {
      domainsMap.push({ ...c, domain: d });
    });
  }

  return domainsMap;
}

function _filterCertificates(certs, sites) {
  const entries = _unwindCertificates(certs).map((c) => [c.domain, c.certificate_name]);
  const certObj = Object.fromEntries(entries);
  return lo.isArray(sites) && !lo.isEmpty(sites) ? lo.pick(certObj, sites) : certObj;
}

function _sanitizeDomains(val) {
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

function _detectTargets(target) {
  target = funcs.trimStr(target, "/");

  if (/^https?\:\/\/0\.0\.0\.0\:/i.test(target)) {
    return `proxy:::${target}/`;
  }
  if (/^https?\:\/\//i.test(target)) {
    return `redirect:::${target}`;
  }
  return `index:::/${target}/`;
}

function _build_Location(target) {
  const [type, dest] = target.split(":::");
  switch (type) {
    case "redirect":
      return {
        rewrite: `^(.*)$ ${dest}$1 redirect`,
      };

    case "proxy":
      return {
        proxy_pass: dest,
        proxy_set_header: [
          // proxy headers
          "Host $http_host",
          "X-Real-IP $remote_addr",
          "X-Forwarded-For $proxy_add_x_forwarded_for",
          "X-Forwarded-Proto $scheme",
        ],
      };

    case "index":
      return {
        root: dest,
        index: "index.html index.htm index.php",
        try_files: "$uri $uri/ =404",
        // autoindex: "on",
        include: "/etc/nginx/snippets/php.conf",
      };
  }

  return null;
}

function raw2obj(rawData) {
  const getCommonDelimiterForm = (rawData, delimiter) => {
    const delimiterPattern = new RegExp(delimiter + "\\S+", "g");
    const delimiterWSpacePattern = new RegExp(delimiter + " ", "g");
    const delimiterMatches = rawData.match(delimiterPattern) || [];
    const delimiterWSpaceMatches = rawData.match(delimiterWSpacePattern) || [];

    // console.log({
    //     delimiterMatches,
    //     delimiterWSpaceMatches,
    // });

    if (delimiterMatches.length > delimiterWSpaceMatches.length) return delimiter;

    return delimiter + " ";
  };

  const delimiter = getCommonDelimiterForm(rawData, ":");

  const lines = rawData.replace(/:\s*\r\n/g, ": ").split("\n");

  const result = {};
  for (let line of lines) {
    line = line.trim();

    // colon space because that's the standard delimiter - not ':' as that's used in eg, http links
    if (line && line.includes(delimiter)) {
      const lineParts = line.split(delimiter);

      // 'Greater than' since lines often have more than one colon, eg values with URLs
      if (lineParts.length >= 2) {
        const key = lineParts[0].trim();
        const val = lineParts.splice(1).join(delimiter).trim();

        // If multiple lines use the same key, combine the values
        if (key in result) {
          result[key] = `${result[key]} ${val}`;
        } else {
          result[key] = val;
        }
      }
    }
  }
  return result;
}
