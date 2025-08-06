const execa = require("execa");

const CRON_TAG_START = "# BEGIN my-app-cron";
const CRON_TAG_END = "# END my-app-cron";

const cronBlock = `
${CRON_TAG_START}
*/5 * * * * /usr/bin/node /path/to/your/script.js >> /var/log/myapp.log 2>&1
0 0 * * * /usr/bin/node /path/to/cleanup.js >> /var/log/myapp_cleanup.log 2>&1
${CRON_TAG_END}
`.trim();

(async () => {
  await setupCronJobs();
})();

async function setupCronJobs() {
  try {
    // Read current crontab
    const { stdout } = await execa("crontab", ["-l"]);
    let currentCron = stdout;

    // Remove existing app's cron block
    const regex = new RegExp(`${CRON_TAG_START}[\\s\\S]*?${CRON_TAG_END}`, "g");
    currentCron = currentCron.replace(regex, "").trim();

    // Combine with new block
    const newCron = [currentCron, cronBlock].filter(Boolean).join("\n\n");

    // Apply new crontab
    const subprocess = execa("crontab", ["-"]);
    subprocess.stdin.write(newCron);
    subprocess.stdin.end();

    await subprocess;

    console.log("✅ Cron jobs set up successfully!");
  } catch (err) {
    if (err.stderr && err.stderr.includes("no crontab for")) {
      // No crontab exists yet, create a new one
      const subprocess = execa("crontab", ["-"]);
      subprocess.stdin.write(`${cronBlock}\n`);
      subprocess.stdin.end();

      await subprocess;

      console.log("✅ New crontab created with your cron jobs!");
    } else {
      console.error("❌ Failed to set up cron jobs:", err);
    }
  }
}
