import { setEnvDataSync } from "@/server/utils/bin/env.js";
import VpsWebsites from "@/server/utils/vps/WebSites";

export default defineNitroPlugin(async () => {
  // setting default env values
  if (!process?.env?.NUXT_LOCAL_DB_DIR) {
    setEnvDataSync({ NUXT_LOCAL_DB_DIR: ".localdb/" });
    console.log(`✅ default env variables are set`);
  }

  // setting websites default conf
  const sites = new VpsWebsites();
  await sites.rebuildDefaultConf(null, true);
});
