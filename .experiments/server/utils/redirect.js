import { parsePath, withQuery } from "ufo";
import LinkService from "@/server/utils/linkService";

export default eventHandler(async (event) => {
  const { pathname: slug } = parsePath(event.path.replace(/^\/|\/$/g, "")); // remove leading and trailing slashes
  const { slugRegex, reserveSlug } = useAppConfig(event);
  const { homeURL, redirectWithQuery, caseSensitive } = useRuntimeConfig(event);
  const linkService = new LinkService({ kv: event?.context?.cloudflare?.env.KV });

  if (event.path === "/") {
    return homeURL ? sendRedirect(event, homeURL) : sendRedirect(event, "/dashboard");
  }

  if (slug && !reserveSlug.includes(slug) && slugRegex.test(slug)) {
    const lowerCaseSlug = slug.toLowerCase();
    let link = await linkService.getLink(caseSensitive ? slug : lowerCaseSlug);

    // fallback to original slug if caseSensitive is false and the slug is not found
    if (!caseSensitive && !link && lowerCaseSlug !== slug) {
      console.log("original slug fallback:", `slug:${slug} lowerCaseSlug:${lowerCaseSlug}`);
      link = await linkService.getLink(slug);
    }

    if (link) {
      event.context.link = link;
      const target = redirectWithQuery ? withQuery(link.url, getQuery(event)) : link.url;
      return sendRedirect(event, target, +useRuntimeConfig(event).redirectStatusCode);
    }
  }
});
