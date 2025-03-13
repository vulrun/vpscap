import { z } from "zod";
import KvService from "@/server/utils/kvService";
import LinkService from "@/server/utils/linkService";

export default eventHandler(async (event) => {
  try {
    const ListSchema = z.object({
      limit: z.coerce.number().max(1024).default(20),
      cursor: z.string().trim().max(1024).optional(),
    });

    const searchParam = await getValidatedQuery(event, ListSchema.parse);

    const kv = new KvService(event?.context?.cloudflare?.env.KV);
    const list = await kv.fetchAll(+searchParam?.limit, searchParam?.cursor);
    list.links = list.items;
    delete list.items;

    return event.sendResponse(list, 201);
  } catch (err) {
    return event.errorResponse(err);
  }
});
