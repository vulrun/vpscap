const fsPath = require("node:path");
const fs = require("fs-extra");
const locatePath = require("../utils/locatePath.js");
const NginxParser = require("../utils/NginxParser.js");
const { extendObj, lookupAccountJs } = require("../utils/functions.js");

const CONF_VPSCAP_NOTE = "\n###_MODIFIED_BY_VPSCAP_###\n\n";

(async () => {
  try {
    const { vpscapRootPath, accountObj } = lookupAccountJs();
    await updateNginxConf({ vpscapRootPath, accountObj });
    await someMoreTweaks();
  } catch (err) {
    console.error("❌ Error, setting vps configuration:", err?.message);
  }
})();

async function updateNginxConf({ accountObj }) {
  console.log("👉 Modifying nginx configuration...");

  const nginxDirPath = fsPath.resolve(`/etc/nginx/`);
  const nginxBackupPath = fsPath.resolve(nginxDirPath, `nginx.conf.${__dateSuffix()}.vpscapbk`);
  const nginxFilePath = fsPath.resolve(nginxDirPath, `nginx.conf`);

  // prettier-ignore
  const hasWriteAccess = await fs.access(nginxDirPath, fs.constants.W_OK).then(() => true).catch(() => false);
  if (!hasWriteAccess) throw new Error("NO_WRITE_ACCESS");

  // read current nginx conf and take backup if nginx.conf has data
  const nginxConfRaw = await fs.readFile(nginxFilePath, "utf8").catch(() => "");
  if (nginxConfRaw.length > 0) {
    await fs.rename(nginxFilePath, nginxBackupPath);
  }

  const nginxOriginalFile = await __locateNginxOriginalFile();
  // handle case when original backup does not exist
  if (!nginxOriginalFile) {
    console.error(`\n❌ Missing nginx configuration file\n\nplease reinstall nginx again using:   sudo apt install nginx\n\n`);
    process.exit(1);
  }

  // modify the nginx.conf as per needs
  const nginxParser = new NginxParser();
  const nginxConfJson = nginxParser.toJSON(nginxOriginalFile?.fileData);

  extendObj(
    nginxConfJson,
    {
      "http.default_type": undefined,
      "http.include": undefined,
    },
    {
      user: accountObj?.vpsUser,
      "http.include": [
        //
        `/etc/nginx/conf.d/*.conf`,
        fsPath.resolve(accountObj?.rootPath, "core", "snippets", "mime.types"),
        fsPath.resolve(accountObj?.localDir, "sites.conf.d", "*.conf"),
      ],
    }
  );

  // creating nginx friendly configuration
  const nginxConfModified = nginxParser.toConf(nginxConfJson);
  await fs.writeFile(nginxFilePath, CONF_VPSCAP_NOTE + nginxConfModified);
  console.log("✅ Success, nginx configuration has been updated.");
}

async function someMoreTweaks() {
  // sudo chown -R www-data:www-data /var/lib/nginx
  // sudo chmod -R 700 /var/lib/nginx
}

async function __locateNginxOriginalFile() {
  try {
    const nginxDir = "/etc/nginx";
    const scripts = fs
      .readdirSync(nginxDir)
      .filter((file) => file.includes("nginx.conf"))
      .map((file) => {
        const filePath = fsPath.resolve(nginxDir, file);
        if (!locatePath.isValidFile(filePath)) return;

        return {
          fileName: file,
          filePath,
          fileData: fs.readFileSync(filePath, "utf8"),
        };
      })
      .filter((item) => item?.filePath && item.filePath.includes("/nginx.conf") && !item.fileData.includes(CONF_VPSCAP_NOTE));

    if (!Array.isArray(scripts)) throw new Error("nginx.conf files are missing");

    return scripts?.[0];
  } catch (err) {
    return null;
  }
}

function __dateSuffix() {
  const isoString = new Date().toISOString();
  return `${isoString.substring(0, 10).replace(/[^0-9]|\s+/g, "")}_${isoString.substring(11, 19).replace(/[^0-9]|\s+/g, "")}`;
}
