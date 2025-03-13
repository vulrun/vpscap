import { LinkSchema } from "@/schemas/link";
import LinkService from "@/server/utils/linkService";

export default eventHandler(async (event) => {
  try {
    const link = await readValidatedBody(event, LinkSchema.parse);
    const { caseSensitive } = useRuntimeConfig(event);
    if (!caseSensitive) {
      link.slug = link.slug.toLowerCase();
    }

    // check for url by hash, if exists return same info
    const linkService = new LinkService({ kv: event?.context?.cloudflare?.env.KV });
    // const existingLink = await linkService.findByUrl(link?.url);
    // if (existingLink) {
    //   return event.sendResponse({ link: existingLink, mesage: "Link shortened" }, 202, "Link already exists");
    // }

    // check for slug, if exists throw slug already in use
    const existingSlug = await linkService.findBySlug(link?.slug);
    if (existingSlug) {
      throw createError({
        statusCode: 409, // conflict
        statusMessage: "Link already exists",
      });
    }

    // insert the link to mysql and kv
    const newLink = await linkService.addLink(link);
    newLink.shortLink = `${getRequestProtocol(event)}://${getRequestHost(event)}/${newLink?.slug}`;

    return event.sendResponse({ link: newLink, mesage: "Link shortened" }, 201);
  } catch (err) {
    return event.errorResponse(err);
  }
});
