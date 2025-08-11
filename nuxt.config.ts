// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: {
    enabled: !true,
  },
  app: {
    // scrollBehavior(to, from, savedPosition) {
    //   if (to.hash) {
    //     return new Promise((resolve) => {
    //       setTimeout(() => {
    //         const el = document.querySelector(to.hash);
    //         if (el) {
    //           el.scrollIntoView({ behavior: "smooth" });
    //         }
    //         resolve({ left: 0, top: 0 }); // fallback
    //       }, 300); // Adjust the timeout as needed
    //     });
    //   }
    //   return savedPosition || { left: 0, top: 0 };
    // },
  },
  vite: {},
  build: {},
  modules: [
    //
    "@nuxtjs/color-mode",
    "@nuxtjs/tailwindcss",
    "shadcn-nuxt",
  ],
  shadcn: {
    prefix: "",
    componentDir: "./components/ui",
  },
  runtimeConfig: {
    appEnv: process?.env?.APP_ENV || "production",
    loginUsername: "",
    loginPassword: "",
    // homeURL: "",
    // apiAuthToken: "",
    // linkCacheTtl: 60,
    // caseSensitive: false,
    // redirectWithQuery: false,
    // redirectStatusCode: "307",
    // mysqlUrl: "",
    public: {
      appEnv: process?.env?.APP_ENV || "production",
    },
  },
  routeRules: {
    // "/": { redirect: "/home" },
  },
  nitro: {
    // preset: "cloudflare_pages",
    // routeRules: {
    //   "/getting-started": {
    //     ssr: true,
    //   },
    //   "/": {
    //     prerender: true,
    //   },
    //   "/dashboard/**": {
    //     ssr: false,
    //   },
    //   "/dashboard": {
    //     redirect: "/dashboard/links",
    //   },
    // },
  },
});
