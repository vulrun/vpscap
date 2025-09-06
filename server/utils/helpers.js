import fsPath from "node:path";
import fs from "fs-extra";
import axios from "axios";
import { minify } from "html-minifier-terser";

import nodemailer from "nodemailer";
import Handlebars from "handlebars";
import JsonDbExtended from "./JsonDbExtended";

// import { sha256 as SHA256 } from "@noble/hashes/sha256";
import VpsCertMeta from "@@/server/utils/vps/SslMeta";
import VpsWebSites from "@@/server/utils/vps/WebSites";
import AccountJson from "@@/server/utils/vps/AccountJson";

export function fetchApi(...args) {
  return axios
    .create()(...args)
    .then((res) => res?.data)
    .catch((err) => err);
}

// export function sha256(str) {
//   str = typeof str === "string" ? str : JSON.stringify(str);
//   return toHex(SHA256(str));
// }

// export const readFile = (filePath) => {
//   const cwd = process.cwd();
//   filePath = filePath.replace(/^[@~]/, cwd);
//   filePath = fsPath.resolve(filePath);

//   if (!fs.existsSync(filePath)) {
//     fs.closeSync(fs.openSync(filePath, "w"));
//   }

//   return fs.readFileSync(filePath, "utf-8");
// };

export function base64UrlEncode(input, encoding) {
  // input type to buffer
  if (typeof input === "string") {
    input = Buffer.from(input, encoding || "utf8");
  } else if (Array.isArray(input)) {
    input = Buffer.concat(input);
  }

  if (!Buffer.isBuffer(input)) throw new Error("base64UrlEncode: invalid input");

  return input
    .toString("base64")
    .replace(/\+/g, "-") // Replace '+' with '-'
    .replace(/\//g, "_") // Replace '/' with '_'
    .replace(/=+$/, ""); // Remove trailing '='
}

export function base64UrlDecode(input, encoding) {
  if (typeof input !== "string") throw new Error("base64UrlDecode: invalid input");

  let base64 = input
    .replace(/-/g, "+") // Replace '-' with '+'
    .replace(/_/g, "/"); // Replace '_' with '/'

  // Pad with '=' to make the length of the string a multiple of 4
  switch (base64.length % 4) {
    case 1:
      base64 += "===";
      break;
    case 2:
      base64 += "==";
      break;
    case 3:
      base64 += "=";
      break;
  }

  const buffered = Buffer.from(base64, "base64");

  if (encoding === "buffer") return buffered;
  if (encoding === "json") return JSON.stringify(buffered);

  return buffered.toString(encoding || "utf8");
}

export function logRequest(method, url, status, duration) {
  console.log(`[${new Date().toISOString()}] ${method} ${url} ~ ${status} ~ ${duration}ms`);
}

export function localdb(fileName, dataKey) {
  if (!fileName) throw new Error("DB filename is missing");

  return new JsonDbExtended({ dbFolder: ".localdb", dbName: fileName, dataKey });
}

export async function sendEmailNow({ to, subject, body }) {
  try {
    if (!to) throw new Error("`to` is missing for sendEmailNow.");
    if (!subject) throw new Error("`subject` is missing for sendEmailNow.");
    if (!body) throw new Error("`body` is missing for sendEmailNow.");

    const accJson = new AccountJson();
    const config = accJson.getData(["smtpUrl", "smtpFrom", "smtpUseByUrl", "smtpTestStatus"]);
    if (!config?.smtpUrl) throw new Error("`smtpUrl` is missing for sendEmailNow.");
    if (!config?.smtpFrom) throw new Error("`smtpFrom` is missing for sendEmailNow.");

    const transporter = nodemailer.createTransport(config?.smtpUrl);
    await transporter.verify();

    const mailOptions = {};
    mailOptions.from = config?.smtpFrom;
    mailOptions.to = to;
    mailOptions.subject = subject;
    mailOptions.headers = {
      "List-Help": `<mailto:${config?.smtpFrom}?subject=NEED-HELP>`,
      "List-Unsubscribe": `<mailto:${config?.smtpFrom}?subject=UNSUBSCRIBE>`,
    };
    if (body.startsWith(`<!DOCTYPE`) || body.startsWith(`<html`)) {
      mailOptions.html = body;
    } else {
      mailOptions.text = body;
    }

    const mailResp = await transporter.sendMail(mailOptions);
    console.log("🚀 ~ sendEmailNow ~ mailResp:", mailResp);

    const sentInfo = {};
    sentInfo.response = String(mailResp?.response || "").toUpperCase();
    sentInfo.success = mailResp?.response.includes("OK");
    sentInfo.remarks = `Email successfully sent to \`${mailResp?.accepted.join(", ")}\`.`;
    sentInfo.__raw = mailResp;

    return sentInfo;
  } catch (err) {
    console.log("❌ ~ sendEmailNow ~ err:", err);
    return {
      success: false,
      remarks: `Failed to send email. ${err?.message}`,
      message: err?.message,
      response: err?.message,
      __raw: null,
    };
  }
}

export async function getAlertsHtml(context) {
  Handlebars.registerHelper("ternary", function (test, yes, no) {
    return test ? yes : no;
  });

  // LOAD HTML TEMPLATE
  const templatePath = fsPath.join(process.cwd(), "server/utils/raw/ssl-alert-template.html");
  const templateRaw = fs.readFileSync(templatePath, "utf-8");
  const templateHtml = Handlebars.compile(templateRaw)(context || {});

  return minify(templateHtml, {
    collapseWhitespace: true,
    conservativeCollapse: true,
    removeComments: true,
    removeRedundantAttributes: true,
    removeEmptyAttributes: true,
    minifyCSS: true, // Inline CSS gets minified
    minifyJS: true, // Inline JS gets minified (if any, rare in emails)
    useShortDoctype: true,
    keepClosingSlash: true, // Important for self-closing tags in XHTML
    removeAttributeQuotes: false, // Keep quotes for better email client compatibility
  });
}

export async function runCronJobTask(jobSlug, runForcefully) {
  if (!jobSlug) throw new Error("CronJobTask slug is missing");

  const accJson = new AccountJson();
  const vpsMeta = new VpsCertMeta();
  const vpsSite = new VpsWebSites();

  const accObj = accJson.getData("*");
  if (!runForcefully && !accObj?.cronJobSettings?.[jobSlug]) {
    console.log("Skipping CronJobTask as per settings.");
    return;
  }

  switch (jobSlug) {
    // renew ssl installs certificates
    case "installed_certs_daily_renew": {
      await vpsSite.renewCerts();
      await vpsSite.nginxReload();
      break;
    }

    // purge and refresh all ssl monitors cache
    case "monitored_certs_daily_refresh": {
      await vpsMeta.purgeCacheAll();
      await vpsMeta.fetchAll();
      break;
    }

    // fetch fresh ssl monitors in background
    case "monitored_certs_hourly_retry": {
      await vpsMeta.fetchAll();
      break;
    }

    case "installed_certs_daily_alerts": {
      const expiringCerts = await vpsSite.findCertsExpiringIn(7);
      if (!expiringCerts.length) return; // exit, if there are no certs

      const riskyCount = expiringCerts.reduce((acc, crt) => (crt.daysLeft <= 3 ? acc + 1 : acc), 0);

      const subject = `[Action Required] SSL Certificates expiring soon` + (!riskyCount ? "" : ` (${riskyCount})`);
      const heading = `SSL Certificate Expiry Alert`;
      const serverName = `${accObj.vpsUser}@${accObj.hostName}`;
      const generatedAt = new Date().toISOString().split(".")[0].replace("T", " ");
      const dashboardUrl = `${accObj?.homeUrl}/#settings`;
      const unsubscribeUrl = `${accObj?.homeUrl}/#settings/notifications`;

      const certs = expiringCerts.map((crt) => ({
        notes: crt?.domains.filter((c) => c !== crt?.domain).join(", "),
        domain: crt?.domain,
        issuer: `${crt?.issuedBy?.organizationName}, ${crt?.issuedBy?.countryName}`,
        expiresOn: `${(crt?.expiresAtIso || "")?.substring(0, 10)}`,
        daysLeft: crt?.daysLeft == 1 ? `${crt?.daysLeft} day` : crt?.daysLeft > 0 ? `${crt?.daysLeft} days` : `EXPIRED`,
        badgeClass: crt?.daysLeft <= 1 ? `badge-red` : crt?.daysLeft <= 3 ? `badge-orange` : crt?.daysLeft <= 7 ? `badge-yellow` : `badge-gray`,
      }));

      const html = await getAlertsHtml({
        subject,
        heading,
        serverName,
        generatedAt,
        dashboardUrl,
        unsubscribeUrl,
        riskyCount,
        certs,
      });

      const sentInfo = await sendEmailNow({
        to: accObj?.username,
        subject,
        body: html,
      });

      return sentInfo;
    }

    // todo: add daily alerts code
    case "monitored_certs_daily_alerts": {
      const expiringCerts = await vpsMeta.getCertsExpiringIn(7);
      if (!expiringCerts.length) return; // exit, if there are no certs

      const riskyCount = expiringCerts.reduce((acc, crt) => (crt.days_left <= 3 ? acc + 1 : acc), 0);

      const subject = `[Action Required] Monitored Certificates expiring soon` + (!riskyCount ? "" : ` (${riskyCount})`);
      const heading = `Monitored Certificate Expiry Alert`;
      const serverName = `${accObj.vpsUser}@${accObj.hostName}`;
      const generatedAt = new Date().toISOString().split(".")[0].replace("T", " ");
      const dashboardUrl = `${accObj?.homeUrl}/#settings`;
      const unsubscribeUrl = `${accObj?.homeUrl}/#settings/notifications`;

      const certs = expiringCerts.map((crt) => ({
        notes: crt?.subject_alt_name.filter((c) => c !== crt?.domain).join(", "),
        domain: crt?.domain,
        issuer: `${crt?.issuer_org}, ${crt?.issuer_loc}`,
        expiresOn: `${(crt?.expiry || "")?.substring(0, 10)}`,
        daysLeft: crt?.days_left == 1 ? `${crt?.days_left} day` : crt?.days_left > 0 ? `${crt?.days_left} days` : `EXPIRED`,
        badgeClass: crt?.days_left <= 1 ? `badge-red` : crt?.days_left <= 3 ? `badge-orange` : crt?.days_left <= 7 ? `badge-yellow` : `badge-gray`,
      }));

      const html = await getAlertsHtml({
        subject,
        heading,
        serverName,
        generatedAt,
        dashboardUrl,
        unsubscribeUrl,
        riskyCount,
        certs,
      });

      const sentInfo = await sendEmailNow({
        to: accObj?.username,
        subject,
        body: html,
      });

      return sentInfo;
    }

    default:
      throw new Error("Invalid CronJobTask");
  }
}
