import { setEnvDataSync } from "@@/server/utils/bin/env.js";
import VpsWebsites from "@@/server/utils/vps/WebSites";
import fsPath from "node:path";
import fs from "fs-extra";
import lo from "lodash";

export default defineNitroPlugin(async () => {
  // setting websites default conf
  const sites = new VpsWebsites();
  await sites.nginx.restart();
  await sites.rebuildDefaultConf();
});
