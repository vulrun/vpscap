import shelljs from "shelljs";
import nodeNet from "node:net";
import nodeUtil from "node:util";
import childProcess from "node:child_process";

export default shelljs;

const execFileAsync = nodeUtil.promisify(childProcess.execFile);

async function execCommand(command, opts = [], defaultValue = "") {
  try {
    const { stdout } = await execFileAsync(command, opts);
    return stdout;
  } catch (error) {
    return defaultValue;
  }
}

export function shellExec1(command) {
  return new Promise((resolve, reject) => {
    childProcess.exec(command, (error, stdout, stderr) => {
      if (error) return reject(error);
      if (stderr) return reject(stderr);
      return resolve(stdout);
    });
  });
}

export function shellExec(command) {
  return new Promise((resolve, reject) => {
    shelljs.exec(command, { silent: true }, (exitCode, stdout, stderr) => {
      if (exitCode && exitCode !== 1) return reject(new Error(`EXITCODE: ${exitCode}`));
      if (stderr) return reject(stderr);
      return resolve(stdout);
    });
  });
}

export function sudoExec(command) {
  // process.env.PASSWD_KEY = "4123";
  // console.log("🚀 ~ PASSWD_KEY:", process?.env?.PASSWD_KEY);
  command = process?.env?.PASSWD_KEY ? `echo \"${process?.env?.PASSWD_KEY}\" | sudo -S ${command}` : `sudo ${command}`;

  return shellExec(command);
}

export function installedPath(pkgName) {
  try {
    return shellExec(`which ${pkgName}`);
  } catch (error) {
    return null;
  }
}

export function isInstalled(pkgName) {
  return installedPath(pkgName)
    .then((i) => true)
    .catch((e) => false);
}

export async function getTracedARecords(domain, depth = 0) {
  if (depth > 10) return [];

  domain = `${domain || ""}`.trim().replace(/\.$/, "");

  const records = [];

  const answer = await execCommand("dig", ["+trace", "A", domain, "+noall", "+answer"], "");
  if (!answer) return [];

  for (const line of answer.split("\n")) {
    const parts = line.trim().split(/\s+/);
    if (parts.length < 5) continue;

    const type = parts[3].toUpperCase();
    const value = parts[4];

    // Direct A record
    if (type === "A" && nodeNet.isIPv4(value)) {
      records.push(value);
      continue;
    }

    // CNAME -> resolve the target
    if (type === "CNAME") {
      const cnameTarget = value.replace(/\.$/, "");
      const cnameRecords = await getTracedARecords(cnameTarget, depth + 1);
      records.push(...cnameRecords);
    }
  }

  return [...new Set(records)];
}

export async function getAuthoritativeARecords(domain, depth = 0) {
  if (depth > 10) return [];

  domain = `${domain || ""}`.trim().replace(/\.$/, "");

  const nsOutput = await execCommand("dig", ["+short", "NS", domain], "");
  if (!nsOutput) throw new Error("Error: NS not found");

  const nameservers = `${nsOutput}`
    .split("\n")
    .map((ns) => ns.trim().replace(/\.$/, ""))
    .filter(Boolean);

  const records = [];

  for (const ns of nameservers) {
    const answer = await execCommand("dig", [`@${ns}`, domain, "A", "+noall", "+answer"], "");
    if (!answer) continue;

    for (const line of answer.split("\n")) {
      const parts = line.trim().split(/\s+/);
      if (parts.length < 5) continue;

      const type = parts[3].toUpperCase();
      const value = parts[4];

      // Direct A record
      if (type === "A" && nodeNet.isIPv4(value)) {
        records.push(value);
        continue;
      }

      // CNAME -> resolve the target
      if (type === "CNAME") {
        const cnameTarget = value.replace(/\.$/, "");
        const cnameRecords = await getAuthoritativeARecords(cnameTarget, depth + 1);
        records.push(...cnameRecords);
      }
    }
  }

  return [...new Set(records)];
}
