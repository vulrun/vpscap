import fsPath from "node:path";
import fs from "fs-extra";
// import fs from "node:fs/promises";
// import fs from "node:fs";
// import os from "node:os";
import dns from "node:dns/promises";
import lo from "lodash";
import { z } from "zod";
import * as envs from "@/server/utils/bin/env.js";
import shell from "@/server/utils/shell";
import { extendObj } from "@/server/utils/helpers.js";
import NginxParser from "@/server/utils/NginxParser";

const cleanArray = (...val) => [].concat(...val).filter(Boolean);
const NUXT_LOCAL_DB_DIR = process?.env?.NUXT_LOCAL_DB_DIR || ".localdb/";

export default class NginxHandler {
  #challengesPath = fsPath.resolve(NUXT_LOCAL_DB_DIR, "acme-ssl", "challenges");
  #allowedKeys = ["enableIndexing", "enableSSL", "forceSSL", "confType", "domain", "target"];

  constructor(args) {
    this.nginx = new NginxParser();
    this.webSites = args?.webSites;
  }

  sanitizeDomains(val) {
    if (!val) return [];

    val = String(val || "")
      // domain with spaces separated
      .replace(/[^a-z0-9\-\.]/gi, " ")
      // remove multiple spaces
      .replace(/\s+/g, " ")
      // to array
      .split(" ");

    const validDomainRegex = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/i;
    // remove duplicates, filter valid domains, then sorting
    val = Array.from(new Set(val)).filter((site) => validDomainRegex.test(site));
    val.sort();
    return cleanArray(val);
  }

  validateTarget({ enableIndexing, enableSSL, forceSSL, confType, domain, target }) {
    const isHttpStr = /^(https?\:\/\/)/i.test(target);
    const isBindStr = /^(https?\:\/\/)?(0\.0\.0\.0)(\:\d{2,5})/i.test(target);
    const isValidUrl = /^(https?\:\/\/)?([a-zA-Z0-9\-\.]+)(\:\d{2,5})?(\/[^\s]*)?/i.test(target);
    const isLocalIP = /^(https?\:\/\/)?(localhost|127\.0\.0\.1|192\.168\.\d{1,3}\.\d{1,3}|10\.\d{1,3}\.\d{1,3}\.\d{1,3}|172\.(1[6-9]|2[0-9]|3[01])\.\d{1,3}\.\d{1,3})/i.test(target);

    // if (forceSSL === true && enableSSL === false) throw new Error("SSL must be enabled first.");
    if (confType !== "serve" && !isHttpStr) throw new Error("Invalid protocol. Only HTTP and HTTPS URL(s) are allowed.");
    // if (confType !== "serve" && enableIndexing === true) throw new Error("Indexing only works with serve directories.");

    switch (confType) {
      case "serve": {
        const isDirPath = target.startsWith("/");
        if (!isDirPath) throw new Error(`Invalid serve target for [${domain}]`);

        return true;
      }

      case "proxy": {
        if (isLocalIP) throw new Error("Localhost or Internal IP not allowed.");
        if (!isBindStr && !isValidUrl) throw new Error(`Invalid proxy target`);

        return true;
      }

      case "redirect": {
        if (isLocalIP) throw new Error("Localhost or Internal IP not allowed.");
        if (isBindStr) throw new Error("Localhost or Internal IP not allowed.");
        if (!isValidUrl) throw new Error("Invalid URL format.");

        return true;
      }
    }

    throw new Error(`Invalid Target for ${confType}`);
  }

