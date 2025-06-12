function delay(ms2) {
  return new Promise((resolve) => setTimeout(resolve, ms2));
}
function createAvatarInitials(name) {
  const words = `${name || ""}`.trim().split(" ").slice(0, 2);
  const initials = words.map((word) => word.charAt(0)).join("");
  return initials.toUpperCase();
}
function encodeUserPass(user, pass) {
  if (!user) throw new Error("User is needed");
  if (!pass) throw new Error("User is needed");
  return hexEncode(JSON.stringify({ username: user, password: pass }));
}
function hexEncode(str) {
  let hexString = "";
  for (let i = 0; i < str.length; i++) {
    hexString += str.charCodeAt(i).toString(16).padStart(2, "0");
  }
  return hexString;
}
function sanitizeDomains(val) {
  if (!val) return [];
  const validDomain = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/i;
  val = String(val || "").replace(/[^a-z0-9\-\.]/gi, " ").replace(/\s+/g, " ").split(" ");
  val = Array.from(new Set(val)).filter((site) => validDomain.test(site));
  val.sort();
  return val;
}
function markdownToHtmlLite(text) {
  let html = text;
  html = html.replace(/__(.*?)__/g, "<u>$1</u>");
  html = html.replace(/~~(.*?)~~/g, "<del>$1</del>");
  html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*(.*?)\*/g, "<em>$1</em>");
  html = html.replace(/_(.*?)_/g, "<em>$1</em>");
  html = html.replace(/`([^`]+)`/g, "<code>$1</code>");
  return html;
}

export { createAvatarInitials as c, delay as d, encodeUserPass as e, markdownToHtmlLite as m, sanitizeDomains as s };
//# sourceMappingURL=helpers-Dzo_4TpY.mjs.map
