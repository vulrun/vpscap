import fsPath from "node:path";
// import fs from "fs-extra";
// import fs from "node:fs/promises";
// import fs from "node:fs";
import os from "node:os";
// import dns from "node:dns/promises";
import lo from "lodash";
import * as envfile from "envfile";
import shell from "@/server/utils/shell";
import VpsAcmeSsl from "~/server/utils/vps/SslAcme";
import VpsCertMeta from "~/server/utils/vps/SslMeta";
import VpsWebsites from "~/server/utils/vps/WebSites";

const ipv6Regex = /([0-9a-fA-F]{1,4}:){1,7}[0-9a-fA-F]{1,4}/;
const cleanArray = (...args) => [].concat(...args).filter(Boolean);
const cleanUniqArray = (...args) => lo.uniq(cleanArray(...args));

const controllers = {
  sslStats() {
    return `## monitored, ## installed certificates`;
  },
  webStats() {
    return `## active, ## disabled configurations`;
  },
  pm2Stats() {
    return `## running, ## stopped, ## errored services`;
  },
  async serverInfo() {
    const [Hostname, FQDNs, Public_IP, Private_IP1, Private_IP2] = await Promise.all([
      //
      sudoExec("hostname"),
      sudoExec("hostname -A"),
      process?.env?.APP_ENV?.startsWith("dev") ? sudoExec("hostname -i") : sudoExec("wget -qO- https://api.ipify.org"),
      sudoExec("hostname -i"),
      sudoExec("hostname -I"),
    ]);

    return [
      { label: "Hostname", value: os.hostname() },
      { label: "FQDNs", value: cleanUniqArray(FQDNs.split(/\s/)).join(`&nbsp;&bull;&nbsp;`) },
      { label: "Public IP", value: Public_IP },
      {
        label: "Private IP",
        value: cleanUniqArray(Private_IP1.split(/\s/), Private_IP2.split(/\s/))
          .filter((ip) => !ipv6Regex.test(ip))
          .join(`&nbsp;&bull;&nbsp;`),
      },
      { label: "Up Time", value: formatDuration(os.uptime()) },
      { label: "Server CPU", value: `${cleanUniqArray(os.cpus().map((i) => i?.model))} (${os.cpus().length} cores)` },
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
      { label: "totalmem", value: formatBytes(os.totalmem()) },

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
    const sslMeta = new VpsCertMeta();
    return sslMeta.fetchInBulk();
  },
  installedCerts() {
    const sites = new VpsWebsites();
    return sites.findCert();
  },
  availableCerts() {},

  async availableSites() {
    const helper = new VpsWebsites();
    return helper.list();
  },
  availableActions() {
    return null;
  },
};

export default eventHandler(async (event) => {
  try {
    const controllerFunc = controllers?.[event?.context?.params?.slug];

    if (typeof controllerFunc !== "function") {
      throw new Error(`[${event?.context?.params?.slug}] is not valid route`);
    }

    const result = controllerFunc();
    if (result instanceof Promise) {
      return event.sendResponse(await result);
    }

    return event.sendResponse(result);
  } catch (err) {
    console.log("🚀 ~ eventHandler ~ err:", err);
    return event.errorResponse(err);
  }
});

//   case "restart_nginx":
//   case "log_action_click":
//   case "deploy_save":
//   case "deploy_exec":

function convertToArray(cliOutput) {
  const lines = cliOutput.trim().split("\n");
  const headers = lines[0].split(/\s+/);

  const data = [];
  // Loop through each line of the df output (skipping the first header line)
  for (let i = 1; i < lines.length; i++) {
    const columns = lines[i].split(/\s+/);
    const entry = {};

    // Map each column to the corresponding header
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
    case arch.startsWith("arm") ? arch : undefined:
      return "arm";
    default:
      return null;
  }
}

function formatBytes(bytes) {
  if (bytes === 0) return "0 Bytes";

  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024)); // Find the index of the appropriate size
  return (bytes / Math.pow(1024, i)).toFixed(2) + " " + sizes[i];
}

function formatDuration(seconds) {
  const days = Math.floor(seconds / (24 * 3600));
  seconds %= 24 * 3600; // Remaining seconds after extracting days

  const hours = Math.floor(seconds / 3600);
  seconds %= 3600; // Remaining seconds after extracting hours

  const minutes = Math.floor(seconds / 60);
  seconds %= 60; // Remaining seconds after extracting minutes
  seconds = Math.floor(seconds);

  const result = [];
  if (days > 0) result.push(`${days} day${days > 1 ? "s" : ""}`);
  if (hours > 0) result.push(`${hours} hour${hours > 1 ? "s" : ""}`);
  if (minutes > 0) result.push(`${minutes} minute${minutes > 1 ? "s" : ""}`);
  // if (seconds > 0 || result.length === 0) result.push(`${seconds} second${seconds !== 1 ? "s" : ""}`);
  return result.join(", ");
}
