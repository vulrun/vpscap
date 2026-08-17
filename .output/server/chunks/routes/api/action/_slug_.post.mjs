import { e as eventHandler, g as getHeaders, a as getRouterParams, b as getQuery, r as readBody, c as runCronJobTask, A as AccountJson, s as sendEmailNow, W as WebSites, S as SslMeta } from '../../../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'fs-extra';
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

const vpsSite = new WebSites();
const vpsMeta = new SslMeta();
const accJson = new AccountJson();
const controllers = {
  // monitored certs handlers
  async insertMonitoredCert({ body }) {
    await vpsMeta.insert(body == null ? void 0 : body.domains);
    return "Added successfully";
  },
  async deleteMonitoredCert({ body }) {
    await vpsMeta.delete(body == null ? void 0 : body.domains);
    return "Deleted successfully";
  },
  async refreshMonitoredCert({ body }) {
    await vpsMeta.hardRefresh(body == null ? void 0 : body.domains);
    return "Refreshed";
  },
  async purgeMonitoredCertsCache() {
    await vpsMeta.purgeCacheAll();
    await vpsMeta.fetchAll();
    return "Cache Purged";
  },
  // installed certs handlers
  async createInstalledCert({ body }) {
    await vpsSite.installCert(body == null ? void 0 : body.domains);
    return "Created successfully";
  },
  async deleteInstalledCert({ body }) {
    await vpsSite.deleteCert(body == null ? void 0 : body.domains);
    return "Deleted successfully";
  },
  async renewInstalledCert({ body }) {
    await vpsSite.renewCert(body == null ? void 0 : body.domains);
    return "Renew successfully";
  },
  // web sites handlers
  async createSite({ body }) {
    await vpsSite.create(body);
    return "Site Added Successfully";
  },
  async updateSite({ body }) {
    if (!(body == null ? void 0 : body.id)) throw new Error("Conf ID is missing");
    await vpsSite.update(body == null ? void 0 : body.id, body);
    return "Site Configuration Updated";
  },
  async deleteSite({ body }) {
    if (!(body == null ? void 0 : body.id)) throw new Error("Conf ID is missing");
    await vpsSite.delete(body == null ? void 0 : body.id);
    return "Site moved to bin successfully";
  },
  async enableSite({ body }) {
    if (!(body == null ? void 0 : body.id)) throw new Error("Conf ID is missing");
    await vpsSite.enable(body == null ? void 0 : body.id);
    return "Site Enabled Successfully";
  },
  async disableSite({ body }) {
    if (!(body == null ? void 0 : body.id)) throw new Error("Conf ID is missing");
    await vpsSite.disable(body == null ? void 0 : body.id);
    return "Site Disabled Successfully";
  },
  async rebuildSite({ body }) {
    if (!(body == null ? void 0 : body.id)) throw new Error("Conf ID is missing");
    await vpsSite.rebuild(body == null ? void 0 : body.id);
    return "Site Configuration Rebuilt";
  },
  async rebuildAllSites() {
    await vpsSite.rebuildAll();
    return "All Nginx Configuration Rebuilt";
  },
  async setAccountData(req) {
    try {
      return accJson.setData(req == null ? void 0 : req.body);
    } catch (err) {
      return null;
    }
  },
  async sendSmtpTestEmail(req) {
    const { loginMail, systemUser, systemHost } = accJson.getData(["loginMail", "systemUser", "systemHost"]);
    const sentInfo = await sendEmailNow({
      to: loginMail,
      subject: "SMTP Test Email",
      body: `This is a test email sent from VPS server (${systemUser}@${systemHost}).`
    });
    const smtpTestStatus = {
      exit: (sentInfo == null ? void 0 : sentInfo.success) ? 0 : 1,
      note: sentInfo == null ? void 0 : sentInfo.remarks
    };
    return accJson.setData({ smtpTestStatus });
  },
  async triggerCronJob(req) {
    var _a;
    const jobSlug = (_a = req == null ? void 0 : req.body) == null ? void 0 : _a.jobSlug;
    return await runCronJobTask(jobSlug, true);
  }
};
const _slug__post = eventHandler(async (event) => {
  var _a, _b, _c, _d;
  try {
    const controllerFunc = controllers == null ? void 0 : controllers[(_b = (_a = event == null ? void 0 : event.context) == null ? void 0 : _a.params) == null ? void 0 : _b.slug];
    if (typeof controllerFunc !== "function") {
      throw new Error(`[${(_d = (_c = event == null ? void 0 : event.context) == null ? void 0 : _c.params) == null ? void 0 : _d.slug}] is not valid route`);
    }
    const headers = getHeaders(event);
    const params = getRouterParams(event);
    const query = getQuery(event);
    const body = await readBody(event);
    const result = controllerFunc({ event, headers, params, query, body });
    if (result instanceof Promise) {
      return event.sendResponse(await result || "RESPONSE_UNDEFINED");
    }
    return event.sendResponse(result || "RESPONSE_UNDEFINED");
  } catch (err) {
    return event.errorResponse(err);
  }
});

export { _slug__post as default };
//# sourceMappingURL=_slug_.post.mjs.map
