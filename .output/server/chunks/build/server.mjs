import { hasInjectionContext, inject, getCurrentInstance, defineAsyncComponent, defineComponent, h, computed, unref, shallowRef, provide, shallowReactive, useSSRContext, ref, Suspense, Fragment, createApp, mergeProps, toRef, onErrorCaptured, onServerPrefetch, createVNode, resolveDynamicComponent, reactive, effectScope, isReadonly, isRef, isShallow, isReactive, toRaw, withCtx, createBlock, openBlock, toDisplayString, getCurrentScope, nextTick } from 'vue';
import { f as createError$1, l as klona, m as defuFn, n as hasProtocol, o as isScriptProtocol, p as joinURL, w as withQuery, q as sanitizeStatusCode, t as getContext, $ as $fetch, v as createHooks, x as executeAsync, y as toRouteMatcher, z as createRouter$1, A as defu } from '../nitro/nitro.mjs';
import { b as baseURL, u as useHead$1, h as headSymbol } from '../routes/renderer.mjs';
import { useRoute as useRoute$1, RouterView, createMemoryHistory, createRouter, START_LOCATION } from 'vue-router';
import { ssrRenderComponent, ssrRenderSuspense, ssrRenderVNode, ssrInterpolate } from 'vue/server-renderer';
import { Toaster } from 'vue-sonner';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'envfile';
import 'ms';
import 'axios';
import 'fs-extra';
import 'node:dns/promises';
import 'lodash';
import 'shelljs';
import 'acme-client';
import 'node-forge';
import 'zod';
import 'glob';
import 'node:url';
import 'bcryptjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';

