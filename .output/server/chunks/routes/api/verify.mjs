import { e as eventHandler, A as AccountJson, j as isInstalled, u as useRuntimeConfig, k as useAppConfig } from '../../nitro/nitro.mjs';
import fs from 'fs-extra';
import nodeCrypto from 'node:crypto';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'axios';
import 'html-minifier-terser';
import 'nodemailer';
import 'handlebars';
import 'lodash';
import 'shelljs';
import 'node:net';
import 'node:util';
import 'node:child_process';
import 'acme-client';
import 'node-forge';
import 'zod';
import 'glob';
import 'node:url';
import 'bcryptjs';

var name = "vpscap";
var version = "1.0.1";
var type = "module";
var scripts = {
	dev: "nuxt dev",
	build: "nuxt build",
	generate: "nuxt generate",
	preview: "nuxt preview",
	postinstall: "nuxt prepare",
	"clean:deps": "rm -vrf .data/ .nuxt/ .output/ dist/",
	"clean:node": "npm cache clean --force && rm -vrf node_modules/ package-lock.json",
	clean: "npm run clean:node && npm run clean:deps",
	"git:sync": "git fetch --all && git reset --hard origin/dist",
	"app:rebuild": "npm run git:sync && npm run clean:node && npm run clean:deps && npm install && npm run build",
	"app:start": "export $(cat .env | xargs) && node .output/server/index.mjs",
	"pm2:start": "export $(cat .env | xargs) && pm2 start .output/server/index.mjs --name=vpscap",
	"pm2:reload": "export $(cat .env | xargs) && pm2 reload vpscap --update-env && sudo systemctl restart nginx",
	"build:bin": "node ./core/build.js --all",
	"setup-vps-conf": "export $(cat .env | xargs) && sudo -E ./core/bin/setup-vps-conf",
	"setup-cronjobs": "./core/bin/setup-cronjobs",
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
	envfile: "^7.1.0",
	"fs-extra": "^11.3.0",
	glob: "^11.0.2",
	handlebars: "^4.7.8",
	"html-minifier-terser": "^7.2.0",
	lodash: "^4.17.21",
	"lucide-vue-next": "^0.513.0",
	"node-forge": "^1.3.1",
	nodemailer: "^7.0.6",
	nuxt: "^3.17.5",
	"radix-vue": "^1.9.17",
	shelljs: "^0.10.0",
	"vee-validate": "^4.15.1",
	vue: "~3.5.16",
	"vue-router": "~4.5.1",
	"vue-sonner": "2.0.0",
	zod: "^3.25.56"
};
var devDependencies = {
	"@nuxt/types": "^2.18.1",
	"@nuxtjs/color-mode": "^3.5.2",
	"@nuxtjs/tailwindcss": "^6.14.0",
	clsx: "^2.1.1",
	"shadcn-nuxt": "^2.2.0",
	"tailwind-merge": "^3.3.0",
	"tailwindcss-animate": "^1.0.7",
	typescript: "^5.9.2"
};
const packageJson = {
	name: name,
	version: version,
	"private": true,
	type: type,
	scripts: scripts,
	dependencies: dependencies,
	devDependencies: devDependencies
};

const verify = eventHandler(async (event) => {
  var _a, _b;
  try {
    const accJson = new AccountJson();
    const accObj = accJson.getData("*");
    if (!accObj.systemUser) throw new Error("Please setup admin user first");
    const deps = {};
    deps.install_nginx = await isInstalled("nginx");
    deps.configure_vps = await isVpsConfigured();
    deps.install_pm2 = await isInstalled("pm2");
    deps.install_php = await isInstalled("php");
    deps.current_score = calcScore(deps);
    deps.canContinue = deps.current_score > 50;
    const runtimeConfig = useRuntimeConfig(event);
    const resp = {};
    resp.name = (_a = packageJson) == null ? void 0 : _a.name;
    resp.appEnv = runtimeConfig == null ? void 0 : runtimeConfig.appEnv;
    resp.version = (_b = packageJson) == null ? void 0 : _b.version;
    resp.profile = {
      name: accObj == null ? void 0 : accObj.systemUser,
      email: accObj == null ? void 0 : accObj.loginMail,
      avatar: getGravatarUrl(accObj == null ? void 0 : accObj.systemUser),
      homeUrl: accObj == null ? void 0 : accObj.systemHost
    };
    resp.prerequisite = deps;
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
function isVpsConfigured() {
  const nginxFilePath = "/etc/nginx/nginx.conf";
  const nginxConfRaw = fs.readFileSync(nginxFilePath, "utf8");
  return nginxConfRaw.indexOf(`###_MODIFIED_BY_VPSCAP_###`) !== -1;
}
function calcScore(prerequisite) {
  let currentScore = 0;
  if (prerequisite == null ? void 0 : prerequisite.install_nginx) currentScore += 25;
  if (prerequisite == null ? void 0 : prerequisite.configure_vps) currentScore += 25;
  if (prerequisite == null ? void 0 : prerequisite.install_pm2) currentScore += 1;
  if (prerequisite == null ? void 0 : prerequisite.install_php) currentScore += 1;
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
