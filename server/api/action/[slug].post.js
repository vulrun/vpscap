import VpsAcmeSsl from "~/server/utils/vps/SslAcme";
import VpsCertMeta from "~/server/utils/vps/SslMeta";
import VpsWebsites from "~/server/utils/vps/WebSites";

const site = new VpsWebsites();
const sslm = new VpsCertMeta();

const controllers = {
  insertMonitoredCert(body) {
    sslm.insert(body?.domains);
    return "Added successfully";
  },
  deleteMonitoredCert(body) {
    sslm.delete(body?.domains);
    return "Deleted successfully";
  },
  refreshMonitoredCert(body) {
    sslm.refresh(body?.domains);
    return "Refreshed";
  },
  purgeMonitoredCertsCache() {
    sslm.purgeCache();
    return "Cache Purged";
  },

  async createInstalledCert(body) {
    await site.installCert(body?.domains);
    return "Created successfully";
  },
  async deleteInstalledCert(body) {
    await site.deleteCert(body?.domains);
    return "Deleted successfully";
  },

  async createSite(body) {
    await site.create(body);
    return "Site Added Successfully";
  },
  async updateSite(body) {
    if (!body?.id) throw new Error("Conf ID is missing");
    await site.update(body?.id, body);
    return "Site Configuration Updated";
  },
  async deleteSite(body) {
    if (!body?.id) throw new Error("Conf ID is missing");
    await site.delete(body?.id);
    return "Site moved to bin successfully";
  },
  async enableSite(body) {
    if (!body?.id) throw new Error("Conf ID is missing");
    await site.enable(body?.id);
    return "Site Enabled Successfully";
  },
  async disableSite(body) {
    if (!body?.id) throw new Error("Conf ID is missing");
    await site.disable(body?.id);
    return "Site Disabled Successfully";
  },
  async rebuildSite(body) {
    if (!body?.id) throw new Error("Conf ID is missing");
    await site.rebuild(body?.id);
    return "Site Configuration Rebuilt";
  },
  async rebuildAllSites() {
    await site.rebuildAll();
    return "All Nginx Configuration Rebuilt";
  },
};

export default eventHandler(async (event) => {
  try {
    const controllerFunc = controllers?.[event?.context?.params?.slug];

    if (typeof controllerFunc !== "function") {
      throw new Error(`[${event?.context?.params?.slug}] is not valid route`);
    }

    const body = await readBody(event);
    const result = controllerFunc(body);
    if (result instanceof Promise) {
      return event.sendResponse(await result);
    }

    return event.sendResponse(result);
  } catch (err) {
    console.log("🚀 ~ eventHandler ~ err:", err);
    return event.errorResponse(err);
  }
});
