import { e as eventHandler, W as WebSites, S as SslMeta, s as sudoExec } from '../../../nitro/nitro.mjs';
import os from 'node:os';
import lo from 'lodash';
import * as envfile from 'envfile';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'ms';
import 'axios';
import 'fs-extra';
import 'node:dns/promises';
import 'shelljs';
import 'acme-client';
import 'node-forge';
import 'zod';
import 'glob';
import 'node:url';
import 'bcryptjs';

const ipv6Regex = /([0-9a-fA-F]{1,4}:){1,7}[0-9a-fA-F]{1,4}/;
const cleanArray = (...args) => [].concat(...args).filter(Boolean);
const cleanUniqArray = (...args) => lo.uniq(cleanArray(...args));
const sslio = new SslMeta();
const sites = new WebSites();
const controllers = {
  async sslStats() {
    const cmeta = await sslio.list();
    const cinst = await sites.findAllCert();
    return `${cmeta == null ? void 0 : cmeta.length} monitored, ${cinst == null ? void 0 : cinst.length} installed certificates`;
  },
  async webStats() {
    const siteList = await sites.list();
    const actives = siteList.reduce((acc, itm) => acc += (itm == null ? void 0 : itm.isActive) ? 1 : 0, 0);
    const disabled = siteList.reduce((acc, itm) => acc += !(itm == null ? void 0 : itm.isActive) ? 1 : 0, 0);
    return `${actives} active, ${disabled} disabled configurations`;
  },
  pm2Stats() {
    return `## running, ## stopped, ## errored services`;
  },
  async serverInfo() {
    var _a, _b;
    const [Hostname, FQDNs, Public_IP, Private_IP1, Private_IP2] = await Promise.all([
      //
      sudoExec("hostname"),
      sudoExec("hostname -A"),
      ((_b = (_a = process == null ? void 0 : process.env) == null ? void 0 : _a.APP_ENV) == null ? void 0 : _b.startsWith("dev")) ? sudoExec("hostname -i") : sudoExec("wget -qO- https://api.ipify.org"),
      sudoExec("hostname -i"),
      sudoExec("hostname -I")
    ]);
    return [
      { label: "Hostname", value: os.hostname() },
      { label: "FQDNs", value: cleanUniqArray(FQDNs.split(/\s/)).join(`&nbsp;&bull;&nbsp;`) },
      { label: "Public IP", value: Public_IP },
      {
        label: "Private IP",
        value: cleanUniqArray(Private_IP1.split(/\s/), Private_IP2.split(/\s/)).filter((ip) => !ipv6Regex.test(ip)).join(`&nbsp;&bull;&nbsp;`)
      },
      { label: "Up Time", value: formatDuration(os.uptime()) },
      { label: "Server CPU", value: `${cleanUniqArray(os.cpus().map((i) => i == null ? void 0 : i.model))} (${os.cpus().length} cores)` }
    ];
  },
  async systemInfo() {
    const unameA = await sudoExec(`uname -m`);
    const detectedArch = !detectArch(unameA) ? "" : `(${detectArch(unameA)})`;
    const distroRaw = await sudoExec("cat /etc/*release");
    const distro = envfile.parse(distroRaw);
    return [
      { label: "Temp Directory", value: os.tmpdir() },
      { label: "Home Directory", value: os.homedir() },
      { label: "Kernel", value: os.type() + " " + os.release() },
      { label: "Architecture", value: `${unameA || os.arch()} ${detectedArch}` },
      { label: "Operating System", value: distro.NAME + " " + distro.VERSION },
      { label: "Platform", value: os.platform() },
      { label: "OS Type", value: os.type() },
      { label: "Release", value: os.release() },
      { label: "endianness", value: os.endianness() },
      { label: "freemem", value: formatBytes(os.freemem()) },
      { label: "totalmem", value: formatBytes(os.totalmem()) }
      // { label: "loadavg", value: os.loadavg() },
      // { label: "version", value: os.version() },
      // { label: "userInfo", value: os.userInfo() },
      // { label: "constants", value: os.constants },
      // { label: "networkInterfaces", value: os.networkInterfaces() },
    ];
  },
  async physicalMem() {
    const returned = await sudoExec("free -hltw");
    return convertToArray(returned);
  },
  async diskFileSys() {
    const returned = await sudoExec("df -h --total");
    return convertToArray(returned);
  },
  monitoredCerts() {
    return sslio.fetchInBulk();
  },
  installedCerts() {
    return sites.findAllCert();
  },
  availableSites() {
    return sites.list();
  },
  availableActions() {
    return null;
  }
};
const _slug__get = eventHandler(async (event) => {
  var _a, _b, _c, _d;
  try {
    const controllerFunc = controllers == null ? void 0 : controllers[(_b = (_a = event == null ? void 0 : event.context) == null ? void 0 : _a.params) == null ? void 0 : _b.slug];
    if (typeof controllerFunc !== "function") {
      throw new Error(`[${(_d = (_c = event == null ? void 0 : event.context) == null ? void 0 : _c.params) == null ? void 0 : _d.slug}] is not valid route`);
    }
    const result = controllerFunc();
    if (result instanceof Promise) {
      return event.sendResponse(await result);
    }
    return event.sendResponse(result);
  } catch (err) {
    console.log("\u{1F680} ~ eventHandler ~ err:", err);
    return event.errorResponse(err);
  }
});
function convertToArray(cliOutput) {
  const lines = cliOutput.trim().split("\n");
  const headers = lines[0].split(/\s+/);
  const data = [];
  for (let i = 1; i < lines.length; i++) {
    const columns = lines[i].split(/\s+/);
    const entry = {};
    headers.forEach((header, index) => {
      entry[header] = columns[index];
    });
    data.push(entry);
  }
  return data;
}
function detectArch(arch) {
  switch (String(arch).trim()) {
    case "x86_64":
      return "amd64";
    case "aarch64":
    case "arm64":
      return "arm64";
    case "i386":
    case "i686":
      return "386";
    // For matching architectures starting with 'arm'
    case (arch.startsWith("arm") ? arch : void 0):
      return "arm";
    default:
      return null;
  }
}
function formatBytes(bytes) {
  if (bytes === 0) return "0 Bytes";
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return (bytes / Math.pow(1024, i)).toFixed(2) + " " + sizes[i];
}
function formatDuration(seconds) {
  const days = Math.floor(seconds / (24 * 3600));
  seconds %= 24 * 3600;
  const hours = Math.floor(seconds / 3600);
  seconds %= 3600;
  const minutes = Math.floor(seconds / 60);
  seconds %= 60;
  seconds = Math.floor(seconds);
  const result = [];
  if (days > 0) result.push(`${days} day${days > 1 ? "s" : ""}`);
  if (hours > 0) result.push(`${hours} hour${hours > 1 ? "s" : ""}`);
  if (minutes > 0) result.push(`${minutes} minute${minutes > 1 ? "s" : ""}`);
  return result.join(", ");
}

export { _slug__get as default };
//# sourceMappingURL=_slug_.get.mjs.map
