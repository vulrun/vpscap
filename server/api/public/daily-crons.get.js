import fsPath from "node:path";
import fs from "fs-extra";

import VpsCertMeta from "@@/server/utils/vps/SslMeta";
import VpsWebsites from "@@/server/utils/vps/WebSites";

const accountJsonPath = fsPath.resolve(process?.env?.NUXT_LOCAL_DB_DIR || [process.cwd(), ".localdb/"], "account.json");
const accountJson = fs.readJsonSync(accountJsonPath, { throws: false });
const __cronSetti = accountJson?.cronJobSettings;

const site = new VpsWebsites();
const sslm = new VpsCertMeta();

export default eventHandler(async (event) => {
  try {
    Promise.allSettled([
      // renew ssl installs certificates
      async () => {
        if (!__cronSetti?.installed_certs_daily_renew) return;
        await site.renewCerts();
        await site.nginxReload();
      },

      // purge and refresh all ssl monitors cache
      async () => {
        if (!__cronSetti?.monitored_certs_daily_refresh) return;
        await sslm.purgeCacheAll();
        await sslm.fetchAll();
      },

      // todo: add daily alerts code
      async () => {
        if (!__cronSetti?.installed_certs_daily_alerts) return;
      },

      // todo: add daily alerts code
      async () => {
        if (!__cronSetti?.monitored_certs_daily_alerts) return;
      },
    ]).then();

    return event.cronResponse("daily cron executed.");
  } catch (err) {
    return event.cronResponse(null, err);
  }
});
