export default defineNuxtRouteMiddleware(async (to) => {
  if (import.meta.server) return;

  const webAppToken = localStorage.getItem("WebAppToken") || "";
  const isPublicRoute = ["/login"].includes(to.path);
  const isRootPath = to.path === "/";
  const isServerApi = to?.path?.startsWith("/api");
  const isPrivateRoute = !isPublicRoute && !isRootPath && !isServerApi;

  if (isPublicRoute && webAppToken) {
    try {
      await useApi("/api/verify");
      return navigateTo("/home");
    } catch (e) {
      console.warn(e);
    }
  }

  try {
    if (isRootPath && webAppToken) {
      await useApi("/api/verify");
      return navigateTo("/home");
    }

    if (isPrivateRoute && !webAppToken) {
      throw new Error("INVALID_SESSION");
    }

    if (webAppToken) await useApi("/api/verify");
  } catch (error) {
    navigateTo("/login");
  }
});
