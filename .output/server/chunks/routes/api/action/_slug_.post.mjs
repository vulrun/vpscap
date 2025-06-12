import { e as eventHandler, r as readBody, W as WebSites, S as SslMeta } from '../../../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'envfile';
import 'ms';
import 'axios';
import 'fs-extra';
import 'node:dns/promises';
import 'lodash';
import 'shelljs';
import 'acme-client';
import 'node-forge';
import 'zod';
import 'glob';
import 'node:url';
import 'bcryptjs';

const site = new WebSites();
const sslm = new SslMeta();
const controllers = {
  insertMonitoredCert(body) {
    sslm.insert(body == null ? void 0 : body.domains);
    return "Added successfully";
  },
  deleteMonitoredCert(body) {
    sslm.delete(body == null ? void 0 : body.domains);
    return "Deleted successfully";
  },
  refreshMonitoredCert(body) {
    sslm.refresh(body == null ? void 0 : body.domains);
    return "Refreshed";
  },
  purgeMonitoredCertsCache() {
    sslm.purgeCache();
    return "Cache Purged";
  },
  async createInstalledCert(body) {
    await site.installCert(body == null ? void 0 : body.domains);
    return "Created successfully";
  },
  async deleteInstalledCert(body) {
    await site.deleteCert(body == null ? void 0 : body.domains);
    return "Deleted successfully";
  },
  async createSite(body) {
    await site.create(body);
    return "Site Added Successfully";
  },
  async updateSite(body) {
    if (!(body == null ? void 0 : body.id)) throw new Error("Conf ID is missing");
    await site.update(body == null ? void 0 : body.id, body);
    return "Site Configuration Updated";
  },
  async deleteSite(body) {
    if (!(body == null ? void 0 : body.id)) throw new Error("Conf ID is missing");
    await site.delete(body == null ? void 0 : body.id);
    return "Site moved to bin successfully";
  },
  async enableSite(body) {
    if (!(body == null ? void 0 : body.id)) throw new Error("Conf ID is missing");
    await site.enable(body == null ? void 0 : body.id);
    return "Site Enabled Successfully";
  },
  async disableSite(body) {
    if (!(body == null ? void 0 : body.id)) throw new Error("Conf ID is missing");
    await site.disable(body == null ? void 0 : body.id);
    return "Site Disabled Successfully";
  },
  async rebuildSite(body) {
    if (!(body == null ? void 0 : body.id)) throw new Error("Conf ID is missing");
    await site.rebuild(body == null ? void 0 : body.id);
    return "Site Configuration Rebuilt";
  },
  async rebuildAllSites() {
    await site.rebuildAll();
    return "All Nginx Configuration Rebuilt";
  }
};
const _slug__post = eventHandler(async (event) => {
  var _a, _b, _c, _d;
  try {
    const controllerFunc = controllers == null ? void 0 : controllers[(_b = (_a = event == null ? void 0 : event.context) == null ? void 0 : _a.params) == null ? void 0 : _b.slug];
    if (typeof controllerFunc !== "function") {
      throw new Error(`[${(_d = (_c = event == null ? void 0 : event.context) == null ? void 0 : _c.params) == null ? void 0 : _d.slug}] is not valid route`);
    }
    const body = await readBody(event);
    const result = controllerFunc(body);
    if (result instanceof Promise) {
      return event.sendResponse(await result);
    }
    return event.sendResponse(result);
  } catch (err) {
    console.log("\u{1F680} ~ eventHandler ~ err:", err);
    return event.errorResponse(err);
  }
});

export { _slug__post as default };
//# sourceMappingURL=_slug_.post.mjs.map
