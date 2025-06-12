import { e as eventHandler, i as isInstalled, u as useRuntimeConfig, a as useAppConfig } from '../../nitro/nitro.mjs';
import fsPath from 'node:path';
import fs from 'fs-extra';
import nodeCrypto from 'node:crypto';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'envfile';
import 'ms';
import 'axios';
import 'node:dns/promises';
import 'lodash';
import 'shelljs';
import 'acme-client';
import 'node-forge';
import 'zod';
import 'glob';
import 'node:url';
import 'bcryptjs';

var name = "vpscap";
var type = "module";
var scripts = {
	dev: "nuxt dev",
	build: "nuxt build",
	generate: "nuxt generate",
	preview: "nuxt preview",
	postinstall: "nuxt prepare",
	"clean:deps": "rm -vrf .data/ .nuxt/ .output/ dist/",
	"clean:node": "rm -vrf node_modules/ package-lock.json",
	clean: "npm run clean:node && npm run clean:deps",
	"git:sync": "git fetch --all && git reset --hard origin/dist",
	"app:rebuild": "npm run git:sync && npm run clean:node && npm run clean:deps && npm install && npm run build",
	"app:start": "export $(cat .env | xargs) && node .output/server/index.mjs",
	"pm2:start": "export $(cat .env | xargs) && pm2 start .output/server/index.mjs --name=vpscap",
	"pm2:reload": "export $(cat .env | xargs) && pm2 reload vpscap --update-env",
	"setup-renew-cert": "(crontab -l; echo \"0 0 * * * curl -s http://localhost:3010/api/public/renew-certs\") | crontab -",
	"tweak-nginx-conf": "export $(cat .env | xargs) && sudo -E ./core/bin/tweak-nginx-conf",
	"setup-admin-user": "./core/bin/setup-admin-user"
};
var dependencies = {
	"@radix-icons/vue": "^1.0.0",
	"@tanstack/vue-table": "^8.21.3",
	"@vee-validate/zod": "^4.15.1",
	"@vueuse/core": "^13.3.0",
	"@vueuse/integrations": "^13.3.0",
	"acme-client": "^5.4.0",
	axios: "^1.9.0",
	bcryptjs: "^3.0.2",
	"class-variance-authority": "^0.7.1",
	"dotenv-cli": "^8.0.0",
	envfile: "^7.1.0",
	"fs-extra": "^11.3.0",
	glob: "^11.0.2",
	"lucide-vue-next": "^0.513.0",
	ms: "^2.1.3",
	"node-forge": "^1.3.1",
	nuxt: "^3.17.5",
	prompts: "^2.4.2",
	"radix-vue": "^1.9.17",
	shelljs: "^0.10.0",
	"vee-validate": "^4.15.1",
	vue: "~3.5.16",
	"vue-router": "~4.5.1",
	"vue-sonner": "^2.0.0",
	zod: "^3.25.56"
};
var devDependencies = {
	"@nuxtjs/color-mode": "^3.5.2",
	"@nuxtjs/tailwindcss": "^6.14.0",
	clsx: "^2.1.1",
	"shadcn-nuxt": "^2.2.0",
	"tailwind-merge": "^3.3.0",
	"tailwindcss-animate": "^1.0.7"
};
const packageJson = {
	name: name,
	"private": true,
	type: type,
	scripts: scripts,
	dependencies: dependencies,
	devDependencies: devDependencies
};

var _a;
const LOCAL_DB_DIR = ((_a = process == null ? void 0 : process.env) == null ? void 0 : _a.NUXT_LOCAL_DB_DIR) || ".localdb/";
const verify = eventHandler(async (event) => {
  var _a2, _b;
  try {
    const accountFilePath = fsPath.resolve(LOCAL_DB_DIR, "account.json");
    const accountObj = fs.readJsonSync(accountFilePath);
    if (!(accountObj == null ? void 0 : accountObj.vpsUser)) throw new Error("Please setup admin user first");
    const prerequisite = {};
    prerequisite.install_nginx = await isInstalled("nginx") ? true : false;
    prerequisite.configu_nginx = isNginxDirAdded();
    prerequisite.install_pm2 = await isInstalled("pm2") ? true : false;
    prerequisite.install_php = await isInstalled("php") ? true : false;
    prerequisite.canContinue = calcPrerequisiteScore(prerequisite) > 50;
    const runtimeConfig = useRuntimeConfig(event);
    const resp = {};
    resp.name = (_a2 = packageJson) == null ? void 0 : _a2.name;
    resp.version = (_b = packageJson) == null ? void 0 : _b.version;
    resp.appEnv = runtimeConfig == null ? void 0 : runtimeConfig.appEnv;
    resp.prerequisite = prerequisite;
    resp.profile = {
      name: accountObj == null ? void 0 : accountObj.vpsUser,
      email: accountObj == null ? void 0 : accountObj.username,
      avatar: getGravatarUrl(accountObj == null ? void 0 : accountObj.username)
    };
    if (runtimeConfig == null ? void 0 : runtimeConfig.appEnv.startsWith("dev")) {
      resp.appConfig = useAppConfig(event);
      resp.eventKeys = Object.keys(event);
      resp.envKeys = Object.keys(process == null ? void 0 : process.env);
    }
    return event.sendResponse(resp);
  } catch (err) {
    return event.errorResponse(err);
  }
});
function isNginxDirAdded() {
  const nginxFilePath = "/etc/nginx/nginx.conf";
  const nginxConfRaw = fs.readFileSync(nginxFilePath, "utf8");
  return nginxConfRaw.indexOf(`###_MODIFIED_BY_VPSCAP_###`) !== -1;
}
function calcPrerequisiteScore(prerequisite) {
  let currentScore = 0;
  if (prerequisite == null ? void 0 : prerequisite.install_nginx) currentScore += 25;
  if (prerequisite == null ? void 0 : prerequisite.configu_nginx) currentScore += 25;
  if (prerequisite == null ? void 0 : prerequisite.install_pm2) currentScore += 10;
  if (prerequisite == null ? void 0 : prerequisite.install_php) currentScore += 10;
  return currentScore;
}
function getGravatarUrl(email, size = 160, useCdn = true) {
  const trimmedEmail = `${email || ""}`.trim().toLowerCase();
  const imageHash = nodeCrypto.createHash("sha256").update(trimmedEmail).digest("hex");
  const imageUrl = `https://www.gravatar.com/avatar/${imageHash}?s=${size}`;
  return !useCdn ? imageUrl : `https://wsrv.nl/?url=${encodeURIComponent(imageUrl)}&default=${encodeURIComponent("wsrv.nl/placeholder.svg")}?fit=cover&w=${size}&h=${size}`;
}

export { verify as default };
//# sourceMappingURL=verify.mjs.map
