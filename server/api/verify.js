import fsPath from "node:path";
import fs from "fs-extra";
// import fs from "node:fs/promises";
// import fs from "node:fs";
// import os from "node:os";
import packageJson from "@/package.json";
// import VpsCertBot from "~/server/utils/vps/VpsCertbot";
// import VpsCertMeta from "~/server/utils/vps/VpsCertMeta";
// import VpsWebsites from "~/server/utils/vps/VpsWebsites";
// import VpsAcmeSsl from "~/server/utils/vps/VpsSslAcme";

export default eventHandler(async (event) => {
  try {
    // const acmeSsl = new VpsAcmeSsl();
    // return await acmeSsl.delete("eventspag.com");

    const prerequisite = {};
    prerequisite.vpscapLocalDir = fsPath.resolve(process?.env?.NUXT_LOCAL_DB_DIR);
    prerequisite.currentScore = 0;
    prerequisite.canContinue = prerequisite?.currentScore > 20;
    prerequisite.install_nginx = (await isInstalled("nginx")) ? true : false;
    prerequisite.setup_nginx = isNginxDirAdded();
    prerequisite.install_php = (await isInstalled("php")) ? true : false;
    prerequisite.install_pm2 = (await isInstalled("pm2")) ? true : false;

    // calculate score
    if (prerequisite?.install_nginx) prerequisite.currentScore += 10;
    if (prerequisite?.setup_nginx) prerequisite.currentScore += 10;
    if (prerequisite?.install_php) prerequisite.currentScore += 5;
    if (prerequisite?.install_pm2) prerequisite.currentScore += 5;
    // check is good to go
    prerequisite.isGoodToGo = prerequisite?.currentScore > 20;

    const runtimeConfig = useRuntimeConfig(event);
    const resp = {};
    resp.name = packageJson?.name;
    resp.version = packageJson?.version;
    resp.appEnv = runtimeConfig?.appEnv;
    resp.prerequisite = prerequisite;

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

function raw2obj(rawData) {
  const getCommonDelimiterForm = (rawData, delimiter) => {
    const delimiterPattern = new RegExp(delimiter + "\\S+", "g");
    const delimiterWSpacePattern = new RegExp(delimiter + " ", "g");
    const delimiterMatches = rawData.match(delimiterPattern) || [];
    const delimiterWSpaceMatches = rawData.match(delimiterWSpacePattern) || [];

    // console.log({
    //     delimiterMatches,
    //     delimiterWSpaceMatches,
    // });

    if (delimiterMatches.length > delimiterWSpaceMatches.length) return delimiter;

    return delimiter + " ";
  };

  const delimiter = getCommonDelimiterForm(rawData, ":");

  const lines = rawData.replace(/:\s*\r\n/g, ": ").split("\n");

  const result = {};
  for (let line of lines) {
    line = line.trim();

    // colon space because that's the standard delimiter - not ':' as that's used in eg, http links
    if (line && line.includes(delimiter)) {
      const lineParts = line.split(delimiter);

      // 'Greater than' since lines often have more than one colon, eg values with URLs
      if (lineParts.length >= 2) {
        const key = lineParts[0].trim();
        const val = lineParts.splice(1).join(delimiter).trim();

        // If multiple lines use the same key, combine the values
        if (key in result) {
          result[key] = `${result[key]} ${val}`;
        } else {
          result[key] = val;
        }
      }
    }
  }
  return result;
}

function isNginxDirAdded() {
  const nginxFilePath = "/etc/nginx/nginx.conf";
  const nginxConfRaw = fs.readFileSync(nginxFilePath, "utf8");

  return nginxConfRaw.indexOf(`###_MODIFIED_BY_VPSCAP_###`) !== -1;
}
