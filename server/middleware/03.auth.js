import { validateAdminUser } from "@@/server/utils/bin/admin";

export default eventHandler((event) => {
  if (import.meta.client) return;
  if (!event.path.startsWith("/api")) return;
  if (event.path === "/api/ping") return;

  try {
    const token = getHeader(event, "Authorization")?.replace("Bearer ", "");
    if (!token) return event.errorResponse(new Error("Token is missing"), 401);

    const { loginUsername, loginPassword } = useRuntimeConfig(event);
    const isValidToken = validateAdminUser(decodeUserPass(token), { username: loginUsername, password: loginPassword });

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
