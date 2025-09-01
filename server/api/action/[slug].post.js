import VpsAcmeSsl from "@@/server/utils/vps/SslAcme";
import VpsCertMeta from "@@/server/utils/vps/SslMeta";
import VpsWebsites from "@@/server/utils/vps/WebSites";
import AccountJson from "@@/server/utils/vps/AccountJson";

const site = new VpsWebsites();
const sslm = new VpsCertMeta();
const ajson = new AccountJson();

const controllers = {
  // monitored certs handlers
  async insertMonitoredCert({ body }) {
    await sslm.insert(body?.domains);
    return "Added successfully";
  },
  async deleteMonitoredCert({ body }) {
    await sslm.delete(body?.domains);
    return "Deleted successfully";
  },
  async refreshMonitoredCert({ body }) {
    await sslm.hardRefresh(body?.domains);
    return "Refreshed";
  },
  async purgeMonitoredCertsCache() {
    await sslm.purgeCacheAll();
    await sslm.fetchAll();
    return "Cache Purged";
  },

  // installed certs handlers
  async createInstalledCert({ body }) {
    await site.installCert(body?.domains);
    return "Created successfully";
  },
  async deleteInstalledCert({ body }) {
    await site.deleteCert(body?.domains);
    return "Deleted successfully";
  },
  async renewInstalledCert({ body }) {
    await site.renewCert(body?.domains);
    return "Renew successfully";
  },

  // web sites handlers
  async createSite({ body }) {
    await site.create(body);
    return "Site Added Successfully";
  },
  async updateSite({ body }) {
    if (!body?.id) throw new Error("Conf ID is missing");
    await site.update(body?.id, body);
    return "Site Configuration Updated";
  },
  async deleteSite({ body }) {
    if (!body?.id) throw new Error("Conf ID is missing");
    await site.delete(body?.id);
    return "Site moved to bin successfully";
  },
  async enableSite({ body }) {
    if (!body?.id) throw new Error("Conf ID is missing");
    await site.enable(body?.id);
    return "Site Enabled Successfully";
  },
  async disableSite({ body }) {
    if (!body?.id) throw new Error("Conf ID is missing");
    await site.disable(body?.id);
    return "Site Disabled Successfully";
  },
  async rebuildSite({ body }) {
    if (!body?.id) throw new Error("Conf ID is missing");
    await site.rebuild(body?.id);
    return "Site Configuration Rebuilt";
  },
  async rebuildAllSites() {
    await site.rebuildAll();
    return "All Nginx Configuration Rebuilt";
  },

  async setAccountData(req) {
    try {
      return ajson.setData(req?.body);
    } catch (err) {
      return null;
    }
  },

  sendSmtpTestEmail(req) {
    // todo: add code to send a test email
    const smtpTestStatus = { exit: 1 };

    return ajson.setData({ smtpTestStatus });
  },

  setCronJobs() {},
};

export default eventHandler(async (event) => {
  try {
    const controllerFunc = controllers?.[event?.context?.params?.slug];

    if (typeof controllerFunc !== "function") {
      throw new Error(`[${event?.context?.params?.slug}] is not valid route`);
    }

    const headers = getHeaders(event);
    const params = getRouterParams(event);
    const query = getQuery(event);
    const body = await readBody(event);
    const result = controllerFunc({ headers, params, query, body });
    if (result instanceof Promise) {
      return event.sendResponse(await result);
    }

    return event.sendResponse(result);
  } catch (err) {
    return event.errorResponse(err);
  }
});
