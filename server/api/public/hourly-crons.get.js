import fsPath from "node:path";
import fs from "fs-extra";

// import VpsAcmeSsl from "@@/server/utils/vps/SslAcme";
import VpsCertMeta from "@@/server/utils/vps/SslMeta";
import VpsWebsites from "@@/server/utils/vps/WebSites";

const accountJsonPath = fsPath.resolve(process?.env?.NUXT_LOCAL_DB_DIR || [process.cwd(), ".localdb/"], "account.json");
const accountJson = fs.readJsonSync(accountJsonPath, { throws: false });

const site = new VpsWebsites();
const sslm = new VpsCertMeta();

export default eventHandler((event) => {
  try {
    // fetch fresh ssl monitors in background
    if (accountJson?.cronJobSettings?.monitored_certs_hourly_retry) {
      sslm.fetchAll().then();
    }

    return event.cronResponse("hourly cron executed.");
  } catch (err) {
    return event.cronResponse(null, err);
  }
});
