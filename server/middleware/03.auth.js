import { validateAdminUser } from "@@/server/utils/bin/admin";
import AccountJson from "@@/server/utils/vps/AccountJson";

const accJson = new AccountJson();

export default eventHandler((event) => {
  if (import.meta.client) return;
  if (event.path === "/api/ping") return;
  if (event.path.startsWith("/api/public")) return;
  if (!event.path.startsWith("/api")) return;

  try {
    const token = getHeader(event, "Authorization")?.replace("Bearer ", "");
    if (!token) return event.errorResponse(new Error("Token is missing"), 401);

    const { username, password } = accJson.getData(["username", "password"]);
    const isValidToken = validateAdminUser(decodeUserPass(token), { username, password });

    if (event.path.startsWith("/api/") && !event.path.startsWith("/api/_") && !isValidToken) {
      return event.errorResponse(new Error("Unauthorized"), 401);
    }
  } catch (err) {
    if (/password|user/i.test(err?.message)) {
      return event.errorResponse(err, 401);
    }
    return event.errorResponse(err, 400);
  }
});
