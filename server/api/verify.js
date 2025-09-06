import fsPath from "node:path";
import fs from "fs-extra";
import crypto from "node:crypto";
import packageJson from "@@/package.json";
import AccountJson from "@@/server/utils/vps/AccountJson";
// import VpsCertMeta from "@@/server/utils/vps/SslMeta";
// import VpsWebsites from "@@/server/utils/vps/Websites";

export default eventHandler(async (event) => {
  try {
    const accJson = new AccountJson();
    const accObj = accJson.getData("*");
    if (!accObj.vpsUser) throw new Error("Please setup admin user first");

    const deps = {};
    deps.install_nginx = await isInstalled("nginx");
    deps.configure_vps = await isVpsConfigured();
    deps.install_pm2 = await isInstalled("pm2");
    deps.install_php = await isInstalled("php");
    deps.current_score = calcScore(deps);
    deps.canContinue = deps.current_score > 50;

    const runtimeConfig = useRuntimeConfig(event);
    const resp = {};
    resp.name = packageJson?.name;
    resp.appEnv = runtimeConfig?.appEnv;
    resp.version = packageJson?.version;
    resp.profile = {
      name: accObj?.vpsUser,
      email: accObj?.username,
      avatar: getGravatarUrl(accObj?.username),
      homeUrl: accObj?.homeUrl,
    };
    resp.prerequisite = deps;

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

function isVpsConfigured() {
  const nginxFilePath = "/etc/nginx/nginx.conf";
  const nginxConfRaw = fs.readFileSync(nginxFilePath, "utf8");
  return nginxConfRaw.indexOf(`###_MODIFIED_BY_VPSCAP_###`) !== -1;
}

function calcScore(prerequisite) {
  let currentScore = 0;
  if (prerequisite?.install_nginx) currentScore += 25;
  if (prerequisite?.configure_vps) currentScore += 25;
  if (prerequisite?.install_pm2) currentScore += 1;
  if (prerequisite?.install_php) currentScore += 1;

  return currentScore;
}

function getGravatarUrl(email, size = 160, useCdn = true) {
  const trimmedEmail = `${email || ""}`.trim().toLowerCase();
  const imageHash = crypto.createHash("sha256").update(trimmedEmail).digest("hex");
  const imageUrl = `https://www.gravatar.com/avatar/${imageHash}?s=${size}`;
  return !useCdn ? imageUrl : `https://wsrv.nl/?url=${encodeURIComponent(imageUrl)}&default=${encodeURIComponent("wsrv.nl/placeholder.svg")}?fit=cover&w=${size}&h=${size}`;
}