if (!globalThis.$fetch) {
  globalThis.$fetch = $fetch.create({
    baseURL: baseURL()
  });
}
if (!("global" in globalThis)) {
  globalThis.global = globalThis;
}
const appLayoutTransition = false;
const nuxtLinkDefaults = { "componentName": "NuxtLink" };
const asyncDataDefaults = { "value": null, "errorValue": null, "deep": true };
const appId = "nuxt-app";
function getNuxtAppCtx(id = appId) {
  return getContext(id, {
    asyncContext: false
  });
}
const NuxtPluginIndicator = "__nuxt_plugin";
function createNuxtApp(options) {
  var _a;
  let hydratingCount = 0;
  const nuxtApp = {
    _id: options.id || appId || "nuxt-app",
    _scope: effectScope(),
    provide: void 0,
    globalName: "nuxt",
    versions: {
      get nuxt() {
        return "3.17.5";
      },
      get vue() {
        return nuxtApp.vueApp.version;
      }
    },
    payload: shallowReactive({
      ...((_a = options.ssrContext) == null ? void 0 : _a.payload) || {},
      data: shallowReactive({}),
      state: reactive({}),
      once: /* @__PURE__ */ new Set(),
      _errors: shallowReactive({})
    }),
    static: {
      data: {}
    },
    runWithContext(fn) {
      if (nuxtApp._scope.active && !getCurrentScope()) {
        return nuxtApp._scope.run(() => callWithNuxt(nuxtApp, fn));
      }
      return callWithNuxt(nuxtApp, fn);
    },
    isHydrating: false,
    deferHydration() {
      if (!nuxtApp.isHydrating) {
        return () => {
        };
      }
      hydratingCount++;
      let called = false;
      return () => {
        if (called) {
          return;
        }
        called = true;
        hydratingCount--;
        if (hydratingCount === 0) {
          nuxtApp.isHydrating = false;
          return nuxtApp.callHook("app:suspense:resolve");
        }
      };
    },
    _asyncDataPromises: {},
    _asyncData: shallowReactive({}),
    _payloadRevivers: {},
    ...options
  };
  {
    nuxtApp.payload.serverRendered = true;
  }
  if (nuxtApp.ssrContext) {
    nuxtApp.payload.path = nuxtApp.ssrContext.url;
    nuxtApp.ssrContext.nuxt = nuxtApp;
    nuxtApp.ssrContext.payload = nuxtApp.payload;
    nuxtApp.ssrContext.config = {
      public: nuxtApp.ssrContext.runtimeConfig.public,
      app: nuxtApp.ssrContext.runtimeConfig.app
    };
  }
  nuxtApp.hooks = createHooks();
  nuxtApp.hook = nuxtApp.hooks.hook;
  {
    const contextCaller = async function(hooks, args) {
      for (const hook of hooks) {
        await nuxtApp.runWithContext(() => hook(...args));
      }
    };
    nuxtApp.hooks.callHook = (name, ...args) => nuxtApp.hooks.callHookWith(contextCaller, name, ...args);
  }
  nuxtApp.callHook = nuxtApp.hooks.callHook;
  nuxtApp.provide = (name, value) => {
    const $name = "$" + name;
    defineGetter(nuxtApp, $name, value);
    defineGetter(nuxtApp.vueApp.config.globalProperties, $name, value);
  };
  defineGetter(nuxtApp.vueApp, "$nuxt", nuxtApp);
  defineGetter(nuxtApp.vueApp.config.globalProperties, "$nuxt", nuxtApp);
  const runtimeConfig = options.ssrContext.runtimeConfig;
  nuxtApp.provide("config", runtimeConfig);
  return nuxtApp;
}
function registerPluginHooks(nuxtApp, plugin2) {
  if (plugin2.hooks) {
    nuxtApp.hooks.addHooks(plugin2.hooks);
  }
}
async function applyPlugin(nuxtApp, plugin2) {
  if (typeof plugin2 === "function") {
    const { provide: provide2 } = await nuxtApp.runWithContext(() => plugin2(nuxtApp)) || {};
    if (provide2 && typeof provide2 === "object") {
      for (const key in provide2) {
        nuxtApp.provide(key, provide2[key]);
      }
    }
  }
}
async function applyPlugins(nuxtApp, plugins2) {
  var _a, _b, _c, _d;
  const resolvedPlugins = /* @__PURE__ */ new Set();
  const unresolvedPlugins = [];
  const parallels = [];
  const errors = [];
  let promiseDepth = 0;
  async function executePlugin(plugin2) {
    var _a2;
    const unresolvedPluginsForThisPlugin = ((_a2 = plugin2.dependsOn) == null ? void 0 : _a2.filter((name) => plugins2.some((p) => p._name === name) && !resolvedPlugins.has(name))) ?? [];
    if (unresolvedPluginsForThisPlugin.length > 0) {
      unresolvedPlugins.push([new Set(unresolvedPluginsForThisPlugin), plugin2]);
    } else {
      const promise = applyPlugin(nuxtApp, plugin2).then(async () => {
        if (plugin2._name) {
          resolvedPlugins.add(plugin2._name);
          await Promise.all(unresolvedPlugins.map(async ([dependsOn, unexecutedPlugin]) => {
            if (dependsOn.has(plugin2._name)) {
              dependsOn.delete(plugin2._name);
              if (dependsOn.size === 0) {
                promiseDepth++;
                await executePlugin(unexecutedPlugin);
              }
            }
          }));
        }
      });
      if (plugin2.parallel) {
        parallels.push(promise.catch((e) => errors.push(e)));
      } else {
        await promise;
      }
    }
  }
  for (const plugin2 of plugins2) {
    if (((_a = nuxtApp.ssrContext) == null ? void 0 : _a.islandContext) && ((_b = plugin2.env) == null ? void 0 : _b.islands) === false) {
      continue;
    }
    registerPluginHooks(nuxtApp, plugin2);
  }
  for (const plugin2 of plugins2) {
    if (((_c = nuxtApp.ssrContext) == null ? void 0 : _c.islandContext) && ((_d = plugin2.env) == null ? void 0 : _d.islands) === false) {
      continue;
    }
    await executePlugin(plugin2);
  }
  await Promise.all(parallels);
  if (promiseDepth) {
    for (let i = 0; i < promiseDepth; i++) {
      await Promise.all(parallels);
    }
  }
  if (errors.length) {
    throw errors[0];
  }
}
// @__NO_SIDE_EFFECTS__
function defineNuxtPlugin(plugin2) {
  if (typeof plugin2 === "function") {
    return plugin2;
  }
  const _name = plugin2._name || plugin2.name;
  delete plugin2.name;
  return Object.assign(plugin2.setup || (() => {
  }), plugin2, { [NuxtPluginIndicator]: true, _name });
}
function callWithNuxt(nuxt, setup, args) {
  const fn = () => setup();
  const nuxtAppCtx = getNuxtAppCtx(nuxt._id);
  {
    return nuxt.vueApp.runWithContext(() => nuxtAppCtx.callAsync(nuxt, fn));
  }
}
function tryUseNuxtApp(id) {
  var _a;
  let nuxtAppInstance;
  if (hasInjectionContext()) {
    nuxtAppInstance = (_a = getCurrentInstance()) == null ? void 0 : _a.appContext.app.$nuxt;
  }
  nuxtAppInstance || (nuxtAppInstance = getNuxtAppCtx(id).tryUse());
  return nuxtAppInstance || null;
}
function useNuxtApp(id) {
  const nuxtAppInstance = tryUseNuxtApp(id);
  if (!nuxtAppInstance) {
    {
      throw new Error("[nuxt] instance unavailable");
    }
  }
  return nuxtAppInstance;
}
// @__NO_SIDE_EFFECTS__
function useRuntimeConfig(_event) {
  return useNuxtApp().$config;
}
function defineGetter(obj, key, val) {
  Object.defineProperty(obj, key, { get: () => val });
}
function defineAppConfig(config) {
  return config;
}
const LayoutMetaSymbol = Symbol("layout-meta");
const PageRouteSymbol = Symbol("route");
const useRouter = () => {
  var _a;
  return (_a = useNuxtApp()) == null ? void 0 : _a.$router;
};
const useRoute = () => {
  if (hasInjectionContext()) {
    return inject(PageRouteSymbol, useNuxtApp()._route);
  }
  return useNuxtApp()._route;
};
// @__NO_SIDE_EFFECTS__
function defineNuxtRouteMiddleware(middleware) {
  return middleware;
}
const isProcessingMiddleware = () => {
  try {
    if (useNuxtApp()._processingMiddleware) {
      return true;
    }
  } catch {
    return false;
  }
  return false;
};
const URL_QUOTE_RE = /"/g;
const navigateTo = (to, options) => {
  to || (to = "/");
  const toPath = typeof to === "string" ? to : "path" in to ? resolveRouteObject(to) : useRouter().resolve(to).href;
  const isExternalHost = hasProtocol(toPath, { acceptRelative: true });
  const isExternal = (options == null ? void 0 : options.external) || isExternalHost;
  if (isExternal) {
    if (!(options == null ? void 0 : options.external)) {
      throw new Error("Navigating to an external URL is not allowed by default. Use `navigateTo(url, { external: true })`.");
    }
    const { protocol } = new URL(toPath, "http://localhost");
    if (protocol && isScriptProtocol(protocol)) {
      throw new Error(`Cannot navigate to a URL with '${protocol}' protocol.`);
    }
  }
  const inMiddleware = isProcessingMiddleware();
  const router = useRouter();
  const nuxtApp = useNuxtApp();
  {
    if (nuxtApp.ssrContext) {
      const fullPath = typeof to === "string" || isExternal ? toPath : router.resolve(to).fullPath || "/";
      const location2 = isExternal ? toPath : joinURL((/* @__PURE__ */ useRuntimeConfig()).app.baseURL, fullPath);
      const redirect = async function(response) {
        await nuxtApp.callHook("app:redirected");
        const encodedLoc = location2.replace(URL_QUOTE_RE, "%22");
        const encodedHeader = encodeURL(location2, isExternalHost);
        nuxtApp.ssrContext._renderResponse = {
          statusCode: sanitizeStatusCode((options == null ? void 0 : options.redirectCode) || 302, 302),
          body: `<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0; url=${encodedLoc}"></head></html>`,
          headers: { location: encodedHeader }
        };
        return response;
      };
      if (!isExternal && inMiddleware) {
        router.afterEach((final) => final.fullPath === fullPath ? redirect(false) : void 0);
        return to;
      }
      return redirect(!inMiddleware ? void 0 : (
        /* abort route navigation */
        false
      ));
    }
  }
  if (isExternal) {
    nuxtApp._scope.stop();
    if (options == null ? void 0 : options.replace) {
      (void 0).replace(toPath);
    } else {
      (void 0).href = toPath;
    }
    if (inMiddleware) {
      if (!nuxtApp.isHydrating) {
        return false;
      }
      return new Promise(() => {
      });
    }
    return Promise.resolve();
  }
  return (options == null ? void 0 : options.replace) ? router.replace(to) : router.push(to);
};
function resolveRouteObject(to) {
  return withQuery(to.path || "", to.query || {}) + (to.hash || "");
}
function encodeURL(location2, isExternalHost = false) {
  const url = new URL(location2, "http://localhost");
  if (!isExternalHost) {
    return url.pathname + url.search + url.hash;
  }
  if (location2.startsWith("//")) {
    return url.toString().replace(url.protocol, "");
  }
  return url.toString();
}
const NUXT_ERROR_SIGNATURE = "__nuxt_error";
const useError = () => toRef(useNuxtApp().payload, "error");
const showError = (error) => {
  const nuxtError = createError(error);
  try {
    const nuxtApp = useNuxtApp();
    const error2 = useError();
    if (false) ;
    error2.value || (error2.value = nuxtError);
  } catch {
    throw nuxtError;
  }
  return nuxtError;
};
const isNuxtError = (error) => !!error && typeof error === "object" && NUXT_ERROR_SIGNATURE in error;
const createError = (error) => {
  const nuxtError = createError$1(error);
  Object.defineProperty(nuxtError, NUXT_ERROR_SIGNATURE, {
    value: true,
    configurable: false,
    writable: false
  });
  return nuxtError;
};
const unhead_k2P3m_ZDyjlr2mMYnoDPwavjsDN8hBlk9cFai0bbopU = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:head",
  enforce: "pre",
  setup(nuxtApp) {
    const head = nuxtApp.ssrContext.head;
    nuxtApp.vueApp.use(head);
  }
});
function toArray(value) {
  return Array.isArray(value) ? value : [value];
}
async function getRouteRules(arg) {
  const path = typeof arg === "string" ? arg : arg.path;
  {
    useNuxtApp().ssrContext._preloadManifest = true;
    const _routeRulesMatcher = toRouteMatcher(
      createRouter$1({ routes: (/* @__PURE__ */ useRuntimeConfig()).nitro.routeRules })
    );
    return defu({}, ..._routeRulesMatcher.matchAll(path).reverse());
  }
}
const __nuxt_page_meta$6 = { layout: "dashboard" };
const __nuxt_page_meta$5 = { layout: "dashboard" };
const __nuxt_page_meta$4 = { layout: "dashboard" };
const __nuxt_page_meta$3 = { layout: "dashboard" };
const __nuxt_page_meta$2 = { layout: "dashboard" };
const __nuxt_page_meta$1 = { layout: "dashboard" };
const component_45stubNxy__45o53_p7IoBWfrAtnn5HsDpTBF_O9z4N2cfahtbk = {};
const _routes = [
  {
    name: "home",
    path: "/home",
    meta: __nuxt_page_meta$6 || {},
    component: () => import('./home-BLbK9VH0.mjs')
  },
  {
    name: "test",
    path: "/test",
    component: () => import('./test-BYT4RpLx.mjs')
  },
  {
    name: "certs",
    path: "/certs",
    meta: __nuxt_page_meta$5 || {},
    component: () => import('./certs-BEuSU5Fs.mjs')
  },
  {
    name: "guide",
    path: "/guide",
    meta: __nuxt_page_meta$4 || {},
    component: () => import('./guide-dDqc1_7J.mjs')
  },
  {
    name: "login",
    path: "/login",
    component: () => import('./login-Fm0BNFJH.mjs')
  },
  {
    name: "sites",
    path: "/sites",
    meta: __nuxt_page_meta$3 || {},
    component: () => import('./sites-63td7vyy.mjs')
  },
  {
    name: "sample",
    path: "/sample",
    meta: __nuxt_page_meta$2 || {},
    component: () => import('./sample-25UpzAAj.mjs')
  },
  {
    name: "settings",
    path: "/settings",
    meta: __nuxt_page_meta$1 || {},
    component: () => import('./settings-CGNAIoYq.mjs')
  },
  {
    name: void 0 ,
    path: "/",
    component: component_45stubNxy__45o53_p7IoBWfrAtnn5HsDpTBF_O9z4N2cfahtbk
  }
];
const _wrapInTransition = (props, children) => {
  return { default: () => {
    var _a;
    return (_a = children.default) == null ? void 0 : _a.call(children);
  } };
};
const ROUTE_KEY_PARENTHESES_RE = /(:\w+)\([^)]+\)/g;
const ROUTE_KEY_SYMBOLS_RE = /(:\w+)[?+*]/g;
const ROUTE_KEY_NORMAL_RE = /:\w+/g;
function generateRouteKey(route) {
  const source = (route == null ? void 0 : route.meta.key) ?? route.path.replace(ROUTE_KEY_PARENTHESES_RE, "$1").replace(ROUTE_KEY_SYMBOLS_RE, "$1").replace(ROUTE_KEY_NORMAL_RE, (r) => {
    var _a;
    return ((_a = route.params[r.slice(1)]) == null ? void 0 : _a.toString()) || "";
  });
  return typeof source === "function" ? source(route) : source;
}
function isChangingPage(to, from) {
  if (to === from || from === START_LOCATION) {
    return false;
  }
  if (generateRouteKey(to) !== generateRouteKey(from)) {
    return true;
  }
  const areComponentsSame = to.matched.every(
    (comp, index) => {
      var _a, _b;
      return comp.components && comp.components.default === ((_b = (_a = from.matched[index]) == null ? void 0 : _a.components) == null ? void 0 : _b.default);
    }
  );
  if (areComponentsSame) {
    return false;
  }
  return true;
}
const routerOptions0 = {
  scrollBehavior(to, from, savedPosition) {
    var _a;
    const nuxtApp = useNuxtApp();
    const behavior = ((_a = useRouter().options) == null ? void 0 : _a.scrollBehaviorType) ?? "auto";
    if (to.path === from.path) {
      if (from.hash && !to.hash) {
        return { left: 0, top: 0 };
      }
      if (to.hash) {
        return { el: to.hash, top: _getHashElementScrollMarginTop(to.hash), behavior };
      }
      return false;
    }
    const routeAllowsScrollToTop = typeof to.meta.scrollToTop === "function" ? to.meta.scrollToTop(to, from) : to.meta.scrollToTop;
    if (routeAllowsScrollToTop === false) {
      return false;
    }
    let position = savedPosition || void 0;
    if (!position && isChangingPage(to, from)) {
      position = { left: 0, top: 0 };
    }
    const hookToWait = nuxtApp._runningTransition ? "page:transition:finish" : "page:loading:end";
    return new Promise((resolve) => {
      if (from === START_LOCATION) {
        resolve(_calculatePosition(to, "instant", position));
        return;
      }
      nuxtApp.hooks.hookOnce(hookToWait, () => {
        requestAnimationFrame(() => resolve(_calculatePosition(to, "instant", position)));
      });
    });
  }
};
function _getHashElementScrollMarginTop(selector) {
  try {
    const elem = (void 0).querySelector(selector);
    if (elem) {
      return (Number.parseFloat(getComputedStyle(elem).scrollMarginTop) || 0) + (Number.parseFloat(getComputedStyle((void 0).documentElement).scrollPaddingTop) || 0);
    }
  } catch {
  }
  return 0;
}
function _calculatePosition(to, scrollBehaviorType, position) {
  if (position) {
    return position;
  }
  if (to.hash) {
    return {
      el: to.hash,
      top: _getHashElementScrollMarginTop(to.hash),
      behavior: scrollBehaviorType
    };
  }
  return { left: 0, top: 0, behavior: scrollBehaviorType };
}
const configRouterOptions = {
  hashMode: false,
  scrollBehaviorType: "auto"
};
const routerOptions = {
  ...configRouterOptions,
  ...routerOptions0
};
const validate = /* @__PURE__ */ defineNuxtRouteMiddleware(async (to, from) => {
  var _a;
  let __temp, __restore;
  if (!((_a = to.meta) == null ? void 0 : _a.validate)) {
    return;
  }
  const result = ([__temp, __restore] = executeAsync(() => Promise.resolve(to.meta.validate(to))), __temp = await __temp, __restore(), __temp);
  if (result === true) {
    return;
  }
  const error = createError({
    fatal: false,
    statusCode: result && result.statusCode || 404,
    statusMessage: result && result.statusMessage || `Page Not Found: ${to.fullPath}`,
    data: {
      path: to.fullPath
    }
  });
  return error;
});
const auth_45global = /* @__PURE__ */ defineNuxtRouteMiddleware(async (to) => {
  return;
});
const manifest_45route_45rule = /* @__PURE__ */ defineNuxtRouteMiddleware(async (to) => {
  {
    return;
  }
});
const globalMiddleware = [
  validate,
  auth_45global,
  manifest_45route_45rule
];
const namedMiddleware = {};
const plugin = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:router",
  enforce: "pre",
  async setup(nuxtApp) {
    var _a, _b, _c;
    let __temp, __restore;
    let routerBase = (/* @__PURE__ */ useRuntimeConfig()).app.baseURL;
    const history = ((_a = routerOptions.history) == null ? void 0 : _a.call(routerOptions, routerBase)) ?? createMemoryHistory(routerBase);
    const routes = routerOptions.routes ? ([__temp, __restore] = executeAsync(() => routerOptions.routes(_routes)), __temp = await __temp, __restore(), __temp) ?? _routes : _routes;
    let startPosition;
    const router = createRouter({
      ...routerOptions,
      scrollBehavior: (to, from, savedPosition) => {
        if (from === START_LOCATION) {
          startPosition = savedPosition;
          return;
        }
        if (routerOptions.scrollBehavior) {
          router.options.scrollBehavior = routerOptions.scrollBehavior;
          if ("scrollRestoration" in (void 0).history) {
            const unsub = router.beforeEach(() => {
              unsub();
              (void 0).history.scrollRestoration = "manual";
            });
          }
          return routerOptions.scrollBehavior(to, START_LOCATION, startPosition || savedPosition);
        }
      },
      history,
      routes
    });
    nuxtApp.vueApp.use(router);
    const previousRoute = shallowRef(router.currentRoute.value);
    router.afterEach((_to, from) => {
      previousRoute.value = from;
    });
    Object.defineProperty(nuxtApp.vueApp.config.globalProperties, "previousRoute", {
      get: () => previousRoute.value
    });
    const initialURL = nuxtApp.ssrContext.url;
    const _route = shallowRef(router.currentRoute.value);
    const syncCurrentRoute = () => {
      _route.value = router.currentRoute.value;
    };
    nuxtApp.hook("page:finish", syncCurrentRoute);
    router.afterEach((to, from) => {
      var _a2, _b2, _c2, _d;
      if (((_b2 = (_a2 = to.matched[0]) == null ? void 0 : _a2.components) == null ? void 0 : _b2.default) === ((_d = (_c2 = from.matched[0]) == null ? void 0 : _c2.components) == null ? void 0 : _d.default)) {
        syncCurrentRoute();
      }
    });
    const route = {};
    for (const key in _route.value) {
      Object.defineProperty(route, key, {
        get: () => _route.value[key],
        enumerable: true
      });
    }
    nuxtApp._route = shallowReactive(route);
    nuxtApp._middleware || (nuxtApp._middleware = {
      global: [],
      named: {}
    });
    useError();
    if (!((_b = nuxtApp.ssrContext) == null ? void 0 : _b.islandContext)) {
      router.afterEach(async (to, _from, failure) => {
        delete nuxtApp._processingMiddleware;
        if (failure) {
          await nuxtApp.callHook("page:loading:end");
        }
        if ((failure == null ? void 0 : failure.type) === 4) {
          return;
        }
        if (to.redirectedFrom && to.fullPath !== initialURL) {
          await nuxtApp.runWithContext(() => navigateTo(to.fullPath || "/"));
        }
      });
    }
    try {
      if (true) {
        ;
        [__temp, __restore] = executeAsync(() => router.push(initialURL)), await __temp, __restore();
        ;
      }
      ;
      [__temp, __restore] = executeAsync(() => router.isReady()), await __temp, __restore();
      ;
    } catch (error2) {
      [__temp, __restore] = executeAsync(() => nuxtApp.runWithContext(() => showError(error2))), await __temp, __restore();
    }
    const resolvedInitialRoute = router.currentRoute.value;
    syncCurrentRoute();
    if ((_c = nuxtApp.ssrContext) == null ? void 0 : _c.islandContext) {
      return { provide: { router } };
    }
    const initialLayout = nuxtApp.payload.state._layout;
    router.beforeEach(async (to, from) => {
      var _a2, _b2;
      await nuxtApp.callHook("page:loading:start");
      to.meta = reactive(to.meta);
      if (nuxtApp.isHydrating && initialLayout && !isReadonly(to.meta.layout)) {
        to.meta.layout = initialLayout;
      }
      nuxtApp._processingMiddleware = true;
      if (!((_a2 = nuxtApp.ssrContext) == null ? void 0 : _a2.islandContext)) {
        const middlewareEntries = /* @__PURE__ */ new Set([...globalMiddleware, ...nuxtApp._middleware.global]);
        for (const component of to.matched) {
          const componentMiddleware = component.meta.middleware;
          if (!componentMiddleware) {
            continue;
          }
          for (const entry2 of toArray(componentMiddleware)) {
            middlewareEntries.add(entry2);
          }
        }
        {
          const routeRules = await nuxtApp.runWithContext(() => getRouteRules({ path: to.path }));
          if (routeRules.appMiddleware) {
            for (const key in routeRules.appMiddleware) {
              if (routeRules.appMiddleware[key]) {
                middlewareEntries.add(key);
              } else {
                middlewareEntries.delete(key);
              }
            }
          }
        }
        for (const entry2 of middlewareEntries) {
          const middleware = typeof entry2 === "string" ? nuxtApp._middleware.named[entry2] || await ((_b2 = namedMiddleware[entry2]) == null ? void 0 : _b2.call(namedMiddleware).then((r) => r.default || r)) : entry2;
          if (!middleware) {
            throw new Error(`Unknown route middleware: '${entry2}'.`);
          }
          try {
            const result = await nuxtApp.runWithContext(() => middleware(to, from));
            if (true) {
              if (result === false || result instanceof Error) {
                const error2 = result || createError({
                  statusCode: 404,
                  statusMessage: `Page Not Found: ${initialURL}`
                });
                await nuxtApp.runWithContext(() => showError(error2));
                return false;
              }
            }
            if (result === true) {
              continue;
            }
            if (result === false) {
              return result;
            }
            if (result) {
              if (isNuxtError(result) && result.fatal) {
                await nuxtApp.runWithContext(() => showError(result));
              }
              return result;
            }
          } catch (err) {
            const error2 = createError(err);
            if (error2.fatal) {
              await nuxtApp.runWithContext(() => showError(error2));
            }
            return error2;
          }
        }
      }
    });
    router.onError(async () => {
      delete nuxtApp._processingMiddleware;
      await nuxtApp.callHook("page:loading:end");
    });
    router.afterEach(async (to, _from) => {
      if (to.matched.length === 0) {
        await nuxtApp.runWithContext(() => showError(createError({
          statusCode: 404,
          fatal: false,
          statusMessage: `Page not found: ${to.fullPath}`,
          data: {
            path: to.fullPath
          }
        })));
      }
    });
    nuxtApp.hooks.hookOnce("app:created", async () => {
      try {
        if ("name" in resolvedInitialRoute) {
          resolvedInitialRoute.name = void 0;
        }
        await router.replace({
          ...resolvedInitialRoute,
          force: true
        });
        router.options.scrollBehavior = routerOptions.scrollBehavior;
      } catch (error2) {
        await nuxtApp.runWithContext(() => showError(error2));
      }
    });
    return { provide: { router } };
  }
});
function injectHead(nuxtApp) {
  var _a;
  const nuxt = nuxtApp || tryUseNuxtApp();
  return ((_a = nuxt == null ? void 0 : nuxt.ssrContext) == null ? void 0 : _a.head) || (nuxt == null ? void 0 : nuxt.runWithContext(() => {
    if (hasInjectionContext()) {
      return inject(headSymbol);
    }
  }));
}
function useHead(input, options = {}) {
  const head = injectHead(options.nuxt);
  if (head) {
    return useHead$1(input, { head, ...options });
  }
}
function definePayloadReducer(name, reduce) {
  {
    useNuxtApp().ssrContext._payloadReducers[name] = reduce;
  }
}
const reducers = [
  ["NuxtError", (data) => isNuxtError(data) && data.toJSON()],
  ["EmptyShallowRef", (data) => isRef(data) && isShallow(data) && !data.value && (typeof data.value === "bigint" ? "0n" : JSON.stringify(data.value) || "_")],
  ["EmptyRef", (data) => isRef(data) && !data.value && (typeof data.value === "bigint" ? "0n" : JSON.stringify(data.value) || "_")],
  ["ShallowRef", (data) => isRef(data) && isShallow(data) && data.value],
  ["ShallowReactive", (data) => isReactive(data) && isShallow(data) && toRaw(data)],
  ["Ref", (data) => isRef(data) && data.value],
  ["Reactive", (data) => isReactive(data) && toRaw(data)]
];
const revive_payload_server_MVtmlZaQpj6ApFmshWfUWl5PehCebzaBf2NuRMiIbms = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:revive-payload:server",
  setup() {
    for (const [reducer, fn] of reducers) {
      definePayloadReducer(reducer, fn);
    }
  }
});
const components_plugin_z4hgvsiddfKkfXTP6M8M4zG5Cb7sGnDhcryKVM45Di4 = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:global-components"
});
const preference = "system";
const useStateKeyPrefix = "$s";
function useState(...args) {
  const autoKey = typeof args[args.length - 1] === "string" ? args.pop() : void 0;
  if (typeof args[0] !== "string") {
    args.unshift(autoKey);
  }
  const [_key, init] = args;
  if (!_key || typeof _key !== "string") {
    throw new TypeError("[nuxt] [useState] key must be a string: " + _key);
  }
  if (init !== void 0 && typeof init !== "function") {
    throw new Error("[nuxt] [useState] init must be a function: " + init);
  }
  const key = useStateKeyPrefix + _key;
  const nuxtApp = useNuxtApp();
  const state = toRef(nuxtApp.payload.state, key);
  if (state.value === void 0 && init) {
    const initialValue = init();
    if (isRef(initialValue)) {
      nuxtApp.payload.state[key] = initialValue;
      return initialValue;
    }
    state.value = initialValue;
  }
  return state;
}
const plugin_server_9Ca9_HhnjAGwBWpwAydRauMHxWoxTDY60BrArRnXN_A = /* @__PURE__ */ defineNuxtPlugin((nuxtApp) => {
  var _a;
  const colorMode = ((_a = nuxtApp.ssrContext) == null ? void 0 : _a.islandContext) ? ref({}) : useState("color-mode", () => reactive({
    preference,
    value: preference,
    unknown: true,
    forced: false
  })).value;
  const htmlAttrs = {};
  {
    useHead({ htmlAttrs });
  }
  useRouter().afterEach((to) => {
    const forcedColorMode = to.meta.colorMode;
    if (forcedColorMode && forcedColorMode !== "system") {
      colorMode.value = htmlAttrs["data-color-mode-forced"] = forcedColorMode;
      colorMode.forced = true;
    } else if (forcedColorMode === "system") {
      console.warn("You cannot force the colorMode to system at the page level.");
    }
  });
  nuxtApp.provide("colorMode", colorMode);
});
const suppressSuspenseWarning_EU_q3KMvrHfhy8V4bupTsmoXXnjvEacXZJkKaFkWhzU = /* @__PURE__ */ defineNuxtPlugin(() => {
});
const plugins = [
  unhead_k2P3m_ZDyjlr2mMYnoDPwavjsDN8hBlk9cFai0bbopU,
  plugin,
  revive_payload_server_MVtmlZaQpj6ApFmshWfUWl5PehCebzaBf2NuRMiIbms,
  components_plugin_z4hgvsiddfKkfXTP6M8M4zG5Cb7sGnDhcryKVM45Di4,
  plugin_server_9Ca9_HhnjAGwBWpwAydRauMHxWoxTDY60BrArRnXN_A,
  suppressSuspenseWarning_EU_q3KMvrHfhy8V4bupTsmoXXnjvEacXZJkKaFkWhzU
];
const layouts = {
  dashboard: defineAsyncComponent(() => import('./dashboard-CgqOsVhw.mjs').then((m) => m.default || m)),
  default: defineAsyncComponent(() => import('./default-RXbZlcdK.mjs').then((m) => m.default || m))
};
const LayoutLoader = defineComponent({
  name: "LayoutLoader",
  inheritAttrs: false,
  props: {
    name: String,
    layoutProps: Object
  },
  setup(props, context) {
    return () => h(layouts[props.name], props.layoutProps, context.slots);
  }
});
const nuxtLayoutProps = {
  name: {
    type: [String, Boolean, Object],
    default: null
  },
  fallback: {
    type: [String, Object],
    default: null
  }
};
const __nuxt_component_0 = defineComponent({
  name: "NuxtLayout",
  inheritAttrs: false,
  props: nuxtLayoutProps,
  setup(props, context) {
    const nuxtApp = useNuxtApp();
    const injectedRoute = inject(PageRouteSymbol);
    const shouldUseEagerRoute = !injectedRoute || injectedRoute === useRoute();
    const route = shouldUseEagerRoute ? useRoute$1() : injectedRoute;
    const layout = computed(() => {
      let layout2 = unref(props.name) ?? (route == null ? void 0 : route.meta.layout) ?? "default";
      if (layout2 && !(layout2 in layouts)) {
        if (props.fallback) {
          layout2 = unref(props.fallback);
        }
      }
      return layout2;
    });
    const layoutRef = shallowRef();
    context.expose({ layoutRef });
    const done = nuxtApp.deferHydration();
    let lastLayout;
    return () => {
      const hasLayout = layout.value && layout.value in layouts;
      const transitionProps = (route == null ? void 0 : route.meta.layoutTransition) ?? appLayoutTransition;
      const previouslyRenderedLayout = lastLayout;
      lastLayout = layout.value;
      return _wrapInTransition(hasLayout && transitionProps, {
        default: () => h(Suspense, { suspensible: true, onResolve: () => {
          nextTick(done);
        } }, {
          default: () => h(
            LayoutProvider,
            {
              layoutProps: mergeProps(context.attrs, { ref: layoutRef }),
              key: layout.value || void 0,
              name: layout.value,
              shouldProvide: !props.name,
              isRenderingNewLayout: (name) => {
                return name !== previouslyRenderedLayout && name === layout.value;
              },
              hasTransition: !!transitionProps
            },
            context.slots
          )
        })
      }).default();
    };
  }
});
const LayoutProvider = defineComponent({
  name: "NuxtLayoutProvider",
  inheritAttrs: false,
  props: {
    name: {
      type: [String, Boolean]
    },
    layoutProps: {
      type: Object
    },
    hasTransition: {
      type: Boolean
    },
    shouldProvide: {
      type: Boolean
    },
    isRenderingNewLayout: {
      type: Function,
      required: true
    }
  },
  setup(props, context) {
    const name = props.name;
    if (props.shouldProvide) {
      provide(LayoutMetaSymbol, {
        isCurrent: (route) => name === (route.meta.layout ?? "default")
      });
    }
    const injectedRoute = inject(PageRouteSymbol);
    const isNotWithinNuxtPage = injectedRoute && injectedRoute === useRoute();
    if (isNotWithinNuxtPage) {
      const vueRouterRoute = useRoute$1();
      const reactiveChildRoute = {};
      for (const _key in vueRouterRoute) {
        const key = _key;
        Object.defineProperty(reactiveChildRoute, key, {
          enumerable: true,
          get: () => {
            return props.isRenderingNewLayout(props.name) ? vueRouterRoute[key] : injectedRoute[key];
          }
        });
      }
      provide(PageRouteSymbol, shallowReactive(reactiveChildRoute));
    }
    return () => {
      var _a, _b;
      if (!name || typeof name === "string" && !(name in layouts)) {
        return (_b = (_a = context.slots).default) == null ? void 0 : _b.call(_a);
      }
      return h(
        LayoutLoader,
        { key: name, layoutProps: props.layoutProps, name },
        context.slots
      );
    };
  }
});
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "Sonner",
  __ssrInlineRender: true,
  props: {
    invert: { type: Boolean },
    theme: {},
    position: {},
    hotkey: {},
    richColors: { type: Boolean },
    expand: { type: Boolean },
    duration: {},
    gap: {},
    visibleToasts: {},
    closeButton: { type: Boolean },
    toastOptions: {},
    class: {},
    style: {},
    offset: {},
    mobileOffset: {},
    dir: {},
    swipeDirections: {},
    icons: {},
    containerAriaLabel: {}
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(Toaster), mergeProps({ class: "toaster group" }, props, { "toast-options": {
        classes: {
          toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
        }
      } }, _attrs), null, _parent));
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/sonner/Sonner.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
function defaultEstimatedProgress(duration, elapsed) {
  const completionPercentage = elapsed / duration * 100;
  return 2 / Math.PI * 100 * Math.atan(completionPercentage / 50);
}
function createLoadingIndicator(opts = {}) {
  const { duration = 2e3, throttle = 200, hideDelay = 500, resetDelay = 400 } = opts;
  opts.estimatedProgress || defaultEstimatedProgress;
  const nuxtApp = useNuxtApp();
  const progress = shallowRef(0);
  const isLoading = shallowRef(false);
  const error = shallowRef(false);
  const start = (opts2 = {}) => {
    error.value = false;
    set(0, opts2);
  };
  function set(at = 0, opts2 = {}) {
    if (nuxtApp.isHydrating) {
      return;
    }
    if (at >= 100) {
      return finish({ force: opts2.force });
    }
    progress.value = at < 0 ? 0 : at;
    opts2.force ? 0 : throttle;
    {
      isLoading.value = true;
    }
  }
  function finish(opts2 = {}) {
    progress.value = 100;
    if (opts2.error) {
      error.value = true;
    }
    if (opts2.force) {
      progress.value = 0;
      isLoading.value = false;
    }
  }
  function clear() {
  }
  let _cleanup = () => {
  };
  return {
    _cleanup,
    progress: computed(() => progress.value),
    isLoading: computed(() => isLoading.value),
    error: computed(() => error.value),
    start,
    set,
    finish,
    clear
  };
}
function useLoadingIndicator(opts = {}) {
  const nuxtApp = useNuxtApp();
  const indicator = nuxtApp._loadingIndicator || (nuxtApp._loadingIndicator = createLoadingIndicator(opts));
  return indicator;
}
const __nuxt_component_2 = defineComponent({
  name: "NuxtLoadingIndicator",
  props: {
    throttle: {
      type: Number,
      default: 200
    },
    duration: {
      type: Number,
      default: 2e3
    },
    hideDelay: {
      type: Number,
      default: 500
    },
    resetDelay: {
      type: Number,
      default: 400
    },
    height: {
      type: Number,
      default: 3
    },
    color: {
      type: [String, Boolean],
      default: "repeating-linear-gradient(to right,#00dc82 0%,#34cdfe 50%,#0047e1 100%)"
    },
    errorColor: {
      type: String,
      default: "repeating-linear-gradient(to right,#f87171 0%,#ef4444 100%)"
    },
    estimatedProgress: {
      type: Function,
      required: false
    }
  },
  setup(props, { slots, expose }) {
    const { progress, isLoading, error, start, finish, clear } = useLoadingIndicator({
      duration: props.duration,
      throttle: props.throttle,
      hideDelay: props.hideDelay,
      resetDelay: props.resetDelay,
      estimatedProgress: props.estimatedProgress
    });
    expose({
      progress,
      isLoading,
      error,
      start,
      finish,
      clear
    });
    return () => h("div", {
      class: "nuxt-loading-indicator",
      style: {
        position: "fixed",
        top: 0,
        right: 0,
        left: 0,
        pointerEvents: "none",
        width: "auto",
        height: `${props.height}px`,
        opacity: isLoading.value ? 1 : 0,
        background: error.value ? props.errorColor : props.color || void 0,
        backgroundSize: `${100 / progress.value * 100}% auto`,
        transform: `scaleX(${progress.value}%)`,
        transformOrigin: "left",
        transition: "transform 0.1s, height 0.4s, opacity 0.4s",
        zIndex: 999999
      }
    }, slots);
  }
});
const defineRouteProvider = (name = "RouteProvider") => defineComponent({
  name,
  props: {
    route: {
      type: Object,
      required: true
    },
    vnode: Object,
    vnodeRef: Object,
    renderKey: String,
    trackRootNodes: Boolean
  },
  setup(props) {
    const previousKey = props.renderKey;
    const previousRoute = props.route;
    const route = {};
    for (const key in props.route) {
      Object.defineProperty(route, key, {
        get: () => previousKey === props.renderKey ? props.route[key] : previousRoute[key],
        enumerable: true
      });
    }
    provide(PageRouteSymbol, shallowReactive(route));
    return () => {
      if (!props.vnode) {
        return props.vnode;
      }
      return h(props.vnode, { ref: props.vnodeRef });
    };
  }
});
const RouteProvider = defineRouteProvider();
const __nuxt_component_3 = defineComponent({
  name: "NuxtPage",
  inheritAttrs: false,
  props: {
    name: {
      type: String
    },
    transition: {
      type: [Boolean, Object],
      default: void 0
    },
    keepalive: {
      type: [Boolean, Object],
      default: void 0
    },
    route: {
      type: Object
    },
    pageKey: {
      type: [Function, String],
      default: null
    }
  },
  setup(props, { attrs, slots, expose }) {
    const nuxtApp = useNuxtApp();
    const pageRef = ref();
    inject(PageRouteSymbol, null);
    expose({ pageRef });
    inject(LayoutMetaSymbol, null);
    nuxtApp.deferHydration();
    return () => {
      return h(RouterView, { name: props.name, route: props.route, ...attrs }, {
        default: (routeProps) => {
          return h(Suspense, { suspensible: true }, {
            default() {
              return h(RouteProvider, {
                vnode: slots.default ? normalizeSlot(slots.default, routeProps) : routeProps.Component,
                route: routeProps.route,
                vnodeRef: pageRef
              });
            }
          });
        }
      });
    };
  }
});
function normalizeSlot(slot, data) {
  const slotContent = slot(data);
  return slotContent.length === 1 ? h(slotContent[0]) : h(Fragment, void 0, slotContent);
}
const cfg0 = defineAppConfig({
  title: "VPS Panel",
  email: "dev@apii.in",
  description: "Urlly Link Shortener",
  icon: "/level-slider.svg",
  image: "https://images.unsplash.com/photo-1655196601100-8bfb26cf99e9?q=80&w=1200&h=630&fit=crop",
  slugRegex: /^[a-z0-9]+(?:-[a-z0-9]+)*$/i,
  reserveSlug: ["dashboard", "admin", "assets", "docs"]
});
const inlineConfig = {
  "nuxt": {}
};
const __appConfig = /* @__PURE__ */ defuFn(cfg0, inlineConfig);
function useAppConfig() {
  const nuxtApp = useNuxtApp();
  nuxtApp._appConfig || (nuxtApp._appConfig = klona(__appConfig));
  return nuxtApp._appConfig;
}
const _sfc_main$2 = {
  __name: "app",
  __ssrInlineRender: true,
  setup(__props) {
    const { title, description, icon } = useAppConfig();
    useHead({
      htmlAttrs: { lang: "en" },
      link: [{ rel: "icon", type: "image/svg+xml", href: icon }]
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLayout = __nuxt_component_0;
      const _component_Sonner = _sfc_main$3;
      const _component_NuxtLoadingIndicator = __nuxt_component_2;
      const _component_NuxtPage = __nuxt_component_3;
      _push(ssrRenderComponent(_component_NuxtLayout, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_Sonner, { position: "top-right" }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_NuxtLoadingIndicator, { color: "#000" }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_NuxtPage, null, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_Sonner, { position: "top-right" }),
              createVNode(_component_NuxtLoadingIndicator, { color: "#000" }),
              createVNode(_component_NuxtPage)
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
};
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("app.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const errorImage = '<svg class="animated" id="freepik_stories-oops-404-error-with-a-broken-robot" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:svgjs="http://svgjs.com/svgjs"><style>svg#freepik_stories-oops-404-error-with-a-broken-robot:not(.animated) .animable {opacity: 0;}svg#freepik_stories-oops-404-error-with-a-broken-robot.animated #freepik--background-complete--inject-18 {animation: 1s 1 forwards cubic-bezier(.36,-0.01,.5,1.38) slideDown;animation-delay: 0s;}svg#freepik_stories-oops-404-error-with-a-broken-robot.animated #freepik--Shadow--inject-18 {animation: 1s 1 forwards cubic-bezier(.36,-0.01,.5,1.38) slideUp;animation-delay: 0s;}svg#freepik_stories-oops-404-error-with-a-broken-robot.animated #freepik--oops--inject-18 {animation: 1s 1 forwards cubic-bezier(.36,-0.01,.5,1.38) zoomOut;animation-delay: 0s;}svg#freepik_stories-oops-404-error-with-a-broken-robot.animated #freepik--error-404--inject-18 {animation: 1s 1 forwards cubic-bezier(.36,-0.01,.5,1.38) zoomIn;animation-delay: 0s;}svg#freepik_stories-oops-404-error-with-a-broken-robot.animated #freepik--Character--inject-18 {animation: 1s 1 forwards cubic-bezier(.36,-0.01,.5,1.38) zoomIn;animation-delay: 0s;}svg#freepik_stories-oops-404-error-with-a-broken-robot.animated #freepik--robot-parts--inject-18 {animation: 1s 1 forwards cubic-bezier(.36,-0.01,.5,1.38) zoomOut;animation-delay: 0s;}            @keyframes slideDown {                0% {                    opacity: 0;                    transform: translateY(-30px);                }                100% {                    opacity: 1;                    transform: translateY(0);                }            }                    @keyframes slideUp {                0% {                    opacity: 0;                    transform: translateY(30px);                }                100% {                    opacity: 1;                    transform: inherit;                }            }                    @keyframes zoomOut {                0% {                    opacity: 0;                    transform: scale(1.5);                }                100% {                    opacity: 1;                    transform: scale(1);                }            }                    @keyframes zoomIn {                0% {                    opacity: 0;                    transform: scale(0.5);                }                100% {                    opacity: 1;                    transform: scale(1);                }            }        </style><g id="freepik--background-complete--inject-18" class="animable" style="transform-origin: 250px 226.87px;"><rect y="382.4" width="500" height="0.25" style="fill: rgb(235, 235, 235); transform-origin: 250px 382.525px;" id="eljpyofy0tm2d" class="animable"></rect><rect x="428.22" y="398.49" width="21.68" height="0.25" style="fill: rgb(235, 235, 235); transform-origin: 439.06px 398.615px;" id="elp6clp1c7k4q" class="animable"></rect><rect x="310.56" y="393.31" width="34.11" height="0.25" style="fill: rgb(235, 235, 235); transform-origin: 327.615px 393.435px;" id="elxfu0ucq96q" class="animable"></rect><rect x="396.59" y="389.21" width="44.53" height="0.25" style="fill: rgb(235, 235, 235); transform-origin: 418.855px 389.335px;" id="elalxtwq7yzx" class="animable"></rect><rect x="161.88" y="394.25" width="11.14" height="0.25" style="fill: rgb(235, 235, 235); transform-origin: 167.45px 394.375px;" id="ellmdlmjyyhbc" class="animable"></rect><rect x="114.58" y="394.25" width="38.39" height="0.25" style="fill: rgb(235, 235, 235); transform-origin: 133.775px 394.375px;" id="elph1hy2xnzm" class="animable"></rect><rect x="66.31" y="390.03" width="27.7" height="0.25" style="fill: rgb(235, 235, 235); transform-origin: 80.16px 390.155px;" id="elsfj1wh2p4z" class="animable"></rect><path d="M237,337.8H43.91a5.71,5.71,0,0,1-5.7-5.71V60.66A5.71,5.71,0,0,1,43.91,55H237a5.71,5.71,0,0,1,5.71,5.71V332.09A5.71,5.71,0,0,1,237,337.8ZM43.91,55.2a5.46,5.46,0,0,0-5.45,5.46V332.09a5.46,5.46,0,0,0,5.45,5.46H237a5.47,5.47,0,0,0,5.46-5.46V60.66A5.47,5.47,0,0,0,237,55.2Z" style="fill: rgb(235, 235, 235); transform-origin: 140.46px 196.4px;" id="eladi0ecvhgla" class="animable"></path><path d="M453.31,337.8H260.21a5.72,5.72,0,0,1-5.71-5.71V60.66A5.72,5.72,0,0,1,260.21,55h193.1A5.71,5.71,0,0,1,459,60.66V332.09A5.71,5.71,0,0,1,453.31,337.8ZM260.21,55.2a5.47,5.47,0,0,0-5.46,5.46V332.09a5.47,5.47,0,0,0,5.46,5.46h193.1a5.47,5.47,0,0,0,5.46-5.46V60.66a5.47,5.47,0,0,0-5.46-5.46Z" style="fill: rgb(235, 235, 235); transform-origin: 356.75px 196.4px;" id="elq5e5wne37c" class="animable"></path><path d="M216.07,200.88l.45-13.14-8.06-2.64a79.2,79.2,0,0,0-2.16-13.2l6.84-5-4.64-12.34-8.46.68a78.17,78.17,0,0,0-7-11.35l4.38-7.31-9-9.61-7.56,3.87A81.78,81.78,0,0,0,170,123l1.22-8.4-12-5.44-5.5,6.44a80.66,80.66,0,0,0-13-3l-2-8.23-13.18-.45-2.6,8.07a80.48,80.48,0,0,0-13.19,2.15l-5.08-6.8-12.34,4.61.68,8.46a80.13,80.13,0,0,0-11.35,7.07L74.3,123l-9.65,9,3.87,7.6a77.61,77.61,0,0,0-7.8,10.84l-8.39-1.26-5.48,12,6.48,5.49a78.54,78.54,0,0,0-3,13L42,181.76l-.45,13.14,8.1,2.64a77.4,77.4,0,0,0,2.15,13.19l-6.84,5,4.65,12.35,8.46-.68a77,77,0,0,0,7,11.35l-4.39,7.31,9,9.61,7.56-3.87a80.74,80.74,0,0,0,10.84,7.83l-1.26,8.39,12,5.45,5.53-6.44a81.73,81.73,0,0,0,13,3.05l2,8.23,13.18.45,2.6-8.07a81.5,81.5,0,0,0,13.2-2.15l5,6.8,12.34-4.61-.64-8.46a83.44,83.44,0,0,0,11.35-7.07l7.27,4.38,9.65-9-3.87-7.6a77.38,77.38,0,0,0,7.8-10.84l8.39,1.26,5.48-12-6.48-5.5a77.26,77.26,0,0,0,3.05-13Zm-88.79,42.57a52.16,52.16,0,1,1,53.89-50.33A52.15,52.15,0,0,1,127.28,243.45Z" style="fill: rgb(235, 235, 235); transform-origin: 129.035px 191.34px;" id="elzzt7xqex7ja" class="animable"></path><path d="M441,157.42l3.31-3.09L443,151.72a27.6,27.6,0,0,0,2.69-3.74l2.9.43,1.87-4.14-2.22-1.89a26.84,26.84,0,0,0,1.05-4.49l2.85-.71.14-4.54-2.78-.9a28.32,28.32,0,0,0-.74-4.56l2.35-1.75-1.6-4.25-2.91.23a28.25,28.25,0,0,0-2.43-3.92l1.51-2.5-3.11-3.32-2.6,1.33a28.24,28.24,0,0,0-3.74-2.69l.42-2.9-4.13-1.89-1.9,2.23a27.83,27.83,0,0,0-4.49-1l-.71-2.84-4.54-.17-.91,2.8a27,27,0,0,0-4.54.74l-1.74-2.35-4.26,1.59.24,2.92a26.58,26.58,0,0,0-3.92,2.43l-2.52-1.51-3.32,3.09L401.2,116a26.6,26.6,0,0,0-2.7,3.74l-2.89-.43-1.88,4.14,2.23,1.9a26.5,26.5,0,0,0-1,4.48l-2.86.71-.14,4.54,2.79.9a27.24,27.24,0,0,0,.73,4.56l-2.36,1.74,1.6,4.25,2.92-.22a28.25,28.25,0,0,0,2.43,3.92l-1.51,2.5,3.11,3.32,2.6-1.33a27.35,27.35,0,0,0,3.74,2.69l-.43,2.89,4.14,1.89,1.9-2.22a28.94,28.94,0,0,0,4.49,1l.71,2.84,4.54.17.91-2.8a26.86,26.86,0,0,0,4.54-.74l1.74,2.35,4.26-1.59-.23-2.92a26.69,26.69,0,0,0,3.91-2.43Zm-23.62-19.13a6.47,6.47,0,1,1,9.14.32A6.46,6.46,0,0,1,417.34,138.29Z" style="fill: rgb(235, 235, 235); transform-origin: 422.12px 133.86px;" id="elw423rqc10ef" class="animable"></path><path d="M320,292.34l-10.34-7.15v0a56.25,56.25,0,0,0-4.16-10.77l2.65-10.4-15-16.06-10.56,1.93A56.3,56.3,0,0,0,272.12,245h0l-6.42-10.81-22-.75-7.14,10.34h0a56.53,56.53,0,0,0-10.76,4.15l-10.4-2.65-16.06,15,1.93,10.54h0a56.23,56.23,0,0,0-4.88,10.49l-10.81,6.42-.75,22,10.35,7.14a54.75,54.75,0,0,0,4.15,10.82h0L196.65,338l15,16.06,10.49-1.92a57.19,57.19,0,0,0,10.54,4.9h0l6.41,10.79,22,.76,7.13-10.34a57.08,57.08,0,0,0,10.86-4.16h0l10.34,2.64,16.07-15-1.93-10.54a55.4,55.4,0,0,0,4.88-10.5h0l10.81-6.42Zm-68.45,33.39a24.71,24.71,0,1,1,25.54-23.86A24.74,24.74,0,0,1,251.54,325.73Z" style="fill: rgb(235, 235, 235); transform-origin: 252.415px 301.015px;" id="elxs24qd3p1g" class="animable"></path><path d="M343.55,230h-.07l-17.32-.59a2.08,2.08,0,0,1-1.74-1l-4.67-7.85a47.84,47.84,0,0,1-7.28-3.38L305,218.47a2.1,2.1,0,0,1-1.92-.64l-11.83-12.66a2.1,2.1,0,0,1-.5-2l1.89-7.41a45.45,45.45,0,0,1-2.86-7.47l-7.53-5.2a2.1,2.1,0,0,1-.91-1.81l.59-17.32a2.14,2.14,0,0,1,1-1.74l7.87-4.67a45.32,45.32,0,0,1,3.37-7.25l-1.38-7.53a2.11,2.11,0,0,1,.64-1.93l12.66-11.82a2.11,2.11,0,0,1,2-.51l7.44,1.9a45.83,45.83,0,0,1,7.45-2.87l5.2-7.53a2,2,0,0,1,1.81-.91l17.31.6a2.11,2.11,0,0,1,1.75,1l4.67,7.86a46.41,46.41,0,0,1,7.22,3.38l7.56-1.39a2.09,2.09,0,0,1,1.92.64l11.83,12.66a2.12,2.12,0,0,1,.5,2l-1.9,7.43a46.59,46.59,0,0,1,2.88,7.45l7.52,5.2a2.1,2.1,0,0,1,.91,1.81l-.59,17.31a2.16,2.16,0,0,1-1,1.75l-7.87,4.67a46.51,46.51,0,0,1-3.37,7.24l1.38,7.54a2.09,2.09,0,0,1-.64,1.92L367.33,220a2.1,2.1,0,0,1-2,.5l-7.4-1.89a47.49,47.49,0,0,1-7.49,2.87L345.29,229A2.13,2.13,0,0,1,343.55,230Zm-16.09-4.77,15,.51,5-7.19a2,2,0,0,1,1.19-.84,43.84,43.84,0,0,0,8.15-3.13h0a2.16,2.16,0,0,1,1.46-.15l7,1.79,11-10.25L375,198.74a2.09,2.09,0,0,1,.26-1.47,41.58,41.58,0,0,0,3.65-7.83,2.13,2.13,0,0,1,.94-1.18l7.53-4.46.51-15-7.2-5a2.11,2.11,0,0,1-.81-1.07c0-.05,0-.11,0-.17a43,43,0,0,0-3.12-8,2.11,2.11,0,0,1-.16-1.48l1.8-7.08-10.25-11-7.19,1.32a2.13,2.13,0,0,1-1.46-.26,42.3,42.3,0,0,0-7.84-3.67,2.28,2.28,0,0,1-.45-.2,2.1,2.1,0,0,1-.7-.72L346,123.92l-15-.52-5,7.21a2.16,2.16,0,0,1-1.24.85,42.63,42.63,0,0,0-8.06,3.11,2.08,2.08,0,0,1-1.47.16l-7.08-1.8-11,10.25,1.32,7.17a2.18,2.18,0,0,1-.19,1.33l-.1.17a41.56,41.56,0,0,0-3.65,7.86,2.12,2.12,0,0,1-.92,1.12l-7.53,4.47-.51,15,7.21,5a2.1,2.1,0,0,1,.84,1.18,41.52,41.52,0,0,0,3.11,8.12,2.54,2.54,0,0,1,.17.46,2.24,2.24,0,0,1,0,1l-1.8,7,10.25,11,7.14-1.31a2.1,2.1,0,0,1,1.45.26,43.26,43.26,0,0,0,7.89,3.67,2,2,0,0,1,1.17.93Zm24.78-94.81h0Zm-15.51,75.84c-.37,0-.74,0-1.11,0a31.53,31.53,0,1,1,1.11,0Zm0-59.09a27.55,27.55,0,1,0,.95,0Z" style="fill: rgb(235, 235, 235); transform-origin: 336.75px 174.548px;" id="el0eu53swwepzj" class="animable"></path><polygon points="383.44 105.32 376.26 103.4 374.34 96.22 377.15 93.42 380.11 99.55 386.25 102.52 383.44 105.32" style="fill: rgb(224, 224, 224); transform-origin: 380.295px 99.37px;" id="el3obizxp4jcb" class="animable"></polygon><path d="M383.88,100.52a3.34,3.34,0,1,0-4.73-4.73l3.57-5.36,4.78,2.42,1.05,5Z" style="fill: rgb(224, 224, 224); transform-origin: 383.85px 95.475px;" id="elsk5bfrxii89" class="animable"></path><path d="M376.58,94l5.26-5.26L389,90.65l1.93,7.17-5.26,5.26-7.17-1.93Zm9.55,4.3a3.35,3.35,0,1,0-4.74,0A3.37,3.37,0,0,0,386.13,98.28Z" style="fill: rgb(240, 240, 240); transform-origin: 383.755px 95.91px;" id="eljgeigxvraa" class="animable"></path><polygon points="90.22 296.71 94.07 295.67 95.1 291.82 93.6 290.32 92.01 293.61 88.71 295.2 90.22 296.71" style="fill: rgb(224, 224, 224); transform-origin: 91.905px 293.515px;" id="elm8pge2hzvbi" class="animable"></polygon><path d="M90,294.13a1.8,1.8,0,0,1,2.54-2.54l-1.91-2.87L88,290l-.56,2.7Z" style="fill: rgb(224, 224, 224); transform-origin: 89.99px 291.425px;" id="elac7hqntnql" class="animable"></path><path d="M93.9,290.62l-2.82-2.82-3.85,1-1,3.85L89,295.5l3.85-1Zm-5.12,2.31a1.8,1.8,0,1,1,2.54-2.54,1.8,1.8,0,0,1-2.54,2.54Z" style="fill: rgb(240, 240, 240); transform-origin: 90.065px 291.65px;" id="elx7kmndtiwh" class="animable"></path><path d="M76.36,85.66l3.2,3.2a2.14,2.14,0,0,0,3,0h0a2.15,2.15,0,0,0,0-3l-3.19-3.19a2.15,2.15,0,0,0-3,0h0A2.14,2.14,0,0,0,76.36,85.66Z" style="fill: rgb(240, 240, 240); transform-origin: 79.4629px 85.767px;" id="elvt10dj671ar" class="animable"></path><path d="M74.11,77.71a4.45,4.45,0,1,1-3,5.78A4.59,4.59,0,0,1,74.11,77.71Z" style="fill: rgb(224, 224, 224); transform-origin: 75.3218px 81.9973px;" id="el3h3pvuok8u" class="animable"></path><g id="elzcie9luuwi7"><rect x="74.93" y="76.84" width="1.37" height="10.1" style="fill: rgb(240, 240, 240); transform-origin: 75.615px 81.89px; transform: rotate(-109.76deg);" class="animable" id="eldkiwdr2v1k5"></rect></g></g><g id="freepik--Shadow--inject-18" class="animable" style="transform-origin: 250px 416.24px;"><ellipse id="freepik--path--inject-18" cx="250" cy="416.24" rx="193.89" ry="11.32" style="fill: rgb(245, 245, 245); transform-origin: 250px 416.24px;" class="animable"></ellipse></g><g id="freepik--oops--inject-18" class="animable" style="transform-origin: 144.13px 108.751px;"><path d="M86.72,120.65c-1-4.41-.56-8.11,1.34-11.13s5-5,9.41-6,8.22-.6,11.2,1.26,5,5,6,9.3a17.15,17.15,0,0,1,.17,8.12,11.64,11.64,0,0,1-3.53,5.76,15.53,15.53,0,0,1-7.12,3.38,17.65,17.65,0,0,1-7.88.27,11.72,11.72,0,0,1-5.9-3.5A15.67,15.67,0,0,1,86.72,120.65Zm8.34-1.86q.93,4.08,2.85,5.52a5.89,5.89,0,0,0,8.3-1.84c.72-1.39.73-3.6.05-6.61q-.87-3.81-2.81-5.22a5.36,5.36,0,0,0-4.56-.81,5.2,5.2,0,0,0-3.65,2.7C94.5,114,94.43,116,95.06,118.79Z" style="fill: rgb(38, 50, 56); transform-origin: 100.723px 117.459px;" id="eltpesfcikcf" class="animable"></path><path d="M118.59,117.35a10,10,0,0,1,1.35-8.06,11.56,11.56,0,0,1,7.49-4.75q5.87-1.33,9.64,1.39a10.9,10.9,0,0,1,2.64,14.27q-2.34,3.57-7.62,4.76a11.83,11.83,0,0,1-8.16-.66A9.85,9.85,0,0,1,118.59,117.35Zm7.51-1.73a6.08,6.08,0,0,0,1.93,3.63,3.58,3.58,0,0,0,5.33-1.19,6.33,6.33,0,0,0,.14-4.2,6,6,0,0,0-1.91-3.54,3.33,3.33,0,0,0-2.88-.65,3.49,3.49,0,0,0-2.42,1.87A6,6,0,0,0,126.1,115.62Z" style="fill: rgb(38, 50, 56); transform-origin: 129.779px 114.75px;" id="el5nc07vaauq" class="animable"></path><path d="M148.58,128.57l-6.13-27,7-1.6.66,2.89a9.5,9.5,0,0,1,2.11-3.07,7.85,7.85,0,0,1,3.43-1.69,7.21,7.21,0,0,1,6.74,1.62,12.81,12.81,0,0,1,3.83,6.93c.74,3.25.52,5.91-.64,8a7.87,7.87,0,0,1-5.33,3.91,8.57,8.57,0,0,1-3.29.13,7.76,7.76,0,0,1-2.94-1.17l2.12,9.33Zm3.61-18.86a5.29,5.29,0,0,0,1.76,3.22,3.19,3.19,0,0,0,2.72.56,2.82,2.82,0,0,0,2-1.57,6,6,0,0,0,0-3.86,5.61,5.61,0,0,0-1.71-3.28,2.91,2.91,0,0,0-2.5-.6,3.12,3.12,0,0,0-2.14,1.67A5.72,5.72,0,0,0,152.19,109.71Z" style="fill: rgb(38, 50, 56); transform-origin: 154.549px 113.209px;" id="elilk7ezetlad" class="animable"></path><path d="M169.43,110.3l7.28-2.39a3.75,3.75,0,0,0,1.72,1.6,4.69,4.69,0,0,0,4.53-1.1,1.49,1.49,0,0,0,.37-1.34A1.39,1.39,0,0,0,182.2,106a15.58,15.58,0,0,0-3.4,0,33.63,33.63,0,0,1-5.7,0,5.88,5.88,0,0,1-3-1.37,5.51,5.51,0,0,1-1.39-6.49,6.75,6.75,0,0,1,2.61-2.79,16.78,16.78,0,0,1,5.13-1.89,18.48,18.48,0,0,1,5.28-.64,6.91,6.91,0,0,1,3.16,1,8.86,8.86,0,0,1,2.54,2.62l-7,2.31a2.51,2.51,0,0,0-1.23-1.17,3.85,3.85,0,0,0-2.27-.1,3.08,3.08,0,0,0-1.75.87,1.35,1.35,0,0,0-.33,1.22,1.2,1.2,0,0,0,1,.92,12.36,12.36,0,0,0,3.36-.07,22.42,22.42,0,0,1,5.82-.08,6.29,6.29,0,0,1,3.28,1.51,5.46,5.46,0,0,1,1.66,2.85,6.18,6.18,0,0,1-.27,3.53,7.08,7.08,0,0,1-2.64,3.27,15.76,15.76,0,0,1-5.78,2.31q-5.35,1.22-8,.21A7.07,7.07,0,0,1,169.43,110.3Z" style="fill: rgb(38, 50, 56); transform-origin: 179.154px 103.646px;" id="elx70ifpr08x" class="animable"></path><path d="M193.85,85.57l8.21,0,0,6.3-1.51,12.67-5.08,0-1.62-12.65Zm.4,20.88,7.66,0,0,6.78-7.66,0Z" style="fill: rgb(38, 50, 56); transform-origin: 197.955px 99.4px;" id="elgkd0cagyasu" class="animable"></path></g><g id="freepik--error-404--inject-18" class="animable" style="transform-origin: 248.49px 190.421px;"><path d="M128.68,171.58l-.18,0c-4.5-1.75-7.19-3.45-8.59-5.5a5.14,5.14,0,0,1-3.23-.44,6.5,6.5,0,0,1-2.79-2.62,2.54,2.54,0,0,1-2.42.37,6.14,6.14,0,0,1-3-2.41,2.23,2.23,0,0,1-1.56.43c-3-.24-7-6.16-7.29-12.46a.52.52,0,0,1,.48-.53.5.5,0,0,1,.52.48c.28,6,4.11,11.33,6.38,11.51a1.26,1.26,0,0,0,.93-.27,12.28,12.28,0,0,1-1-9.42c.86-3,1.62-4.18,2.54-4,1.72.43,1.49,7,.58,11.29a6.14,6.14,0,0,1-.84,2.18,5.4,5.4,0,0,0,2.54,2.21,1.58,1.58,0,0,0,1.67-.35c-.78-1.93-1-4.57.12-7.93,1.4-4.43,2-4.55,2.31-4.63a.66.66,0,0,1,.64.22c.93,1.05-.18,7.93-1.34,11.33a5,5,0,0,1-.56,1.16,5.56,5.56,0,0,0,2.49,2.5,4.41,4.41,0,0,0,2.28.43c-.09-.19-.17-.38-.25-.58-.79-2.15-.4-4.62,1.19-7.58,1.05-1.95,1.91-2.87,2.71-2.87h0a1.11,1.11,0,0,1,1,.66c.87,1.61.24,6.92-1.48,9.56a4,4,0,0,1-1.62,1.4c1.34,1.76,3.89,3.31,8,4.89a.49.49,0,0,1,.29.64A.51.51,0,0,1,128.68,171.58ZM123,155.11s-.57,0-1.83,2.35c-1.45,2.68-1.82,4.89-1.13,6.75a5.06,5.06,0,0,0,.3.67,2.88,2.88,0,0,0,1.32-1.1c1.4-2.14,2.07-6.54,1.55-8.26C123.14,155.17,123,155.11,123,155.11Zm-7.18-4.21a23.33,23.33,0,0,0-1.34,3.53,11.38,11.38,0,0,0-.38,6.55l.09-.26A32.79,32.79,0,0,0,115.85,150.9Zm-6.58-3.15c-.17.15-.66.78-1.35,3.22a11.24,11.24,0,0,0,.72,8.24,6.18,6.18,0,0,0,.45-1.4C110.13,152.9,109.83,148.46,109.27,147.75Z" style="fill: rgb(38, 50, 56); transform-origin: 114.427px 159.142px;" id="eljwan8usnndr" class="animable"></path><path d="M166.7,224a9,9,0,0,1-4.56-1.19.51.51,0,0,1-.18-.69.49.49,0,0,1,.68-.17c3.57,2.09,8.18.63,9.13-.9a.88.88,0,0,0,.15-.67,8.12,8.12,0,0,1-5.13-1.46c-2.55-1.59-2.75-2.07-2.73-2.45a.61.61,0,0,1,.34-.52c1-.5,5.51,1.57,7.39,2.81a3.63,3.63,0,0,1,.62.52,3.55,3.55,0,0,0,1.9-1.14,2.87,2.87,0,0,0,.59-1.13l-.2,0c-1.6.16-3.2-.53-4.91-2.11-1.18-1.08-1.63-1.83-1.48-2.42a.9.9,0,0,1,.72-.65c1.38-.35,4.8,1.11,6.19,2.64a2.68,2.68,0,0,1,.64,1.18c1.31-.61,2.69-2,4.32-4.27a.5.5,0,0,1,.7-.12.51.51,0,0,1,.12.7c-1.89,2.64-3.47,4.14-5.05,4.75a3.69,3.69,0,0,1-.87,2,4.6,4.6,0,0,1-2.18,1.41,1.84,1.84,0,0,1-.28,1.39C171.78,222.94,169.36,224,166.7,224Zm-.89-6.94c.34.25.82.58,1.51,1a8,8,0,0,0,3.6,1.32A24.67,24.67,0,0,0,165.81,217.06Zm3.49-4.25a4.33,4.33,0,0,0,1.17,1.39c1.48,1.37,2.83,2,4.13,1.84l.32,0a1.81,1.81,0,0,0-.44-.83C173.08,213.63,170,212.65,169.3,212.81Z" style="fill: rgb(38, 50, 56); transform-origin: 171.491px 217.584px;" id="elrn50o4zb50a" class="animable"></path><path d="M179.94,222.63l-15.58,2.83-14.15-77.22-30.06,5.46-49,87,5.26,28.71L139.26,258l4.3,23.48L173.62,276l-4.3-23.48,15.58-2.83ZM101.09,237l26-45.57,7.25,39.54Z" style="fill: #263238; transform-origin: 128.025px 214.86px;" id="el0fbd8uutvfsf" class="animable"></path><path d="M305.43,143a58.84,58.84,0,0,0-3.2-14.22,46.31,46.31,0,0,0-7-12.19,40.37,40.37,0,0,0-12.7-10.36q-8-4.39-21.22-6.11-27.45-3.58-42.78,9.74t-20.2,51a139.33,139.33,0,0,0-1,28.34q1,13,4.78,20.93a43.74,43.74,0,0,0,14.65,17.78q9.47,6.65,26,8.79,29.38,3.83,43.57-11.29t18.8-51.1A129.48,129.48,0,0,0,305.43,143Z" style="fill: #263238; transform-origin: 251.628px 168.418px;" id="elhqrz9hzqp7" class="animable"></path><path d="M251.77,226.43c-2.41-.08-5-.3-7.61-.64-9.16-1.19-16.24-3.51-21.06-6.89a32.66,32.66,0,0,1-11-13.4l-.05-.11c-1.92-4-3.18-9.75-3.73-17a128.2,128.2,0,0,1,.92-26.1c3.57-27.72,10.94-39.29,16.49-44.11,6.48-5.62,15.23-8.16,26.73-7.76,2.36.08,4.86.29,7.43.62,7.38,1,13.23,2.6,17.37,4.86a29.79,29.79,0,0,1,9.31,7.49,35.25,35.25,0,0,1,5.35,9.27,47.78,47.78,0,0,1,2.56,11.55,118.67,118.67,0,0,1-.29,28.72c-2.77,21.54-8.13,36.68-15.92,45-5.78,6.16-14.45,9-26.51,8.54Z" style="fill: rgb(38, 50, 56); transform-origin: 251.624px 168.449px;" id="elk7ysvnojnie" class="animable"></path><path d="M271.34,143.29l.13-3.79-2.33-.76a22.82,22.82,0,0,0-.62-3.8l2-1.46-1.34-3.56-2.44.2a22.82,22.82,0,0,0-2-3.27l1.26-2.11-2.6-2.77-2.18,1.12a23.17,23.17,0,0,0-3.12-2.26l.35-2.42-3.46-1.57-1.58,1.86a23.26,23.26,0,0,0-3.75-.88l-.59-2.37-3.8-.13-.75,2.32a23.54,23.54,0,0,0-3.8.62l-1.47-2-3.56,1.33.2,2.44a22.94,22.94,0,0,0-3.27,2l-2.1-1.27-2.78,2.59,1.12,2.19a21.78,21.78,0,0,0-2.25,3.13l-2.42-.37-1.58,3.46,1.87,1.58a21.43,21.43,0,0,0-.88,3.76l-2.38.6-.13,3.78,2.33.76a22.6,22.6,0,0,0,.62,3.81l-2,1.45,1.34,3.56,2.44-.2a21.51,21.51,0,0,0,2,3.27l-1.27,2.11,2.6,2.77,2.18-1.11a23.1,23.1,0,0,0,3.12,2.25l-.36,2.42,3.46,1.57,1.59-1.85a23.12,23.12,0,0,0,3.76.87l.59,2.38,3.79.13.75-2.33a22.6,22.6,0,0,0,3.81-.62l1.45,2,3.56-1.33-.19-2.43a24.89,24.89,0,0,0,3.27-2l2.1,1.26,2.78-2.59-1.11-2.19a21.62,21.62,0,0,0,2.24-3.12l2.42.36,1.58-3.46-1.86-1.58a22.23,22.23,0,0,0,.87-3.75Zm-25.6,12.27a15,15,0,1,1,15.54-14.51A15,15,0,0,1,245.74,155.56Z" style="fill: #263238; transform-origin: 246.28px 140.495px;" id="elk7mvpcrxwl" class="animable"></path><g id="elt0h9pfvh079"><path d="M287.12,212.87l.28-2.56-1.54-.62a16,16,0,0,0-.22-2.6l1.39-.89-.71-2.47-1.66,0a14.82,14.82,0,0,0-1.19-2.31l.94-1.36-1.6-2-1.53.64a16.07,16.07,0,0,0-2-1.68l.37-1.62-2.25-1.24-1.18,1.19a15.87,15.87,0,0,0-2.48-.79l-.28-1.63-2.55-.29-.63,1.54a14.85,14.85,0,0,0-2.59.24l-.89-1.42-2.47.73v1.66a14.9,14.9,0,0,0-2.31,1.2l-1.36-1-2,1.6.64,1.53a16.13,16.13,0,0,0-1.67,2l-1.62-.36-1.23,2.25,1.18,1.17a15,15,0,0,0-.79,2.49l-1.64.27-.27,2.55,1.53.64a14.73,14.73,0,0,0,.23,2.58l-1.41.89.72,2.47H256a15.22,15.22,0,0,0,1.2,2.3l-1,1.36,1.6,2,1.55-.65a14.55,14.55,0,0,0,2,1.67L261,224l2.25,1.23,1.17-1.17a16.12,16.12,0,0,0,2.48.77l.29,1.64,2.55.28.62-1.53A16.22,16.22,0,0,0,273,225l.89,1.41,2.46-.72v-1.66a16.45,16.45,0,0,0,2.32-1.2l1.34,1,2-1.61-.65-1.53a16.28,16.28,0,0,0,1.69-2l1.61.36,1.24-2.25-1.18-1.16a16.47,16.47,0,0,0,.77-2.48Zm-12.87-1a4.46,4.46,0,1,1-1.77-6.05A4.47,4.47,0,0,1,274.25,211.87Z" style="fill: #263238; opacity: 0.3; transform-origin: 270.33px 209.695px;" class="animable" id="el4e3hx6ooap5"></path></g><path d="M301.29,169.65l-3-2.06h0a16.59,16.59,0,0,0-1.2-3.1l.76-3-4.32-4.63-3,.56a17,17,0,0,0-3-1.41h0l-1.85-3.12-6.33-.21-2.06,3h0a15.92,15.92,0,0,0-3.1,1.2l-3-.77-4.63,4.33.56,3h0a15.68,15.68,0,0,0-1.41,3l-3.11,1.85-.22,6.33,3,2.06a16.11,16.11,0,0,0,1.2,3.12h0l-.76,3,4.32,4.63,3-.55a17.16,17.16,0,0,0,3,1.41h0l1.84,3.11,6.34.22,2.05-3a16.61,16.61,0,0,0,3.13-1.2h0l3,.76,4.63-4.32-.55-3a16.7,16.7,0,0,0,1.41-3h0l3.11-1.85Zm-19.73,9.62a7.12,7.12,0,1,1,7.36-6.87A7.13,7.13,0,0,1,281.56,179.27Z" style="fill: rgb(255, 255, 255); transform-origin: 281.835px 172.15px;" id="el2xh0u7pv4xm" class="animable"></path><path d="M323,119.12l.52-1.25h0a6.7,6.7,0,0,0,1-.69l1.16,0,1.36-2-.44-1.07A6.18,6.18,0,0,0,327,113h0l1-.92-.42-2.35-1.26-.52h0a6.35,6.35,0,0,0-.69-1l0-1.16-1.95-1.36-1.08.45h0a5.55,5.55,0,0,0-1.22-.28l-.92-1-2.34.42-.53,1.26a6.5,6.5,0,0,0-1.05.68h0l-1.15,0-1.36,2,.44,1.07a6.18,6.18,0,0,0-.28,1.22h0l-1,.93.42,2.34,1.26.52a5.73,5.73,0,0,0,.68,1h0l0,1.15,2,1.36,1.07-.44a6.43,6.43,0,0,0,1.23.27h0l.92,1ZM318,112.64a2.68,2.68,0,1,1,3.11,2.16A2.69,2.69,0,0,1,318,112.64Z" style="fill: #263238; transform-origin: 320.595px 112.25px;" id="eloaysutj8sy" class="animable"></path><path d="M295.61,112.49l-.77-.65a19.9,19.9,0,0,1,6-5l.47.88A18.87,18.87,0,0,0,295.61,112.49Z" style="fill: #263238; transform-origin: 298.075px 109.665px;" id="elct7dc06sw2j" class="animable"></path><path d="M303.59,106.8l-.39-.92A23.92,23.92,0,0,1,314.94,104l-.1,1A22.79,22.79,0,0,0,303.59,106.8Z" style="fill: #263238; transform-origin: 309.07px 105.349px;" id="el05n6n54k8qpv" class="animable"></path><path d="M301.7,113.72l-.82-.56a16.74,16.74,0,0,1,9.87-6.39l.19,1A15.72,15.72,0,0,0,301.7,113.72Z" style="fill: #263238; transform-origin: 305.91px 110.245px;" id="ely1gfeyokr5a" class="animable"></path><path d="M235.34,210a.52.52,0,0,1-.36-.16l-2.09-2.16a17.49,17.49,0,0,1-3.15-.58l-3.27,1.44a.49.49,0,0,1-.47,0l-5.48-3.63a.49.49,0,0,1-.22-.43l0-3.56a17.2,17.2,0,0,1-1.76-2.68l-2.81-1.08a.5.5,0,0,1-.31-.37l-1.3-6.44a.5.5,0,0,1,.14-.46l2.16-2.09a18.78,18.78,0,0,1,.58-3.15l-1.44-3.27a.49.49,0,0,1,0-.47l3.63-5.48a.47.47,0,0,1,.43-.22l3.56.05a16.52,16.52,0,0,1,2.68-1.76l1.09-2.81a.49.49,0,0,1,.36-.31l6.44-1.3a.49.49,0,0,1,.46.14l2.09,2.16a17.76,17.76,0,0,1,3.16.58l3.26-1.44a.51.51,0,0,1,.48,0l5.47,3.63a.54.54,0,0,1,.23.43l-.06,3.56a17.26,17.26,0,0,1,1.77,2.68l2.8,1.09a.49.49,0,0,1,.31.36l1.31,6.44a.52.52,0,0,1-.14.46l-2.17,2.1a18,18,0,0,1-.58,3.14l1.44,3.27a.51.51,0,0,1,0,.48L250,203.59a.51.51,0,0,1-.42.22l-3.57-.05a18.38,18.38,0,0,1-2.67,1.76l-1.09,2.81a.49.49,0,0,1-.37.31L235.44,210ZM229.71,206a.36.36,0,0,1,.14,0,16.66,16.66,0,0,0,3.31.61.56.56,0,0,1,.32.15l2,2.1,5.9-1.19,1.06-2.74a.55.55,0,0,1,.24-.26,16.05,16.05,0,0,0,2.81-1.85.47.47,0,0,1,.33-.11l3.47.05,3.32-5-1.4-3.18a.5.5,0,0,1,0-.34,17.49,17.49,0,0,0,.61-3.31.51.51,0,0,1,.15-.32l2.1-2-1.19-5.9-2.73-1.06a.49.49,0,0,1-.27-.24,16.43,16.43,0,0,0-1.85-2.81.52.52,0,0,1-.11-.32l0-3.48-5-3.32-3.17,1.4a.52.52,0,0,1-.35,0,17,17,0,0,0-3.32-.61.56.56,0,0,1-.32-.15l-2-2.1-5.9,1.2L226.81,174a.51.51,0,0,1-.23.27,15.94,15.94,0,0,0-2.82,1.85.43.43,0,0,1-.32.11l-3.47-.05-3.33,5,1.4,3.18a.5.5,0,0,1,0,.43,17.13,17.13,0,0,0-.58,3.23.5.5,0,0,1-.15.32l-2.1,2,1.2,5.9,2.72,1.06a.55.55,0,0,1,.28.26,16.22,16.22,0,0,0,1.84,2.79.48.48,0,0,1,.11.32l0,3.48,5,3.32,3.18-1.4A.52.52,0,0,1,229.71,206Zm4.91-3.24a13.32,13.32,0,0,1-11.09-20.68h0a13.33,13.33,0,1,1,11.09,20.68Zm-10.25-20.13a12.32,12.32,0,1,0,17.08-3.46,12.27,12.27,0,0,0-17.08,3.46Z" style="fill: rgb(255, 255, 255); transform-origin: 234.574px 189.534px;" id="el8ufd0iga88" class="animable"></path><path d="M425.83,231.65l-15.7-2.12,10.38-77.81-30.28-4.08-73.45,67.62-3.86,28.93,63.29,8.54-3.16,23.67,30.28,4.08,3.16-23.66,15.7,2.12Zm-79.42-10.72,38.76-35.33-5.32,39.84Z" style="fill: #263238; transform-origin: 369.375px 214.06px;" id="elpvzsm3lh65a" class="animable"></path><path d="M394.13,279.74H394a.5.5,0,0,1-.4-.58L417,151.22a.51.51,0,0,1,.58-.4.5.5,0,0,1,.4.58L394.63,279.33A.51.51,0,0,1,394.13,279.74Z" style="fill: rgb(38, 50, 56); transform-origin: 405.79px 215.277px;" id="elgdicw587d15" class="animable"></path><path d="M414.83,153.37a.82.82,0,0,1-1.64-.06.82.82,0,0,1,1.64.06Z" style="fill: rgb(38, 50, 56); transform-origin: 414.01px 153.34px;" id="elhuisj5myukl" class="animable"></path><path d="M411.5,170.67a.82.82,0,1,1-.79-.85A.82.82,0,0,1,411.5,170.67Z" style="fill: rgb(38, 50, 56); transform-origin: 410.681px 170.639px;" id="eljb85qh7hum" class="animable"></path><path d="M408.17,188a.82.82,0,0,1-.85.79.81.81,0,0,1-.79-.84.82.82,0,0,1,.85-.8A.83.83,0,0,1,408.17,188Z" style="fill: rgb(38, 50, 56); transform-origin: 407.35px 187.97px;" id="elxyey1lcb61e" class="animable"></path><path d="M401.61,206a.82.82,0,0,1-1.63,0,.82.82,0,1,1,1.63,0Z" style="fill: rgb(38, 50, 56); transform-origin: 400.795px 205.91px;" id="el6bcb6f9bczm" class="animable"></path><path d="M401.5,222.57a.81.81,0,0,1-.85.79.82.82,0,1,1,.85-.79Z" style="fill: rgb(38, 50, 56); transform-origin: 400.681px 222.541px;" id="eln5mp8i3hdth" class="animable"></path><path d="M398.17,239.87a.82.82,0,1,1-.79-.84A.82.82,0,0,1,398.17,239.87Z" style="fill: rgb(38, 50, 56); transform-origin: 397.35px 239.849px;" id="elg1whj5grms" class="animable"></path><path d="M394.84,257.17a.83.83,0,0,1-.85.8.82.82,0,0,1-.79-.85.82.82,0,0,1,1.64.05Z" style="fill: rgb(38, 50, 56); transform-origin: 394.02px 257.147px;" id="el0qcrw07bvock" class="animable"></path><path d="M391.5,274.48a.82.82,0,1,1-.79-.85A.81.81,0,0,1,391.5,274.48Z" style="fill: rgb(38, 50, 56); transform-origin: 390.681px 274.449px;" id="eljoy5vxlm2q" class="animable"></path><path d="M400.79,206.45a.49.49,0,0,1-.48-.39.5.5,0,0,1,.38-.6l2.48-.53a.5.5,0,0,1,.6.39.5.5,0,0,1-.39.59l-2.48.53Z" style="fill: rgb(38, 50, 56); transform-origin: 402.039px 205.684px;" id="elapb86b6z7ba" class="animable"></path><path d="M409.08,197.24a85.06,85.06,0,0,0-3,9.36c-.75,3.53-.79,11.43-.79,11.43" style="fill: rgb(38, 50, 56); transform-origin: 407.185px 207.635px;" id="el99y4fxjvcg5" class="animable"></path><path d="M405.29,218.53h0a.52.52,0,0,1-.5-.51c0-.32.06-8,.81-11.52a84.22,84.22,0,0,1,3-9.44.5.5,0,1,1,.93.36,84.37,84.37,0,0,0-3,9.29c-.73,3.44-.78,11.24-.79,11.32A.5.5,0,0,1,405.29,218.53Z" style="fill: rgb(38, 50, 56); transform-origin: 407.184px 207.618px;" id="el0cyo5s23e9uj" class="animable"></path></g><g id="freepik--Character--inject-18" class="animable" style="transform-origin: 260.727px 336.436px;"><path d="M222.45,304.84c1.39-22.4-1.16-63.13,40.95-57.73,45.13,5.77,32.22,58.55,32.22,58.55Z" style="fill: rgb(38, 50, 56); transform-origin: 259.89px 276.141px;" id="elwi16ljx9gn" class="animable"></path><circle cx="251.51" cy="273" r="18.38" style="fill: rgb(255, 255, 255); transform-origin: 251.51px 273px;" id="elnw0u6hid5vk" class="animable"></circle><path d="M253.93,254.65c-8.71-1.48-18,4.93-18.93,11.43l34.51,3.18C268.29,261.85,260.83,255.83,253.93,254.65Z" style="fill: rgb(38, 50, 56); transform-origin: 252.255px 261.847px;" id="elzstq91frps" class="animable"></path><path d="M265.58,272.54c-.25,4.81-2.87,8.58-5.85,8.42s-5.2-4.17-5-9,2.87-8.58,5.85-8.42S265.82,267.74,265.58,272.54Z" style="fill: rgb(38, 50, 56); transform-origin: 260.157px 272.25px;" id="els5816j7j3ls" class="animable"></path><path d="M251.51,292.38A19.38,19.38,0,1,1,270.89,273,19.4,19.4,0,0,1,251.51,292.38Zm0-36.75A17.38,17.38,0,1,0,268.89,273,17.39,17.39,0,0,0,251.51,255.63Z" style="fill: #263238; transform-origin: 251.51px 273px;" id="elgx0k9z7rm1d" class="animable"></path><g id="elelxsjq3q9q"><path d="M290.49,304.28l-.12,0a.49.49,0,0,1-.37-.6c0-.13,3.22-13.69-.09-27.4a.5.5,0,1,1,1-.24c3.37,14,.12,27.74.09,27.87A.5.5,0,0,1,290.49,304.28Z" style="fill: rgb(255, 255, 255); opacity: 0.3; transform-origin: 291.167px 289.962px;" class="animable" id="elyfgu2o0vrb"></path></g><g id="eluosiuf3lo0h"><path d="M287.7,268.76a.52.52,0,0,1-.46-.29,34.93,34.93,0,0,0-4.74-7.66.5.5,0,0,1,.07-.7.5.5,0,0,1,.71.07,36.47,36.47,0,0,1,4.87,7.87.49.49,0,0,1-.24.66A.54.54,0,0,1,287.7,268.76Z" style="fill: rgb(255, 255, 255); opacity: 0.3; transform-origin: 285.294px 264.377px;" class="animable" id="elgpeh0bvnysp"></path></g><path d="M128.73,409.92h-.37a5,5,0,1,1,.28-10h.09c2.89,0,9.84-3.51,24.38-26.43a5,5,0,0,1,7.51-1.09,207.46,207.46,0,0,0,37.14,25.48,5,5,0,1,1-4.52,8.91,212.75,212.75,0,0,1-34.8-23.14C146.25,402,137.21,409.92,128.73,409.92Z" style="fill: rgb(38, 50, 56); transform-origin: 162.09px 390.544px;" id="elpu0jfw67kv" class="animable"></path><path d="M159.67,371.5l-.43,0a3,3,0,0,1-2.54-3.39c.71-5-.17-23.63-6.48-38.13a3,3,0,0,1,1.06-3.68c13.7-9.33,42.88-10.45,44.12-10.49a3,3,0,1,1,.2,6c-.27,0-25.78,1-38.88,8.2,5.58,14.44,6.85,32.43,5.92,38.94A3,3,0,0,1,159.67,371.5Z" style="fill: rgb(38, 50, 56); transform-origin: 174.235px 343.654px;" id="el3xe1rlk13ti" class="animable"></path><path d="M164.71,367.62c-2-4.71-11-4.18-16.27-.14-2.82,2.15-6.64,8.64-7,11a3.54,3.54,0,0,0,4,4.24c3.45-.3,8.18-5.31,8.18-5.31-3.15,3.09.92,5.27,7,.8C163.94,375.72,166.94,372.89,164.71,367.62Z" style="fill: #263238; transform-origin: 153.421px 373.514px;" id="elduflj9kg3in" class="animable"></path><path d="M336.71,306.16a.32.32,0,0,1-.14,0,.49.49,0,0,1-.34-.62c1.33-4.64,2.78-7.47,4.69-9a5.18,5.18,0,0,1,.16-3.26,6.45,6.45,0,0,1,2.36-3,2.54,2.54,0,0,1-.59-2.38,6.18,6.18,0,0,1,2.14-3.16,2.24,2.24,0,0,1-.57-1.51c0-3,5.51-7.52,11.76-8.38a.5.5,0,0,1,.14,1c-5.94.81-10.92,5.11-10.9,7.38a1.31,1.31,0,0,0,.36.91,12.24,12.24,0,0,1,9.28-1.87c3.07.59,4.32,1.24,4.18,2.17-.28,1.75-6.81,2.12-11.19,1.6a6.18,6.18,0,0,1-2.25-.65,5.38,5.38,0,0,0-2,2.73,1.57,1.57,0,0,0,.49,1.64c1.86-1,4.47-1.36,7.92-.6,4.53,1,4.7,1.55,4.81,1.88a.67.67,0,0,1-.17.67c-.95,1-7.9.53-11.39-.33a4.91,4.91,0,0,1-1.21-.45,5.45,5.45,0,0,0-2.26,2.71,4.23,4.23,0,0,0-.23,2.3,5.77,5.77,0,0,1,.55-.29c2.07-1,4.57-.82,7.66.5,2,.87,3,1.65,3.1,2.44a1.12,1.12,0,0,1-.57,1c-1.53,1-6.87.86-9.65-.62a4,4,0,0,1-1.54-1.49c-1.63,1.5-2.95,4.17-4.15,8.36A.51.51,0,0,1,336.71,306.16Zm5.42-9.33a3,3,0,0,0,1.22,1.22c2.26,1.2,6.7,1.47,8.36.8.34-.14.39-.25.39-.25s-.05-.56-2.5-1.61c-2.8-1.2-5-1.37-6.83-.52A5.79,5.79,0,0,0,342.13,296.83Zm3.34-6.57.25.07a33.09,33.09,0,0,0,9.94.75,21.7,21.7,0,0,0-3.64-1A11.38,11.38,0,0,0,345.47,290.26Zm1.26-5.62a5.92,5.92,0,0,0,1.43.32c5,.59,9.39-.1,10-.73-.17-.15-.84-.58-3.32-1.05A11.25,11.25,0,0,0,346.73,284.64Z" style="fill: rgb(38, 50, 56); transform-origin: 347.729px 290.507px;" id="elq2mxzepw7ns" class="animable"></path><path d="M206.53,408.25c.66-.21.44-.85-.3-.85H192.69c-25.78-2.73-43.79.93-32.44,1.79s-.8.68-9.09,3.82,61.65,3.93,68,0C225,409.39,197.39,411.18,206.53,408.25Z" style="fill: rgb(38, 50, 56); transform-origin: 185.229px 411.037px;" id="elp1mktdnegf" class="animable"></path><polygon points="303.47 412.24 185.67 408.33 180.78 294.11 319.89 297.22 303.47 412.24" style="fill: #263238; transform-origin: 250.335px 353.175px;" id="elgixcips3mn" class="animable"></polygon><path d="M222.45,410.05a.5.5,0,0,1-.5-.46l-9.44-114.72a.51.51,0,0,1,.46-.54.52.52,0,0,1,.54.46L223,409.51a.5.5,0,0,1-.46.54Z" style="fill: rgb(38, 50, 56); transform-origin: 217.755px 352.19px;" id="elv8wgpyctv" class="animable"></path><polygon points="303.47 412.24 335.13 407.42 345.1 301.21 319.89 297.22 303.47 412.24" style="fill: #263238; transform-origin: 324.285px 354.73px;" id="eld4xsatg2jwf" class="animable"></polygon><g id="ellq124tzk7cf"><polygon points="303.47 412.24 335.13 407.42 345.1 301.21 319.89 297.22 303.47 412.24" style="opacity: 0.2; transform-origin: 324.285px 354.73px;" class="animable" id="el06bixvasfw8o"></polygon></g><path d="M195.73,386.32l-2.9-67.87a12.27,12.27,0,0,1,12.53-12.79l88.06,2a12.27,12.27,0,0,1,11.87,14L295.53,390A12.27,12.27,0,0,1,283,400.55l-75.39-2.5A12.27,12.27,0,0,1,195.73,386.32Z" style="fill: rgb(38, 50, 56); transform-origin: 249.116px 353.106px;" id="eluw0up5yn46c" class="animable"></path><path d="M205.25,326.49l13.62.43-.11,3.51-8.53-.27-.08,2.62,7.91.25-.11,3.36-7.91-.26-.1,3.25,8.77.28-.12,3.72-13.87-.44Z" style="fill: rgb(255, 255, 255); transform-origin: 211.795px 334.935px;" id="elspzkiqolqt" class="animable"></path><path d="M221.4,343.47l.52-16.45,8.48.27a12.22,12.22,0,0,1,3.59.52,3.81,3.81,0,0,1,2,1.56,4.64,4.64,0,0,1-1.64,6.59,6.16,6.16,0,0,1-1.81.6,5.12,5.12,0,0,1,1.31.64,5.51,5.51,0,0,1,.78.9,6.43,6.43,0,0,1,.68,1l2.31,4.85-5.74-.19-2.56-5.11a3.94,3.94,0,0,0-.88-1.3,2.22,2.22,0,0,0-1.23-.42h-.45l-.21,6.67Zm5.42-9.62,2.14.07a8.63,8.63,0,0,0,1.35-.19,1.35,1.35,0,0,0,.85-.49,1.57,1.57,0,0,0,.35-.94,1.54,1.54,0,0,0-.47-1.24,3.1,3.1,0,0,0-1.88-.49l-2.24-.07Z" style="fill: rgb(255, 255, 255); transform-origin: 229.51px 335.485px;" id="eld9d51a8ko9" class="animable"></path><path d="M239.28,344l.52-16.45,8.47.27a12.16,12.16,0,0,1,3.59.52,3.77,3.77,0,0,1,2,1.56,4.45,4.45,0,0,1,.68,2.69,4.42,4.42,0,0,1-2.31,3.9,6.27,6.27,0,0,1-1.81.6,5,5,0,0,1,1.3.64,4.84,4.84,0,0,1,.79.89,6.87,6.87,0,0,1,.68,1l2.31,4.84-5.74-.18-2.56-5.11a4,4,0,0,0-.88-1.3,2.08,2.08,0,0,0-1.24-.42l-.44,0-.22,6.68Zm5.41-9.62,2.15.06a7.21,7.21,0,0,0,1.35-.18,1.31,1.31,0,0,0,.84-.49,1.46,1.46,0,0,0,.35-.94,1.52,1.52,0,0,0-.46-1.24,3,3,0,0,0-1.89-.49l-2.23-.07Z" style="fill: rgb(255, 255, 255); transform-origin: 247.39px 336.005px;" id="el68inxlxqdj" class="animable"></path><path d="M256.32,336.36a7.79,7.79,0,0,1,8.76-8.25,8.6,8.6,0,0,1,6.26,2.41,8.32,8.32,0,0,1,2,6.25,10.21,10.21,0,0,1-1.12,4.7,7,7,0,0,1-2.9,2.78,9.22,9.22,0,0,1-4.61.88,10.58,10.58,0,0,1-4.58-1,7,7,0,0,1-2.86-2.9A9.21,9.21,0,0,1,256.32,336.36Zm5.08.18a5.56,5.56,0,0,0,.81,3.61,3.52,3.52,0,0,0,5.06.19,6.13,6.13,0,0,0,1-3.8,5.17,5.17,0,0,0-.83-3.43A3.22,3.22,0,0,0,265,332a3.1,3.1,0,0,0-2.51,1A5.56,5.56,0,0,0,261.4,336.54Z" style="fill: rgb(255, 255, 255); transform-origin: 264.834px 336.599px;" id="eln9t4tg03kf" class="animable"></path><path d="M275.91,345.21l.52-16.46,8.47.27a12.51,12.51,0,0,1,3.59.52,3.87,3.87,0,0,1,2,1.56,4.49,4.49,0,0,1,.68,2.69,4.42,4.42,0,0,1-2.31,3.91,6.61,6.61,0,0,1-1.81.59,5,5,0,0,1,1.3.65,4.84,4.84,0,0,1,.79.89,6.43,6.43,0,0,1,.68,1l2.31,4.85-5.74-.18-2.56-5.12a3.91,3.91,0,0,0-.88-1.29,2.16,2.16,0,0,0-1.24-.43h-.44l-.22,6.68Zm5.41-9.63,2.15.07a7.21,7.21,0,0,0,1.35-.18,1.35,1.35,0,0,0,.84-.49,1.48,1.48,0,0,0,.35-1,1.5,1.5,0,0,0-.46-1.23,3,3,0,0,0-1.89-.49l-2.23-.07Z" style="fill: rgb(255, 255, 255); transform-origin: 284.02px 337.215px;" id="elwjzzmqp3de" class="animable"></path><path d="M284,373.16a1.32,1.32,0,0,1-1-.43l-8.56-9.37-9.24,8.44a1.31,1.31,0,0,1-1.85-.08l-8.56-9.37-9.24,8.44a1.31,1.31,0,0,1-1.85-.08l-8.57-9.37-9.23,8.44a1.33,1.33,0,0,1-1,.34,1.35,1.35,0,0,1-.91-.43l-8.56-9.36-9.23,8.43a1.32,1.32,0,0,1-1.86-.08,1.3,1.3,0,0,1,.09-1.85l10.2-9.33a1.32,1.32,0,0,1,1.86.08l8.56,9.37,9.23-8.44a1.37,1.37,0,0,1,.95-.34,1.33,1.33,0,0,1,.91.43l8.56,9.37,9.24-8.44a1.3,1.3,0,0,1,1.85.08l8.56,9.37,9.24-8.44a1.31,1.31,0,0,1,1.85.08L285,371a1.32,1.32,0,0,1-1,2.2Z" style="fill: rgb(255, 255, 255); transform-origin: 244.666px 365.178px;" id="el4ee273lv3ee" class="animable"></path><polygon points="125.75 414.67 119.49 411.68 113.91 384.51 116.94 381.18 125.75 414.67" style="fill: #263238; transform-origin: 119.83px 397.925px;" id="elzd0s7qmtpj" class="animable"></polygon><polygon points="125.75 414.67 134.06 409.81 126.94 387.43 116.94 381.18 125.75 414.67" style="fill: #263238; transform-origin: 125.5px 397.925px;" id="elw989lq09g5d" class="animable"></polygon><g id="el3au9pxmmth1"><polygon points="125.75 414.67 134.06 409.81 126.94 387.43 116.94 381.18 125.75 414.67" style="opacity: 0.2; transform-origin: 125.5px 397.925px;" class="animable" id="el05dbcbjdaf6s"></polygon></g><path d="M262,419.61h-.69a5,5,0,0,1,.27-10c7.7.25,24-4.48,33.32-13.52a5,5,0,0,1,2-1.2c15.79-4.74,21.66,4.83,21.9,5.24l-8.6,5.09a1,1,0,0,0,.11.18c-.09-.13-2.33-3-9.45-1.24C289.17,414.82,271.23,419.61,262,419.61Z" style="fill: rgb(38, 50, 56); transform-origin: 287.627px 406.593px;" id="el0pph656o5kx" class="animable"></path><polygon points="261.39 426.25 243.18 425.11 241.75 391.53 266.22 392.44 261.39 426.25" style="fill: #263238; transform-origin: 253.985px 408.89px;" id="el7t6hfsdifu6" class="animable"></polygon><polygon points="261.39 426.25 265.65 422.01 268.29 401.08 266.22 392.44 261.39 426.25" style="fill: #263238; transform-origin: 264.84px 409.345px;" id="elxfbu440eqf" class="animable"></polygon><g id="elsevf6aous3"><polygon points="261.39 426.25 265.65 422.01 268.29 401.08 266.22 392.44 261.39 426.25" style="opacity: 0.2; transform-origin: 264.84px 409.345px;" class="animable" id="elmqwh504tx6c"></polygon></g><path d="M366.91,413.54a3,3,0,0,1-1.81-.61c-10.4-7.9-24.45-21.93-29.84-35.46a2.64,2.64,0,0,1-.17-.61c-2.63-15.64-5.14-48.55-5.25-49.94a3,3,0,1,1,6-.45c0,.33,2.57,33.56,5.13,49.07,5.38,13.16,20,26.67,27.78,32.61a3,3,0,0,1-1.82,5.39Z" style="fill: rgb(38, 50, 56); transform-origin: 349.884px 368.613px;" id="el1i9xkl23i38" class="animable"></path><path d="M380.78,415.05c-2.32,0-4.95-1.05-7.82-3.12a3,3,0,0,1,3.52-4.86c2.48,1.79,3.83,2,4.3,2a3,3,0,0,1,0,6Z" style="fill: rgb(38, 50, 56); transform-origin: 377.75px 410.785px;" id="el13tsdf0t91g" class="animable"></path><path d="M373.8,411.84c3.21-9.53,16.37-7.65,20.91-6.23a47.77,47.77,0,0,1,11.07,4.8c2.45,1.6,2.49,4.29-.78,5.82-4,1.88-14.16.21-14.16.21,5.24,2.29,0,6-9.21,2.36C378.64,417.62,372.67,415.34,373.8,411.84Z" style="fill: #263238; transform-origin: 390.602px 412.385px;" id="elcd6m7ib8jjn" class="animable"></path><path d="M341.86,331c-1.19,8.1-7.9,14.07-13.36,13.27s-5.68-8-4.49-16.14,3.35-14,8.81-13.2S343.05,322.93,341.86,331Z" style="fill: rgb(38, 50, 56); transform-origin: 332.733px 329.599px;" id="elrs1tiowa8qe" class="animable"></path><circle cx="209.88" cy="297.88" r="0.82" style="fill: rgb(38, 50, 56); transform-origin: 209.88px 297.88px;" id="el5xxpnskdcm5" class="animable"></circle><path d="M218.21,303.78a.82.82,0,1,1-.82-.82A.82.82,0,0,1,218.21,303.78Z" style="fill: rgb(38, 50, 56); transform-origin: 217.39px 303.78px;" id="elexmfkahnvo" class="animable"></path><path d="M219.13,400.68a.82.82,0,1,1-.82-.82A.82.82,0,0,1,219.13,400.68Z" style="fill: rgb(38, 50, 56); transform-origin: 218.31px 400.68px;" id="elga1t34aahqp" class="animable"></path><path d="M226.64,406.59a.82.82,0,1,1-.82-.82A.82.82,0,0,1,226.64,406.59Z" style="fill: rgb(38, 50, 56); transform-origin: 225.82px 406.59px;" id="elrsqush3p02" class="animable"></path></g><g id="freepik--robot-parts--inject-18" class="animable" style="transform-origin: 250.343px 414.689px;"><path d="M82.51,416.42a9.62,9.62,0,0,1-7.33-3.95.5.5,0,1,1,.82-.57c1.87,2.7,6,4.13,7.8,3.28a1.3,1.3,0,0,0,.47-.34,6.05,6.05,0,0,1-3.52-4.48c-.23-1.27-.41-3,.63-3.22,1.44-.32,3.32,3.15,4,5.78a3.78,3.78,0,0,1,.13,1.34,4.26,4.26,0,0,0,1.78.14,1.94,1.94,0,0,0,1.38-.74,5.86,5.86,0,0,1-2.31-4.19c-.38-2.74-.09-3.21.21-3.45a.66.66,0,0,1,.69-.07c1.07.45,2.36,4.33,2.61,6.53a2.66,2.66,0,0,1,0,.69,3.91,3.91,0,0,0,1.35.26,4.29,4.29,0,0,0,2.41-.63c-.14-.09-.27-.19-.4-.29-1-.89-1.46-2.31-1.28-4.33.14-1.57.49-2.43,1.12-2.7a1.13,1.13,0,0,1,1.21.24,6.92,6.92,0,0,1,1.73,5.56,3,3,0,0,1-.51,1.15c1.84.32,4.42-.2,6.65-.75a.5.5,0,0,1,.24,1c-2.71.67-5.63,1.22-7.69.62a5.69,5.69,0,0,1-3.5,1.16,4.83,4.83,0,0,1-1.64-.31,2.8,2.8,0,0,1-2.12,1.27,5.33,5.33,0,0,1-2.24-.19,2.21,2.21,0,0,1-1,.89A4.16,4.16,0,0,1,82.51,416.42Zm-.86-8.28a4.32,4.32,0,0,0,.08,2.05,5.05,5.05,0,0,0,2.84,3.7,3.21,3.21,0,0,0-.12-.7C83.67,410.33,82.17,408.36,81.65,408.14Zm5.57-.87a14.19,14.19,0,0,0,.17,2.06,5.18,5.18,0,0,0,1.52,3.22A15.72,15.72,0,0,0,87.22,407.27Zm6.29-.87h0s-.38.19-.52,1.86.15,2.82.93,3.49a3.06,3.06,0,0,0,.6.38,2.24,2.24,0,0,0,.54-1,6.26,6.26,0,0,0-1.19-4.43C93.66,406.44,93.54,406.4,93.51,406.4Z" style="fill: rgb(38, 50, 56); transform-origin: 88.9288px 410.91px;" id="el3lgcd3tcil7" class="animable"></path><polygon points="228.87 423.98 231.58 419.28 228.87 414.58 225.97 414.58 227.61 419.28 225.97 423.98 228.87 423.98" style="fill: rgb(38, 50, 56); transform-origin: 228.775px 419.28px;" id="elu0rzlz151h" class="animable"></polygon><path d="M226.16,421.73a2.45,2.45,0,1,1,0-4.89l-4.6-.92-1.23,3.72,2.06,3.14Z" style="fill: rgb(38, 50, 56); transform-origin: 223.245px 419.35px;" id="elgc5bnn81vlq" class="animable"></path><path d="M226.56,414.58h-5.43l-2.71,4.7,2.71,4.7h5.43l2.71-4.7Zm-2.71,7.15a2.45,2.45,0,1,1,2.44-2.45A2.45,2.45,0,0,1,223.85,421.73Z" style="fill: #263238; transform-origin: 223.845px 419.28px;" id="elo7mhae7wxh" class="animable"></path><polygon points="417.89 414.26 415.88 410.77 417.89 407.28 420.04 407.28 418.83 410.77 420.04 414.26 417.89 414.26" style="fill: #263238; transform-origin: 417.96px 410.77px;" id="el8n1ln3rplzh" class="animable"></polygon><path d="M419.9,412.59a1.82,1.82,0,1,0,0-3.63l3.42-.68.91,2.76-1.52,2.33Z" style="fill: #263238; transform-origin: 422.065px 410.825px;" id="elgbwz5i1v8gs" class="animable"></path><path d="M419.61,407.28h4l2,3.49-2,3.49h-4l-2-3.49Zm2,5.31a1.82,1.82,0,1,0-1.81-1.82A1.81,1.81,0,0,0,421.62,412.59Z" style="fill: rgb(38, 50, 56); transform-origin: 421.61px 410.77px;" id="eldlejlwos91i" class="animable"></path><path d="M343,418.9h4.52a2.14,2.14,0,0,0,2.13-2.14h0a2.14,2.14,0,0,0-2.13-2.14H343a2.14,2.14,0,0,0-2.14,2.14h0A2.14,2.14,0,0,0,343,418.9Z" style="fill: rgb(38, 50, 56); transform-origin: 345.255px 416.76px;" id="el08lis8fq8l6x" class="animable"></path><path d="M335.73,414.86a4.46,4.46,0,1,1,2,6.18A4.61,4.61,0,0,1,335.73,414.86Z" style="fill: #263238; transform-origin: 339.665px 417.009px;" id="el6d7t41tcpjx" class="animable"></path><g id="elo5lrtxua8us"><rect x="339.07" y="411.71" width="1.37" height="10.1" style="fill: rgb(38, 50, 56); transform-origin: 339.755px 416.76px; transform: rotate(-154.76deg);" class="animable" id="el3ofv4za1mq4"></rect></g></g><defs>     <filter id="active" height="200%">         <feMorphology in="SourceAlpha" result="DILATED" operator="dilate" radius="2"></feMorphology>                <feFlood flood-color="#32DFEC" flood-opacity="1" result="PINK"></feFlood>        <feComposite in="PINK" in2="DILATED" operator="in" result="OUTLINE"></feComposite>        <feMerge>            <feMergeNode in="OUTLINE"></feMergeNode>            <feMergeNode in="SourceGraphic"></feMergeNode>        </feMerge>    </filter>    <filter id="hover" height="200%">        <feMorphology in="SourceAlpha" result="DILATED" operator="dilate" radius="2"></feMorphology>                <feFlood flood-color="#ff0000" flood-opacity="0.5" result="PINK"></feFlood>        <feComposite in="PINK" in2="DILATED" operator="in" result="OUTLINE"></feComposite>        <feMerge>            <feMergeNode in="OUTLINE"></feMergeNode>            <feMergeNode in="SourceGraphic"></feMergeNode>        </feMerge>            <feColorMatrix type="matrix" values="0   0   0   0   0                0   1   0   0   0                0   0   0   0   0                0   0   0   1   0 "></feColorMatrix>    </filter></defs></svg>\n';
const _sfc_main$1 = {
  __name: "error",
  __ssrInlineRender: true,
  props: ["error"],
  setup(__props) {
    var _a, _b, _c, _d;
    console.log("🚀 ~ error:", __props.error, (_a = __props.error) == null ? void 0 : _a.stack);
    const errorMessage = ((_b = __props.error) == null ? void 0 : _b.message) || ((_c = __props.error) == null ? void 0 : _c.statusMessage) || ((_d = __props.error) == null ? void 0 : _d.statusText) || "oops, something went wrong";
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLayout = __nuxt_component_0;
      _push(ssrRenderComponent(_component_NuxtLayout, mergeProps({ name: "default" }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          var _a2, _b2, _c2, _d2;
          if (_push2) {
            _push2(`<div class="w-full h-full max-w-[600px] mx-auto"${_scopeId}><div class="flex items-center justify-center [&amp;_svg]:w-full"${_scopeId}>${unref(errorImage) ?? ""}</div><div class="vstack"${_scopeId}><h1 class="text-xl font-bold"${_scopeId}>Error occurred!</h1>`);
            if ((_a2 = __props.error) == null ? void 0 : _a2.statusCode) {
              _push2(`<p${_scopeId}>${ssrInterpolate((_b2 = __props.error) == null ? void 0 : _b2.statusCode)} - ${ssrInterpolate(unref(errorMessage))}</p>`);
            } else {
              _push2(`<p${_scopeId}>${ssrInterpolate(unref(errorMessage))}</p>`);
            }
            _push2(`</div></div>`);
          } else {
            return [
              createVNode("div", { class: "w-full h-full max-w-[600px] mx-auto" }, [
                createVNode("div", {
                  class: "flex items-center justify-center [&_svg]:w-full",
                  innerHTML: unref(errorImage)
                }, null, 8, ["innerHTML"]),
                createVNode("div", { class: "vstack" }, [
                  createVNode("h1", { class: "text-xl font-bold" }, "Error occurred!"),
                  ((_c2 = __props.error) == null ? void 0 : _c2.statusCode) ? (openBlock(), createBlock("p", { key: 0 }, toDisplayString((_d2 = __props.error) == null ? void 0 : _d2.statusCode) + " - " + toDisplayString(unref(errorMessage)), 1)) : (openBlock(), createBlock("p", { key: 1 }, toDisplayString(unref(errorMessage)), 1))
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("error.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = {
  __name: "nuxt-root",
  __ssrInlineRender: true,
  setup(__props) {
    const IslandRenderer = () => null;
    const nuxtApp = useNuxtApp();
    nuxtApp.deferHydration();
    nuxtApp.ssrContext.url;
    const SingleRenderer = false;
    provide(PageRouteSymbol, useRoute());
    nuxtApp.hooks.callHookWith((hooks) => hooks.map((hook) => hook()), "vue:setup");
    const error = useError();
    const abortRender = error.value && !nuxtApp.ssrContext.error;
    onErrorCaptured((err, target, info) => {
      nuxtApp.hooks.callHook("vue:error", err, target, info).catch((hookError) => console.error("[nuxt] Error in `vue:error` hook", hookError));
      {
        const p = nuxtApp.runWithContext(() => showError(err));
        onServerPrefetch(() => p);
        return false;
      }
    });
    const islandContext = nuxtApp.ssrContext.islandContext;
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderSuspense(_push, {
        default: () => {
          if (unref(abortRender)) {
            _push(`<div></div>`);
          } else if (unref(error)) {
            _push(ssrRenderComponent(unref(_sfc_main$1), { error: unref(error) }, null, _parent));
          } else if (unref(islandContext)) {
            _push(ssrRenderComponent(unref(IslandRenderer), { context: unref(islandContext) }, null, _parent));
          } else if (unref(SingleRenderer)) {
            ssrRenderVNode(_push, createVNode(resolveDynamicComponent(unref(SingleRenderer)), null, null), _parent);
          } else {
            _push(ssrRenderComponent(unref(_sfc_main$2), null, null, _parent));
          }
        },
        _: 1
      });
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/nuxt/dist/app/components/nuxt-root.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
let entry;
{
  entry = async function createNuxtAppServer(ssrContext) {
    var _a;
    const vueApp = createApp(_sfc_main);
    const nuxt = createNuxtApp({ vueApp, ssrContext });
    try {
      await applyPlugins(nuxt, plugins);
      await nuxt.hooks.callHook("app:created", vueApp);
    } catch (error) {
      await nuxt.hooks.callHook("app:error", error);
      (_a = nuxt.payload).error || (_a.error = createError(error));
    }
    if (ssrContext == null ? void 0 : ssrContext._renderResponse) {
      throw new Error("skipping render");
    }
    return vueApp;
  };
}
const entry$1 = (ssrContext) => entry(ssrContext);

export { useRoute as a, useNuxtApp as b, asyncDataDefaults as c, createError as d, entry$1 as default, useAppConfig as e, useRuntimeConfig as f, nuxtLinkDefaults as g, navigateTo as n, resolveRouteObject as r, useRouter as u };
//# sourceMappingURL=server.mjs.map
