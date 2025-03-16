import fsPath from "node:path";
import fs from "fs-extra";
// import fs from "node:fs/promises";
// import fs from "node:fs";
// import os from "node:os";
import packageJson from "@/package.json";
import crypto from "node:crypto";
// import VpsCertBot from "~/server/utils/vps/VpsCertbot";
// import VpsCertMeta from "~/server/utils/vps/VpsCertMeta";
// import VpsWebsites from "~/server/utils/vps/VpsWebsites";
// import VpsAcmeSsl from "~/server/utils/vps/VpsSslAcme";

const LOCAL_DB_DIR = process?.env?.NUXT_LOCAL_DB_DIR || ".localdb/";

export default eventHandler(async (event) => {
  try {
    const accountFilePath = fsPath.resolve(LOCAL_DB_DIR, "account.json");
    const accountObj = fs.readJsonSync(accountFilePath);
    if (!accountObj?.vpsUser) throw new Error("Please setup admin user first");

    const prerequisite = {};
    // prerequisite.vpscapLocalDir = fsPath.resolve(LOCAL_DB_DIR);
    prerequisite.install_nginx = (await isInstalled("nginx")) ? true : false;
    prerequisite.configu_nginx = isNginxDirAdded();
    prerequisite.install_pm2 = (await isInstalled("pm2")) ? true : false;
    prerequisite.install_php = (await isInstalled("php")) ? true : false;
    prerequisite.canContinue = calcPrerequisiteScore(prerequisite) > 50;

    const runtimeConfig = useRuntimeConfig(event);
    const resp = {};
    resp.name = packageJson?.name;
    resp.version = packageJson?.version;
    resp.appEnv = runtimeConfig?.appEnv;
    resp.prerequisite = prerequisite;
    resp.profile = {
      name: accountObj?.vpsUser,
      email: accountObj?.username,
      avatar: getGravatarUrl(accountObj?.username),
    };

    if (runtimeConfig?.appEnv.startsWith("dev")) {
      resp.appConfig = useAppConfig(event);
      resp.eventKeys = Object.keys(event);
      resp.envKeys = Object.keys(process?.env);
    }

    return event.sendResponse(resp);
  } catch (err) {
    return event.errorResponse(err);
  }
});

// const name = getRouterParam(event, "name");
// const params = await getValidatedRouterParams(event, userSchema.parse);
// const query = getQuery(event);
// const query = await getValidatedQuery(event, z.object({ url: z.string().url() }));
// const body = await readBody(event);
// const result = await readValidatedBody(event, validator);

function isNginxDirAdded() {
  const nginxFilePath = "/etc/nginx/nginx.conf";
  const nginxConfRaw = fs.readFileSync(nginxFilePath, "utf8");
  return nginxConfRaw.indexOf(`###_MODIFIED_BY_VPSCAP_###`) !== -1;
}

function calcPrerequisiteScore(prerequisite) {
  let currentScore = 0;
  if (prerequisite?.install_nginx) currentScore += 25;
  if (prerequisite?.configu_nginx) currentScore += 25;
  if (prerequisite?.install_pm2) currentScore += 10;
  if (prerequisite?.install_php) currentScore += 10;

  return currentScore;
}

function getGravatarUrl(email, size = 160, useCdn = true) {
  const trimmedEmail = `${email || ""}`.trim().toLowerCase();
  const imageHash = crypto.createHash("sha256").update(trimmedEmail).digest("hex");
  const imageUrl = `https://www.gravatar.com/avatar/${imageHash}?s=${size}`;
  return !useCdn ? imageUrl : `https://wsrv.nl/?url=${encodeURIComponent(imageUrl)}&default=${encodeURIComponent("wsrv.nl/placeholder.svg")}?fit=cover&w=${size}&h=${size}`;
}
