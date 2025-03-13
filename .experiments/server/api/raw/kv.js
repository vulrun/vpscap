import KvService from "@/server/utils/kvService";

export default eventHandler(async (event) => {
  try {
    const kv = new KvService(event?.context?.cloudflare?.env.KV);

    return event.sendResponse(await kv.fetchAll());
  } catch (err) {
    return event.errorResponse(err);
  }
});
