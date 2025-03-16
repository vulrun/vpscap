import fsPath from "node:path";
import fs from "fs-extra";
// import fs from "node:fs/promises";
// import fs from "node:fs";
import os from "node:os";
import * as envs from "../../server/utils/bin/env.js";
import { extendObj } from "../../utils/helpers.js";
import NginxParser from "../../server/utils/NginxParser.js";

const nginxParser = new NginxParser();

(async () => {
  try {
    console.log("👉 Modifying nginx configuration...");

    // prettier-ignore
    const backupSuffix = new Date().toISOString().replace(/[^A-Z0-9-]/g, "-").replace(/-+/g, "-");
    const currentEnvObject = envs.getEnvDataSync();
    const accountFilePath = fsPath.resolve(currentEnvObject?.NUXT_LOCAL_DB_DIR, "account.json");

    const accountObj = await fs.readJson(accountFilePath);
    if (!accountObj?.vpsUser) throw new Error("Please setup admin user first");

    const nginxFileBackup = `/etc/nginx/nginx.conf.${backupSuffix}.bk`;
    const nginxFilePath = `/etc/nginx/nginx.conf`;
    const globalConfigs = `/etc/nginx/conf.d/*.conf`;
    const mimeTypesConf = fsPath.resolve(accountObj?.rootPath, "core", "snippets", "mime.types");
    const newNginxConfs = fsPath.resolve(accountObj?.localDir, "sites.conf.d", "*.conf");
    // prettier-ignore
    const hasWriteAccess = await fs.access(nginxFilePath, fs.constants.W_OK).then(() => true).catch(() => false);
    if (!hasWriteAccess) throw new Error("NO_WRITE_ACCESS");

    // modify the nginx.conf as per needs
    const nginxConfRaw = await fs.readFile(nginxFilePath, "utf8").catch((err) => "");
    const nginxConfJson = nginxParser.toJSON(nginxConfRaw);
    const nginxConfCopy = JSON.parse(JSON.stringify(nginxConfJson));

    extendObj(
      nginxConfCopy,
      { "http.default_type": undefined, "http.include": undefined },
      {
        user: accountObj?.vpsUser,
        "http.include": [globalConfigs, mimeTypesConf, newNginxConfs],
      }
    );

    const nginxConfModified = nginxParser.toConf(nginxConfCopy);
    // do backup of original file
    if (nginxConfRaw.length > 0) await fs.rename(nginxFilePath, nginxFileBackup);
    // adding nginx configuration
    await fs.writeFile(nginxFilePath, "\n###_MODIFIED_BY_VPSCAP_###\n\n" + nginxConfModified);
    console.log("🚀 ~ nginxConfMod:", "\n###_MODIFIED_BY_VPSCAP_###\n\n" + nginxConfModified);

    console.log("✅ Success, nginx configuration has been updated.");
  } catch (err) {
    console.error("❌ Error, updating nginx.conf ~", err);
  }
})();
