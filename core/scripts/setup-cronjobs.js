const { spawn, exec } = require("child_process");
const fsPath = require("node:path");
const fs = require("fs-extra");
const { lookupAccountJs } = require("../utils/functions.js");

const CRON_TAG_START = "###_BEGIN_VPSCAP_CRONJOBS_###";
const CRON_TAG_END = "###_END_VPSCAP_CRONJOBS_###";

(async () => {
  try {
    await setupCronJobs();
  } catch (err) {
    console.error("❌ Error, setting up cron-jobs:", err?.message);
  }
})();

async function setupCronJobs() {
  const { accountObj } = lookupAccountJs();

  const cronBlock = getCronBlock(accountObj?.port, accountObj?.localDir);
  if (!cronBlock) throw new Error(`please setup admin user first.`);

  try {
    // read current cronjobs
    const currentCron = await readCrontab();

    // remove existing vpscap-cron block
    const regex = new RegExp(`${CRON_TAG_START}[\\s\\S]*?${CRON_TAG_END}`, "g");
    const cleanedCron = currentCron.replace(regex, "").trim();

    // combine with new block
    const updatedCron = [cleanedCron, cronBlock].filter(Boolean).join("\n\n");
    await writeCrontab(updatedCron);

    console.log("✅ Cron jobs set up successfully!");
  } catch (err) {
    // no crontab exists yet, create a new one
    if (String(err?.message || "").includes("no crontab for")) {
      await writeCrontab(cronBlock);
      return console.log("✅ New crontab created with your cron jobs!");
    }

    throw err;
  }
}

// --- helpers ---
function readCrontab() {
  return new Promise((resolve, reject) => {
    exec("crontab -l", (error, stdout, stderr) => {
      if (error) {
        return reject(new Error(stderr || error?.message));
      }
      resolve(stdout);
    });
  });
}

function writeCrontab(cronContent) {
  return new Promise((resolve, reject) => {
    const subprocess = spawn("crontab", ["-"]);
    subprocess.stdin.write(cronContent + "\n");
    subprocess.stdin.end();

    subprocess.on("close", (code) => (code === 0 ? resolve() : reject(new Error(`crontab exited with code ${code}`))));
    subprocess.on("error", reject);
  });
}

function getCronBlock(httpPort, localDir) {
  if (!httpPort) return;
  if (!localDir) return;
  const logDir = fsPath.resolve(localDir, "logs");

  fs.ensureFileSync(`${logDir}/minute-crons.log`);
  fs.ensureFileSync(`${logDir}/hourly-crons.log`);
  fs.ensureFileSync(`${logDir}/daily-crons.log`);
  fs.ensureFileSync(`${logDir}/weekly-crons.log`);
  fs.ensureFileSync(`${logDir}/monthly-crons.log`);
  fs.ensureFileSync(`${logDir}/yearly-crons.log`);

  return `
${CRON_TAG_START}
# please don't touch or modify these cronjobs, otherwise some functionality might get affected.
# --------------------------------------------------------------------------------------------
#
* * * * * curl -s http://localhost:${httpPort ?? 3010}/api/public/minute-crons   >> ${logDir}/minute-crons.log   2>&1
0 * * * * curl -s http://localhost:${httpPort ?? 3010}/api/public/hourly-crons   >> ${logDir}/hourly-crons.log   2>&1
0 0 * * * curl -s http://localhost:${httpPort ?? 3010}/api/public/daily-crons    >> ${logDir}/daily-crons.log    2>&1
0 0 * * 0 curl -s http://localhost:${httpPort ?? 3010}/api/public/weekly-crons   >> ${logDir}/weekly-crons.log   2>&1
0 0 1 * * curl -s http://localhost:${httpPort ?? 3010}/api/public/monthly-crons  >> ${logDir}/monthly-crons.log  2>&1
0 0 1 1 * curl -s http://localhost:${httpPort ?? 3010}/api/public/yearly-crons   >> ${logDir}/yearly-crons.log   2>&1
${CRON_TAG_END}`.trim();
}
