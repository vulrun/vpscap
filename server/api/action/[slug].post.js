import VpsCertMeta from "@@/server/utils/vps/SslMeta";
import VpsWebsites from "@@/server/utils/vps/WebSites";
import AccountJson from "@@/server/utils/vps/AccountJson";

const vpsSite = new VpsWebsites();
const vpsMeta = new VpsCertMeta();
const accJson = new AccountJson();

const controllers = {
  // monitored certs handlers
  async insertMonitoredCert({ body }) {
    await vpsMeta.insert(body?.domains);
    return "Added successfully";
  },
  async deleteMonitoredCert({ body }) {
    await vpsMeta.delete(body?.domains);
    return "Deleted successfully";
  },
  async refreshMonitoredCert({ body }) {
    await vpsMeta.hardRefresh(body?.domains);
    return "Refreshed";
  },
  async purgeMonitoredCertsCache() {
    await vpsMeta.purgeCacheAll();
    await vpsMeta.fetchAll();
    return "Cache Purged";
  },

  // installed certs handlers
  async createInstalledCert({ body }) {
    await vpsSite.installCert(body?.domains);
    return "Created successfully";
  },
  async deleteInstalledCert({ body }) {
    await vpsSite.deleteCert(body?.domains);
    return "Deleted successfully";
  },
  async renewInstalledCert({ body }) {
    await vpsSite.renewCert(body?.domains);
    return "Renew successfully";
  },

  // web sites handlers
  async createSite({ body }) {
    await vpsSite.create(body);
    return "Site Added Successfully";
  },
  async updateSite({ body }) {
    if (!body?.id) throw new Error("Conf ID is missing");
    await vpsSite.update(body?.id, body);
    return "Site Configuration Updated";
  },
  async deleteSite({ body }) {
    if (!body?.id) throw new Error("Conf ID is missing");
    await vpsSite.delete(body?.id);
    return "Site moved to bin successfully";
  },
  async enableSite({ body }) {
    if (!body?.id) throw new Error("Conf ID is missing");
    await vpsSite.enable(body?.id);
    return "Site Enabled Successfully";
  },
  async disableSite({ body }) {
    if (!body?.id) throw new Error("Conf ID is missing");
    await vpsSite.disable(body?.id);
    return "Site Disabled Successfully";
  },
  async rebuildSite({ body }) {
    if (!body?.id) throw new Error("Conf ID is missing");
    await vpsSite.rebuild(body?.id);
    return "Site Configuration Rebuilt";
  },
  async rebuildAllSites() {
    await vpsSite.rebuildAll();
    return "All Nginx Configuration Rebuilt";
  },

  async setAccountData(req) {
    try {
      return accJson.setData(req?.body);
    } catch (err) {
      return null;
    }
  },

  async sendSmtpTestEmail(req) {
    const { loginMail, systemUser, systemHost } = accJson.getData(["loginMail", "systemUser", "systemHost"]);
    const sentInfo = await sendEmailNow({
      to: loginMail,
      subject: "SMTP Test Email",
      body: `This is a test email sent from VPS server (${systemUser}@${systemHost}).`,
    });

    const smtpTestStatus = {
      exit: sentInfo?.success ? 0 : 1,
      note: sentInfo?.remarks,
    };
    return accJson.setData({ smtpTestStatus });
  },

  async triggerCronJob(req) {
    const jobSlug = req?.body?.jobSlug;
    return await runCronJobTask(jobSlug, true);
  },
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
    const result = controllerFunc({ event, headers, params, query, body });
    if (result instanceof Promise) {
      return event.sendResponse((await result) || "RESPONSE_UNDEFINED");
    }

    return event.sendResponse(result || "RESPONSE_UNDEFINED");
  } catch (err) {
    return event.errorResponse(err);
  }
});