  async validateAndSanitize(input) {
    input.domain = this.sanitizeDomains(input?.domain);

    const ConfSchema = z
      .object({
        //
        enableIndexing: z.boolean().default(false),
        enableSSL: z.boolean().default(false),
        forceSSL: z.boolean().default(false),
        confType: z.string().refine((val) => ["serve", "proxy", "redirect"].includes(val), { message: "Invalid Conf Type" }),
        domain: z
          .string()
          .trim()
          .array()
          .nonempty()
          .refine((val) => val.length > 0, { message: "Invalid Domains" }),
        target: z
          .string()
          .trim()
          .min(10)
          .transform((val) => lo.trimEnd(val, "/")),
      })
      .strict()
      .refine(this.validateTarget);

    // if success please return
    // const allowedKeys = Object.keys(zodToJsonSchema(ConfSchema)?.properties);
    const result = await ConfSchema.safeParseAsync(lo.pick(input, this.#allowedKeys));
    if (result?.success) return result?.data;

    // handling errors
    const firstError = result?.error?.issues?.[0];
    throw new Error(`${input?.domain} ~ ${firstError?.path} ERROR: ${firstError?.message?.toLowerCase()}`);
  }

  async touchConf(path) {
    if (fs.existsSync(path) === false) {
      fs.writeFileSync(path, "");
    }
  }

  async readConf(path) {
    const raw = shell.cat(path);
    try {
      if (!raw) return {};

      // parse from json-string
      const match = String(raw).match(/\#\#\#\s*(.+)\s*\#\#\#/);
      if (!match) throw "oops";

      const jsonData = JSON.parse(match?.[1]);

      // handling previous object schema
      if (jsonData?.sites) {
        jsonData.domain = jsonData?.sites;
        delete jsonData.sites;
      }

      jsonData.domain = cleanArray(jsonData?.domain).join(" ");
      return JSON.parse(JSON.stringify(jsonData));
    } catch (e) {
      // parse from configuration
      const config = this.nginx.toJSON(raw);
      if (!config?.server) return null;

      const domain = this.sanitizeDomains(config?.server?.server_name || "").join(" ");
      const sslCert = String(config?.server?.ssl_certificate).match(/letsencrypt\/live\/([^\/]+)\//i)?.[1] || null;
      const confMeta = await this.#fetchConfMeta(config?.server);
      return { ...confMeta, domain, sslCert };
    }
  }

  async writeConf(path, obj) {
    obj = lo.pick(obj, this.#allowedKeys);
    const isDefaultConf = path.endsWith("_default.conf");
    const portSuffix = isDefaultConf ? "default_server" : "";

    obj = JSON.parse(JSON.stringify(obj));

    // converting the input domain to a array of sanitized domains
    obj.domain = isDefaultConf ? ["_"] : this.sanitizeDomains(obj?.domain);

    // checking for validations
    if (obj?.domain?.length <= 0) throw new Error("Domain is missing");
    if (obj?.domain?.length !== 1) throw new Error("Multiple domains are not supported anymore");

    // converting back array to comma-separated string
    obj.domain = obj?.domain?.join();

    // preparing root location
    const locations = {};
    locations.root = { "location /": await this.#buildConfRootLocation(obj) };
    if (!locations?.root) throw new Error("Error generting configuration file");

    // preparing other locations
    locations.acmeChallenges = {
      "location /.well-known/acme-challenge/": {
        alias: this.#challengesPath + "/",
      },
    };
    locations.forceSSL = { "location /": { return: "301 https://$host$request_uri" } };
    locations.htaccessDeny = { "location ~ /.ht": { deny: "all" } };
    locations.phpPlain = {
      "location ~ .php$": {
        default_type: "text/plain",
        try_files: "$uri $uri/ =404",
        root: obj?.target,
      },
    };
    locations.phpFpm = {
      "location ~ .php$": {
        include: ["snippets/fastcgi-php.conf", "fastcgi_params"],
        fastcgi_pass: "unix:/var/run/php/php7.4-fpm.sock",
        fastcgi_param: "SCRIPT_FILENAME $document_root$fastcgi_script_name",
      },
    };

    // setting server conf blocks for port 80
    const server80 = {};
    server80.listen = [`80 ${portSuffix}`.trim(), `[::]:80 ${portSuffix}`.trim()];
    server80.server_name = obj?.domain;
    server80.error_page = ["404 /404.html", "500 502 503 504 /50x.html"];
    Object.assign(server80, locations?.acmeChallenges);
    if (obj?.forceSSL && obj?.enableSSL) {
      Object.assign(server80, locations?.forceSSL);
    } else {
      Object.assign(server80, locations?.root);
      // if (obj?.confType === "serve") Object.assign(server80, locations?.phpPlain);
      if (obj?.confType === "serve") Object.assign(server80, locations?.htaccessDeny);
    }

    // setting server conf blocks for port 443
    const server443 = {};
    if (obj?.enableSSL) {
      let sslCert = await this.webSites.findOneCert(obj?.domain);
      console.log("🚀 ~ NginxHandler ~ writeConf ~ sslCert:", sslCert);
      // try to install ssl certificate
      if (!sslCert) {
        await this.webSites.installCert(obj?.domain);
        sslCert = await this.webSites.findOneCert(obj?.domain);
      }
      // finally throw an error
      if (!sslCert) throw new Error("Sorry, we tried to install certificate but failed. Please contact administrator");

      server443.listen = [`443 ssl ${portSuffix}`.trim(), `[::]:443 ssl ${portSuffix}`.trim()];
      server443.server_name = obj?.domain;
      server443.error_page = ["404 /404.html", "500 502 503 504 /50x.html"];
      Object.assign(server80, locations?.acmeChallenges);
      Object.assign(server443, locations?.root);
      // if (obj?.confType === "serve") Object.assign(server443, locations?.phpPlain);
      if (obj?.confType === "serve") Object.assign(server443, locations?.htaccessDeny);

      if (sslCert?.certName && sslCert?.certPath && sslCert?.certKeyPath) {
        const sslPaths = this.webSites.getCertDirPaths();
        Object.assign(server443, {
          include: sslPaths?.sslOptionsNginx,
          // ssl_dhparam: sslPaths?.sslDhParamsPath,
          ssl_certificate: sslCert?.certPath,
          ssl_certificate_key: sslCert?.certKeyPath,
        });
      }
    }

    const confContent = [
      //
      `###${JSON.stringify(obj)}###`,
      // !isDefaultConf ? null : this.nginx.toConf({ types: { "text/html": "php" }, default_type: "application/octet-stream12" }).trim(),
      this.nginx.toConf(!obj?.enableSSL ? null : { server: server443 }).trim(),
      this.nginx.toConf({ server: server80 }).trim(),
    ]
      .filter(Boolean)
      .join("\n\n");

    // await shell.echo(confContent).to(path);
    fs.writeFileSync(path, confContent);
    return await this.readConf(path);
  }

  async #buildConfRootLocation(obj) {
    if (obj?.confType === "serve") {
      return {
        root: obj?.target,
        index: "index.html index.htm index.php index.nginx-debian.html",
        try_files: "$uri $uri/ =404",
        autoindex: obj?.enableIndexing ? "on" : "off",
      };
    }

    if (obj?.confType === "redirect") {
      return { rewrite: `^(.*)$ ${obj?.target}$1 redirect` };
    }

    if (obj?.confType === "proxy") {
      return {
        proxy_pass: obj?.target,
        proxy_set_header: [
          // proxy headers
          "Host $http_host",
          "X-Real-IP $remote_addr",
          "X-Forwarded-For $proxy_add_x_forwarded_for",
          "X-Forwarded-Proto $scheme",
        ],
      };
    }

    return null;
  }

  async #fetchConfMeta(server) {
    const location = server?.["location /"];

    if (location?.proxy_pass) return { confType: "proxy", target: location?.proxy_pass };
    if (location?.rewrite) return { confType: "redirect", target: location?.rewrite };
    if (location?.root || server?.root) return { confType: "serve", target: location?.root || server?.root };

    return null;
  }

  async testConfs() {
    const returned = await sudoExec("nginx -t 2>&1");
    if (!/ok/i.test(returned || "")) throw new Error(`Error in nginx conf, ${returned}`);

    console.log(`✅ nginx configuration test passed`);
    return "OK";
  }

  async reload() {
    try {
      await this.testConfs();
      // const reloaded = await sudoExec("nginx -s reload");
      const reloaded = await sudoExec("systemctl reload nginx");
      console.log(`✅ nginx configuration reloaded`, reloaded);
    } catch (err) {
      console.log("❌ nginx configuration reloaded:", err?.message || err);
      return null;
    }
  }
}
