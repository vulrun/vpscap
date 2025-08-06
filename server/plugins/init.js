import { setEnvDataSync } from "@@/server/utils/bin/env.js";
import VpsWebsites from "@@/server/utils/vps/WebSites";
import fsPath from "node:path";
import fs from "fs-extra";
// import fs from "node:fs/promises";
// import fs from "node:fs";
// import os from "node:os";
import dns from "node:dns/promises";
import lo from "lodash";

export default defineNitroPlugin(async () => {
  // setting default env values
  if (!process?.env?.NUXT_LOCAL_DB_DIR) {
    setEnvDataSync({
      NUXT_LOCAL_DB_DIR: await getLocalDbDirPath(),
    });
    console.log(`✅ default env variables are set`);
  }

  // setting websites default conf
  const sites = new VpsWebsites();
  await sites.rebuildDefaultConf(null, true);
});
