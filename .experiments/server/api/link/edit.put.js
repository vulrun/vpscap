import { LinkSchema } from "@/schemas/link";
import LinkService from "@/server/utils/linkService";

export default eventHandler(async (event) => {
  try {
    const linkService = new LinkService({ kv: event?.context?.cloudflare?.env.KV });
    const body = await readBody(event);
    if (!body?.slug) {
      throw createError({
        statusCode: 400, // bad request
        statusMessage: "Slug is missing",
      });
    }

    // find by slug, if not exists throw with no found
    const link = await readValidatedBody(event, LinkSchema.parse);
    const existingLink = await linkService.findBySlug(link?.slug);
    if (!existingLink) {
      throw createError({
        statusCode: 404, // not found
        statusMessage: "Link not found",
      });
    }

    // update the link to mysql and kv
    const newLink = await linkService.editLink(link);
    newLink.shortLink = `${getRequestProtocol(event)}://${getRequestHost(event)}/${link.slug}`;

    return event.sendResponse({ link: newLink });
  } catch (err) {
    return event.errorResponse(err);
  }
});
