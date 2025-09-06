import fsPath from "node:path";
import fs from "fs-extra";
import lo from "lodash";
import VpsWebsites from "@@/server/utils/vps/WebSites";

export default defineNitroPlugin(async () => {
  const vpsSite = new VpsWebsites();

  // setting websites default conf
  await vpsSite.nginx.restart();
  await vpsSite.rebuildDefaultConf();
});
