// import VpsAcmeSsl from "~/server/utils/vps/SslAcme";
// import VpsCertMeta from "~/server/utils/vps/SslMeta";
import VpsWebsites from "~/server/utils/vps/WebSites";

const site = new VpsWebsites();
// const sslm = new VpsCertMeta();

export default eventHandler(async (event) => {
  try {
    const result = await site.renewCerts();

    return event.sendResponse(result);
  } catch (err) {
    console.log("🚀 ~ eventHandler ~ err:", err);
    return event.errorResponse(err);
  }
});
