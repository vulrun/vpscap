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

    const existingLink = await linkService.findBySlug(body?.slug);
    if (!existingLink) {
      return event.sendResponse({ link: null }, 201, "Link Already Deleted");
    }

    await linkService.deleteLink(body?.slug);
    return event.sendResponse({ link: null }, 201, "Link Deleted");
  } catch (err) {
    return event.errorResponse(err);
  }
});
