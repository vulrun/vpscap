import KvService from "@/server/utils/kvService";

export default eventHandler(async (event) => {
  try {
    const kv = new KvService(event?.context?.cloudflare?.env.KV);
    const list = await kv.fetchAll();
    const data = list?.items.map(({ slug, url, comment }) => ({ slug, url, comment }));

    return event.sendResponse(data);
  } catch (err) {
    return event.errorResponse(err);
  }
});
