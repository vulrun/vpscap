export default defineNuxtRouteMiddleware(async (to) => {
  if (import.meta.server) return;

  const webAppToken = $persist("WebAppToken") || "";
  const isServerApi = to?.path?.startsWith("/api");
  const isRootPath = to.path === "/";
  const requiresAuth = to?.meta?.requiresAuth === true;
  const isPrivateRoute = requiresAuth || isRootPath;
  const isPublicRoute = !isPrivateRoute;
  consoleLog("🚀 ~ defineNuxtRouteMiddleware:", JSON.stringify({ path: to.path, webAppToken, requiresAuth, isPublicRoute, isRootPath, isServerApi, isPrivateRoute }, null, 2));

  // redirect to root, just in case of serverApi
  // (we have already added checks, above to return for server calls)
  if (isServerApi) return navigateTo("/");

  // if isPublicRoute with no token, do nothing
  if (isPublicRoute && !webAppToken) return;

  // if isPublicRoute and has token
  if (isPublicRoute && webAppToken) {
    try {
      await useApi("/api/verify");
      return navigateTo("/home");
    } catch (e) {
      console.warn(e);
      return;
    }
  }

  // if isPrivateRoute and has no token
  if (isPrivateRoute && !webAppToken) {
    return navigateTo("/login");
  }

  // if isPrivateRoute and has token
  if (isPrivateRoute && webAppToken)
    try {
      const data = await useApi("/api/verify");
      $persist("WebAppData", data);

      if (isRootPath) {
        return navigateTo("/home");
      }
    } catch (e) {
      console.warn(e);
      return navigateTo("/login");
    }
});
