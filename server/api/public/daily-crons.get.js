import fsPath from "node:path";
import fs from "fs-extra";

import VpsCertMeta from "@@/server/utils/vps/SslMeta";
import VpsWebsites from "@@/server/utils/vps/WebSites";

const accountJsonPath = fsPath.resolve(process?.env?.NUXT_LOCAL_DB_DIR || [process.cwd(), ".localdb/"], "account.json");
const accountJson = fs.readJsonSync(accountJsonPath, { throws: false });

const site = new VpsWebsites();
const sslm = new VpsCertMeta();

export default eventHandler((event) => {
  try {
    // renew ssl installs certificates in background
    if (accountJson?.cronJobSettings?.installed_certs_daily_renew) {
      site.renewCerts().then((r) => {
        site.nginxReload().then();
      });
    }

    // purge and refresh ssl monitors cache in background
    if (accountJson?.cronJobSettings?.monitored_certs_daily_refresh) {
      sslm.purgeCache().then((r) => {
        sslm.fetchInBulk().then();
      });
    }

    if (accountJson?.cronJobSettings?.installed_certs_daily_alerts) {
      // todo: add daily alerts code
    }

    if (accountJson?.cronJobSettings?.monitored_certs_daily_alerts) {
      // todo: add daily alerts code
    }

    return event.cronResponse("daily cron executed.");
  } catch (err) {
    return event.cronResponse(null, err);
  }
});
