import { mergeProps, unref, withCtx, createVNode, ref, toDisplayString, resolveDynamicComponent, openBlock, createBlock, createTextVNode, defineComponent, renderSlot, computed, shallowRef, h, resolveComponent, reactive, watch, isRef, useAttrs, useSSRContext } from 'vue';
import { K as parseQuery, z as hasProtocol, C as joinURL, B as isScriptProtocol, L as withTrailingSlash, M as withoutTrailingSlash } from '../nitro/nitro.mjs';
import { g as useAppConfig, h as useRoute, d as useRuntimeConfig, b as useRouter, e as encodeRoutePath, r as resolveRouteObject, n as navigateTo, u as useNuxtApp, f as nuxtLinkDefaults } from './server.mjs';
import { a as _sfc_main$3$1, b as _sfc_main$h, c as _sfc_main$2$1, d as _sfc_main$1$1, _ as _sfc_main$4$1 } from './DialogTrigger-AdMdV7T6.mjs';
import { cva } from 'class-variance-authority';
import { _ as _sfc_main$g, c as cn } from './index-DhYCmpoC.mjs';
import { f as createAvatarInitials, m as markdownToHtmlLite, v as validateSmtpUrl, p as parseSmtpUrl, g as buildSmtpUrl, _ as _sfc_main$j, b as _sfc_main$2$2, c as _sfc_main$1$2, a as _sfc_main$3$2 } from './Input-DQo3hs7w.mjs';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderSlot, ssrRenderAttr, ssrInterpolate, ssrRenderList, ssrRenderVNode, ssrRenderClass, ssrRenderStyle } from 'vue/server-renderer';
import { useForwardPropsEmits, DialogRoot, DialogTrigger, DialogPortal, DialogOverlay, DialogContent, DialogClose, AvatarRoot, AvatarImage, AvatarFallback } from 'radix-vue';
import { _ as _sfc_main$i } from './DialogDescription-Cp-sEq-S.mjs';
import { b as useApi } from './hooks-CHj_C_Hn.mjs';
import { toast } from 'vue-sonner';
import { Menu, CpuIcon, ShieldCheckIcon, RssIcon, ComputerIcon, TerminalIcon, AirplayIcon, SwatchBookIcon, MonitorCheckIcon, SettingsIcon, LogOutIcon, GithubIcon } from 'lucide-vue-next';
import { Cross2Icon } from '@radix-icons/vue';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'fs-extra';
import 'axios';
import 'html-minifier-terser';
import 'nodemailer';
import 'handlebars';
import 'lodash';
import 'shelljs';
import 'node:net';
import 'node:util';
import 'node:child_process';
import 'acme-client';
import 'node-forge';
import 'zod';
import 'glob';
import 'node:url';
import 'bcryptjs';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';
import 'vue-router';
import 'clsx';
import 'tailwind-merge';
import '@vueuse/core';

const firstNonUndefined = (...args) => args.find((arg) => arg !== void 0);
function sanitizeExternalHref(value) {
  let candidate = value.replace(/[\u0000-\u001f\s]+/g, "");
  while (candidate.toLowerCase().startsWith("view-source:")) {
    candidate = candidate.slice("view-source:".length);
  }
  const colon = candidate.indexOf(":");
  if (colon > 0 && isScriptProtocol(candidate.slice(0, colon + 1))) {
    return null;
  }
  return value;
}
// @__NO_SIDE_EFFECTS__
function defineNuxtLink(options) {
  const componentName = options.componentName || "NuxtLink";
  function isHashLinkWithoutHashMode(link) {
    return typeof link === "string" && link.startsWith("#");
  }
  function resolveTrailingSlashBehavior(to, resolve, trailingSlash) {
    const effectiveTrailingSlash = trailingSlash != null ? trailingSlash : options.trailingSlash;
    if (!to || effectiveTrailingSlash !== "append" && effectiveTrailingSlash !== "remove") {
      return to;
    }
    if (typeof to === "string") {
      return applyTrailingSlashBehavior(to, effectiveTrailingSlash);
    }
    const path = "path" in to && to.path !== void 0 ? to.path : resolve(to).path;
    const resolvedPath = {
      ...to,
      name: void 0,
      // named routes would otherwise always override trailing slash behavior
      path: applyTrailingSlashBehavior(path, effectiveTrailingSlash)
    };
    return resolvedPath;
  }
  function useNuxtLink(props) {
    var _a, _b, _c;
    const router = useRouter();
    const config = useRuntimeConfig();
    const hasTarget = computed(() => !!unref(props.target) && unref(props.target) !== "_self");
    const isAbsoluteUrl = computed(() => {
      const path = unref(props.to) || unref(props.href) || "";
      return typeof path === "string" && hasProtocol(path, { acceptRelative: true });
    });
    const builtinRouterLink = resolveComponent("RouterLink");
    const useBuiltinLink = builtinRouterLink && typeof builtinRouterLink !== "string" ? builtinRouterLink.useLink : void 0;
    const isExternal = computed(() => {
      if (unref(props.external)) {
        return true;
      }
      const path = unref(props.to) || unref(props.href) || "";
      if (typeof path === "object") {
        return false;
      }
      return path === "" || isAbsoluteUrl.value;
    });
    const to = computed(() => {
      const path = unref(props.to) || unref(props.href) || "";
      if (isExternal.value) {
        return path;
      }
      return resolveTrailingSlashBehavior(path, router.resolve, unref(props.trailingSlash));
    });
    const link = isExternal.value ? void 0 : useBuiltinLink == null ? void 0 : useBuiltinLink({ ...props, to, viewTransition: unref(props.viewTransition) });
    const href = computed(() => {
      var _a2, _b2, _c2;
      const effectiveTrailingSlash = (_a2 = unref(props.trailingSlash)) != null ? _a2 : options.trailingSlash;
      if (!to.value || isAbsoluteUrl.value || isHashLinkWithoutHashMode(to.value)) {
        const raw = to.value;
        return typeof raw === "string" ? sanitizeExternalHref(raw) : raw;
      }
      if (isExternal.value) {
        const path = typeof to.value === "object" && "path" in to.value ? resolveRouteObject(to.value) : to.value;
        const href2 = typeof path === "object" ? router.resolve(path).href : path;
        const safe = typeof href2 === "string" ? sanitizeExternalHref(href2) : href2;
        return safe === null ? null : applyTrailingSlashBehavior(safe, effectiveTrailingSlash);
      }
      if (typeof to.value === "object") {
        return (_c2 = (_b2 = router.resolve(to.value)) == null ? void 0 : _b2.href) != null ? _c2 : null;
      }
      return applyTrailingSlashBehavior(joinURL(config.app.baseURL, to.value), effectiveTrailingSlash);
    });
    return {
      to,
      hasTarget,
      isAbsoluteUrl,
      isExternal,
      //
      href,
      isActive: (_a = link == null ? void 0 : link.isActive) != null ? _a : computed(() => to.value === router.currentRoute.value.path),
      isExactActive: (_b = link == null ? void 0 : link.isExactActive) != null ? _b : computed(() => to.value === router.currentRoute.value.path),
      route: (_c = link == null ? void 0 : link.route) != null ? _c : computed(() => router.resolve(to.value)),
      async navigate(_e) {
        if (href.value === null) {
          return;
        }
        await navigateTo(href.value, { replace: unref(props.replace), external: isExternal.value || hasTarget.value });
      }
    };
  }
  return defineComponent({
    name: componentName,
    props: {
      // Routing
      to: {
        type: [String, Object],
        default: void 0,
        required: false
      },
      href: {
        type: [String, Object],
        default: void 0,
        required: false
      },
      // Attributes
      target: {
        type: String,
        default: void 0,
        required: false
      },
      rel: {
        type: String,
        default: void 0,
        required: false
      },
      noRel: {
        type: Boolean,
        default: void 0,
        required: false
      },
      // Prefetching
      prefetch: {
        type: Boolean,
        default: void 0,
        required: false
      },
      prefetchOn: {
        type: [String, Object],
        default: void 0,
        required: false
      },
      noPrefetch: {
        type: Boolean,
        default: void 0,
        required: false
      },
      // Styling
      activeClass: {
        type: String,
        default: void 0,
        required: false
      },
      exactActiveClass: {
        type: String,
        default: void 0,
        required: false
      },
      prefetchedClass: {
        type: String,
        default: void 0,
        required: false
      },
      // Vue Router's `<RouterLink>` additional props
      replace: {
        type: Boolean,
        default: void 0,
        required: false
      },
      ariaCurrentValue: {
        type: String,
        default: void 0,
        required: false
      },
      // Edge cases handling
      external: {
        type: Boolean,
        default: void 0,
        required: false
      },
      // Slot API
      custom: {
        type: Boolean,
        default: void 0,
        required: false
      },
      // Behavior
      trailingSlash: {
        type: String,
        default: void 0,
        required: false
      }
    },
    useLink: useNuxtLink,
    setup(props, { slots }) {
      const router = useRouter();
      const { to, href, navigate, isExternal, hasTarget, isAbsoluteUrl } = useNuxtLink(props);
      shallowRef(false);
      const el = void 0;
      const elRef = void 0;
      async function prefetch(nuxtApp = useNuxtApp()) {
        {
          return;
        }
      }
      return () => {
        var _a;
        if (!isExternal.value && !hasTarget.value && !isHashLinkWithoutHashMode(to.value)) {
          const routerLinkProps = {
            ref: elRef,
            to: to.value,
            activeClass: props.activeClass || options.activeClass,
            exactActiveClass: props.exactActiveClass || options.exactActiveClass,
            replace: props.replace,
            ariaCurrentValue: props.ariaCurrentValue,
            custom: props.custom
          };
          if (!props.custom) {
            routerLinkProps.rel = props.rel || void 0;
          }
          return h(
            resolveComponent("RouterLink"),
            routerLinkProps,
            slots.default
          );
        }
        const target = props.target || null;
        const rel = firstNonUndefined(
          // converts `""` to `null` to prevent the attribute from being added as empty (`rel=""`)
          props.noRel ? "" : props.rel,
          options.externalRelAttribute,
          /*
          * A fallback rel of `noopener noreferrer` is applied for external links or links that open in a new tab.
          * This solves a reverse tabnapping security flaw in browsers pre-2021 as well as improving privacy.
          */
          isAbsoluteUrl.value || hasTarget.value ? "noopener noreferrer" : ""
        ) || null;
        if (props.custom) {
          if (!slots.default) {
            return null;
          }
          return slots.default({
            href: href.value,
            navigate,
            prefetch,
            get route() {
              if (!href.value) {
                return void 0;
              }
              const url = new URL(href.value, "http://localhost");
              return {
                path: url.pathname,
                fullPath: url.pathname,
                get query() {
                  return parseQuery(url.search);
                },
                hash: url.hash,
                params: {},
                name: void 0,
                matched: [],
                redirectedFrom: void 0,
                meta: {},
                href: href.value
              };
            },
            rel,
            target,
            isExternal: isExternal.value || hasTarget.value,
            isActive: false,
            isExactActive: false
          });
        }
        return h("a", {
          ref: el,
          href: href.value || null,
          // converts `""` to `null` to prevent the attribute from being added as empty (`href=""`)
          rel,
          target,
          onClick: async (event) => {
            var _a2;
            if (isExternal.value || hasTarget.value) {
              return;
            }
            event.preventDefault();
            try {
              const encodedHref = encodeRoutePath((_a2 = href.value) != null ? _a2 : "");
              return await (props.replace ? router.replace(encodedHref) : router.push(encodedHref));
            } finally {
            }
          }
        }, (_a = slots.default) == null ? void 0 : _a.call(slots));
      };
    }
  });
}
const __nuxt_component_0 = /* @__PURE__ */ defineNuxtLink(nuxtLinkDefaults);
function applyTrailingSlashBehavior(to, trailingSlash) {
  if (trailingSlash !== "append" && trailingSlash !== "remove") {
    return to;
  }
  const normalizeFn = trailingSlash === "append" ? withTrailingSlash : withoutTrailingSlash;
  const hasProtocolDifferentFromHttp = hasProtocol(to) && !to.startsWith("http");
  if (hasProtocolDifferentFromHttp) {
    return to;
  }
  return normalizeFn(to, true);
}
const _sfc_main$f = /* @__PURE__ */ defineComponent({
  __name: "Avatar",
  __ssrInlineRender: true,
  props: {
    class: { type: [Boolean, null, String, Object, Array] },
    size: { default: "sm" },
    shape: { default: "circle" }
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(AvatarRoot), mergeProps({
        class: unref(cn)(unref(avatarVariant)({ size: __props.size, shape: __props.shape }), props.class)
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent2, _scopeId);
          } else {
            return [
              renderSlot(_ctx.$slots, "default")
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
});
const _sfc_setup$f = _sfc_main$f.setup;
_sfc_main$f.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/avatar/Avatar.vue");
  return _sfc_setup$f ? _sfc_setup$f(props, ctx) : void 0;
};
const _sfc_main$e = /* @__PURE__ */ defineComponent({
  __name: "AvatarFallback",
  __ssrInlineRender: true,
  props: {
    delayMs: {},
    asChild: { type: Boolean },
    as: {}
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(AvatarFallback), mergeProps(props, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent2, _scopeId);
          } else {
            return [
              renderSlot(_ctx.$slots, "default")
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
});
const _sfc_setup$e = _sfc_main$e.setup;
_sfc_main$e.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/avatar/AvatarFallback.vue");
  return _sfc_setup$e ? _sfc_setup$e(props, ctx) : void 0;
};
const _sfc_main$d = /* @__PURE__ */ defineComponent({
  __name: "AvatarImage",
  __ssrInlineRender: true,
  props: {
    src: {},
    referrerPolicy: {},
    asChild: { type: Boolean },
    as: {}
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(AvatarImage), mergeProps(props, { class: "h-full w-full object-cover" }, _attrs), null, _parent));
    };
  }
});
const _sfc_setup$d = _sfc_main$d.setup;
_sfc_main$d.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/avatar/AvatarImage.vue");
  return _sfc_setup$d ? _sfc_setup$d(props, ctx) : void 0;
};
const avatarVariant = cva(
  "inline-flex items-center justify-center font-normal text-foreground select-none shrink-0 bg-secondary overflow-hidden",
  {
    variants: {
      size: {
        sm: "h-10 w-10 text-xs",
        base: "h-16 w-16 text-2xl",
        lg: "h-32 w-32 text-5xl"
      },
      shape: {
        circle: "rounded-full",
        square: "rounded-md"
      }
    }
  }
);
const _sfc_main$c = {
  __name: "AvatarDiv",
  __ssrInlineRender: true,
  setup(__props) {
    const profile = ref({
      name: "",
      email: "",
      avatar: `data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4NCjxzdmcgdmlld0JveD0iMCAwIDE2IDE2IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPg0KICA8cGF0aCBmaWxsPSIjODg4IiBkPSJtIDggMSBjIC0xLjY1NjI1IDAgLTMgMS4zNDM3NSAtMyAzIHMgMS4zNDM3NSAzIDMgMyBzIDMgLTEuMzQzNzUgMyAtMyBzIC0xLjM0Mzc1IC0zIC0zIC0zIHogbSAtMS41IDcgYyAtMi40OTIxODggMCAtNC41IDIuMDA3ODEyIC00LjUgNC41IHYgMC41IGMgMCAxLjEwOTM3NSAwLjg5MDYyNSAyIDIgMiBoIDggYyAxLjEwOTM3NSAwIDIgLTAuODkwNjI1IDIgLTIgdiAtMC41IGMgMCAtMi40OTIxODggLTIuMDA3ODEyIC00LjUgLTQuNSAtNC41IHogbSAwIDAiIC8+DQo8L3N2Zz4NCg==`
    });
    const isLoading = computed(() => {
      var _a;
      return !((_a = profile == null ? void 0 : profile.value) == null ? void 0 : _a.name);
    });
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b;
      const _component_Skeleton = _sfc_main$4$1;
      const _component_Avatar = _sfc_main$f;
      const _component_AvatarImage = _sfc_main$d;
      const _component_AvatarFallback = _sfc_main$e;
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: ("cn" in _ctx ? _ctx.cn : unref(cn))("hstack gap-2 transition-opacity")
      }, _attrs))}>`);
      if (unref(isLoading)) {
        _push(`<!--[-->`);
        _push(ssrRenderComponent(_component_Skeleton, { class: "size-8 rounded-lg overflow-hidden" }, null, _parent));
        _push(`<div class="flex-1 grid text-left">`);
        _push(ssrRenderComponent(_component_Skeleton, { class: "h-3 w-14 my-0.5" }, null, _parent));
        _push(ssrRenderComponent(_component_Skeleton, { class: "h-3 w-40 my-0.5" }, null, _parent));
        _push(`</div><!--]-->`);
      } else {
        _push(`<!--[-->`);
        _push(ssrRenderComponent(_component_Avatar, { class: "size-8 rounded-lg overflow-hidden" }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            var _a2, _b2, _c, _d;
            if (_push2) {
              _push2(ssrRenderComponent(_component_AvatarImage, {
                src: (_a2 = unref(profile)) == null ? void 0 : _a2.avatar,
                alt: (_b2 = unref(profile)) == null ? void 0 : _b2.name
              }, null, _parent2, _scopeId));
              _push2(ssrRenderComponent(_component_AvatarFallback, null, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  var _a3, _b3;
                  if (_push3) {
                    _push3(`${ssrInterpolate(("createAvatarInitials" in _ctx ? _ctx.createAvatarInitials : unref(createAvatarInitials))((_a3 = unref(profile)) == null ? void 0 : _a3.name))}`);
                  } else {
                    return [
                      createTextVNode(toDisplayString(("createAvatarInitials" in _ctx ? _ctx.createAvatarInitials : unref(createAvatarInitials))((_b3 = unref(profile)) == null ? void 0 : _b3.name)), 1)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              return [
                createVNode(_component_AvatarImage, {
                  src: (_c = unref(profile)) == null ? void 0 : _c.avatar,
                  alt: (_d = unref(profile)) == null ? void 0 : _d.name
                }, null, 8, ["src", "alt"]),
                createVNode(_component_AvatarFallback, null, {
                  default: withCtx(() => {
                    var _a3;
                    return [
                      createTextVNode(toDisplayString(("createAvatarInitials" in _ctx ? _ctx.createAvatarInitials : unref(createAvatarInitials))((_a3 = unref(profile)) == null ? void 0 : _a3.name)), 1)
                    ];
                  }),
                  _: 1
                })
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<div class="flex-1 grid text-left"><span class="truncate tracking-wide text-sm font-medium">${ssrInterpolate((_a = unref(profile)) == null ? void 0 : _a.name)}</span><span class="truncate tracking-wide text-xs opacity-70">${ssrInterpolate((_b = unref(profile)) == null ? void 0 : _b.email)}</span></div><!--]-->`);
      }
      _push(`</div>`);
    };
  }
};
const _sfc_setup$c = _sfc_main$c.setup;
_sfc_main$c.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Layouts/AvatarDiv.vue");
  return _sfc_setup$c ? _sfc_setup$c(props, ctx) : void 0;
};
const _sfc_main$b = {
  __name: "Loading",
  __ssrInlineRender: true,
  props: ["class", "size"],
  setup(__props) {
    const props = __props;
    const attrs = useAttrs();
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps(unref(attrs), {
        class: ("cn" in _ctx ? _ctx.cn : unref(cn))("flex items-center", props == null ? void 0 : props.class)
      }, _attrs))}><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid"${ssrRenderAttr("width", (props == null ? void 0 : props.size) + "px")}${ssrRenderAttr("height", (props == null ? void 0 : props.size) + "px")} class="-m-5"><g transform="rotate(0 50 50)"><rect x="47" y="24" rx="9.4" ry="4.8" width="6" height="12" fill="#898989"><animate attributeName="opacity" values="1;0" times="0;1" dur="1s" begin="-0.9166666666666666s" repeatCount="indefinite"></animate></rect></g><g transform="rotate(30 50 50)"><rect x="47" y="24" rx="9.4" ry="4.8" width="6" height="12" fill="#898989"><animate attributeName="opacity" values="1;0" times="0;1" dur="1s" begin="-0.8333333333333334s" repeatCount="indefinite"></animate></rect></g><g transform="rotate(60 50 50)"><rect x="47" y="24" rx="9.4" ry="4.8" width="6" height="12" fill="#898989"><animate attributeName="opacity" values="1;0" times="0;1" dur="1s" begin="-0.75s" repeatCount="indefinite"></animate></rect></g><g transform="rotate(90 50 50)"><rect x="47" y="24" rx="9.4" ry="4.8" width="6" height="12" fill="#898989"><animate attributeName="opacity" values="1;0" times="0;1" dur="1s" begin="-0.6666666666666666s" repeatCount="indefinite"></animate></rect></g><g transform="rotate(120 50 50)"><rect x="47" y="24" rx="9.4" ry="4.8" width="6" height="12" fill="#898989"><animate attributeName="opacity" values="1;0" times="0;1" dur="1s" begin="-0.5833333333333334s" repeatCount="indefinite"></animate></rect></g><g transform="rotate(150 50 50)"><rect x="47" y="24" rx="9.4" ry="4.8" width="6" height="12" fill="#898989"><animate attributeName="opacity" values="1;0" times="0;1" dur="1s" begin="-0.5s" repeatCount="indefinite"></animate></rect></g><g transform="rotate(180 50 50)"><rect x="47" y="24" rx="9.4" ry="4.8" width="6" height="12" fill="#898989"><animate attributeName="opacity" values="1;0" times="0;1" dur="1s" begin="-0.4166666666666667s" repeatCount="indefinite"></animate></rect></g><g transform="rotate(210 50 50)"><rect x="47" y="24" rx="9.4" ry="4.8" width="6" height="12" fill="#898989"><animate attributeName="opacity" values="1;0" times="0;1" dur="1s" begin="-0.3333333333333333s" repeatCount="indefinite"></animate></rect></g><g transform="rotate(240 50 50)"><rect x="47" y="24" rx="9.4" ry="4.8" width="6" height="12" fill="#898989"><animate attributeName="opacity" values="1;0" times="0;1" dur="1s" begin="-0.25s" repeatCount="indefinite"></animate></rect></g><g transform="rotate(270 50 50)"><rect x="47" y="24" rx="9.4" ry="4.8" width="6" height="12" fill="#898989"><animate attributeName="opacity" values="1;0" times="0;1" dur="1s" begin="-0.16666666666666666s" repeatCount="indefinite"></animate></rect></g><g transform="rotate(300 50 50)"><rect x="47" y="24" rx="9.4" ry="4.8" width="6" height="12" fill="#898989"><animate attributeName="opacity" values="1;0" times="0;1" dur="1s" begin="-0.08333333333333333s" repeatCount="indefinite"></animate></rect></g><g transform="rotate(330 50 50)"><rect x="47" y="24" rx="9.4" ry="4.8" width="6" height="12" fill="#898989"><animate attributeName="opacity" values="1;0" times="0;1" dur="1s" begin="0s" repeatCount="indefinite"></animate></rect></g></svg><div class="flex flex-col ml-4"><span class="text-sm text-zinc-800 font-semibold">Loading...</span><span class="text-xs text-zinc-500">Please wait a second while we load details for you</span></div>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</div>`);
    };
  }
};
const _sfc_setup$b = _sfc_main$b.setup;
_sfc_main$b.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Loading.vue");
  return _sfc_setup$b ? _sfc_setup$b(props, ctx) : void 0;
};
const _sfc_main$a = {
  __name: "ToogleSwitch",
  __ssrInlineRender: true,
  props: ["modelValue"],
  emits: ["update:modelValue", "change"],
  setup(__props, { emit: __emit }) {
    const emits = __emit;
    const props = __props;
    const attrs = useAttrs();
    const switchVal = computed({
      get: () => (props == null ? void 0 : props.modelValue) == true,
      set: (val) => {
        emits("update:modelValue", val);
        emits("change", val);
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Switch = _sfc_main$3$2;
      _push(ssrRenderComponent(_component_Switch, mergeProps(unref(attrs), {
        checked: unref(switchVal),
        "onUpdate:checked": (val) => switchVal.value = val
      }, _attrs), null, _parent));
    };
  }
};
const _sfc_setup$a = _sfc_main$a.setup;
_sfc_main$a.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ToogleSwitch.vue");
  return _sfc_setup$a ? _sfc_setup$a(props, ctx) : void 0;
};
const _sfc_main$9 = {
  __name: "CronJobs",
  __ssrInlineRender: true,
  setup(__props) {
    const isSubmitting = ref(true);
    const isLoading = ref(true);
    const responses = ref([]);
    const errors = ref([]);
    const cronJobSettings = reactive({
      installed_certs_daily_alerts: false,
      installed_certs_daily_renew: false,
      monitored_certs_daily_alerts: false,
      monitored_certs_daily_refresh: false,
      monitored_certs_hourly_retry: false
    });
    const cronJobList = [
      {
        category: "Installed Certificates",
        jobs: [
          {
            slug: "installed_certs_daily_alerts",
            label: "Send Email Alerts",
            freq: "Daily",
            desc: "Receive email alerts for certificate activity and status changes."
          },
          {
            slug: "installed_certs_daily_renew",
            label: "Renew Expired Certificates",
            freq: "Daily",
            desc: "Trigger automatic renewal of expired domain certificates."
          }
        ]
      },
      {
        category: "Monitored Certificates",
        jobs: [
          {
            slug: "monitored_certs_daily_alerts",
            label: "Send Email Alerts",
            freq: "Daily",
            desc: "Receive email alerts for certificate activity and status changes."
          },
          {
            slug: "monitored_certs_daily_refresh",
            label: "Hard Refresh Certificates",
            freq: "Daily",
            desc: "Clear cached monitor certificate data to ensure accuracy."
          },
          {
            slug: "monitored_certs_hourly_retry",
            label: "Retry Errored Certificates",
            freq: "Hourly",
            desc: "Retry and refresh certificates that previously encountered errors."
          }
        ]
      }
    ];
    watch(
      () => [
        //
        cronJobSettings.installed_certs_daily_alerts.value,
        cronJobSettings.installed_certs_daily_renew.value,
        cronJobSettings.monitored_certs_daily_alerts.value,
        cronJobSettings.monitored_certs_daily_refresh.value,
        cronJobSettings.monitored_certs_hourly_retry.value
      ],
      () => {
      }
    );
    async function saveSettings() {
      try {
        if (Array.from(errors.value).length) {
          return errors.value.push("Unable to submit, errors ahead.");
        }
        errors.value = [];
        isSubmitting.value = true;
        const body = { cronJobSettings };
        const resp = await useApi(`/api/action/setAccountData`, { method: "POST", body });
        isSubmitting.value = false;
        toast("Saved successfully.");
      } catch (error) {
        isSubmitting.value = false;
        errors.value = [(error == null ? void 0 : error.message) || error || "oops, something went wrong"];
        toast((error == null ? void 0 : error.message) || error || "oops, something went wrong");
      }
    }
    async function triggerCronJob(slug) {
      try {
        if (!slug) {
          return errors.value.push("Cronjob slug is missing.");
        }
        errors.value = [];
        isSubmitting.value = true;
        const body = { jobSlug: slug };
        const resp = await useApi(`/api/action/triggerCronJob`, { method: "POST", body });
        const cronjob = cronJobList.flatMap((itm) => {
          var _a;
          return ((_a = itm == null ? void 0 : itm.jobs) == null ? void 0 : _a.map((job) => ({ ...job, category: itm.category }))) || [];
        }).find((itm) => (itm == null ? void 0 : itm.slug) === slug);
        isSubmitting.value = false;
        responses.value = [`${cronjob == null ? void 0 : cronjob.category} ${cronjob == null ? void 0 : cronjob.label}: &nbsp; **\`${resp}\`**`];
        toast("Saved successfully.");
      } catch (error) {
        isSubmitting.value = false;
        errors.value = [(error == null ? void 0 : error.message) || error || "oops, something went wrong"];
        toast((error == null ? void 0 : error.message) || error || "oops, something went wrong");
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b;
      const _component_Loading = _sfc_main$b;
      const _component_Button = _sfc_main$g;
      const _component_ToogleSwitch = _sfc_main$a;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-4" }, _attrs))}>`);
      if (unref(isLoading)) {
        _push(ssrRenderComponent(_component_Loading, {
          class: "mx-auto my-20",
          size: "80"
        }, null, _parent));
      } else {
        _push(`<!--[-->`);
        ssrRenderList(cronJobList, (cat) => {
          _push(`<div class="rounded-lg shadow border border-gray-200 p-3 space-y-5"><h3 class="text-base font-medium pb-2 border-b">${ssrInterpolate(cat == null ? void 0 : cat.category)}</h3><!--[-->`);
          ssrRenderList(cat == null ? void 0 : cat.jobs, (jobs) => {
            _push(`<div class="flex-1 flex items-center"><div class="space-y-0.5 mr-auto"><h5 class="text-sm">${ssrInterpolate(jobs == null ? void 0 : jobs.label)} <span class="uppercase text-xs tracking-normal font-semibold font-mono"><span class="text-gray-400 mx-2">\u2022</span><span>${ssrInterpolate(jobs == null ? void 0 : jobs.freq)}</span></span></h5><p class="text-xs m-0 text-muted-foreground">${ssrInterpolate(jobs == null ? void 0 : jobs.desc)}</p></div>`);
            _push(ssrRenderComponent(_component_Button, {
              variant: "ghost",
              class: "mr-3 bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-600 text-xs h-[24px]",
              size: "xs",
              onClick: ($event) => triggerCronJob(jobs == null ? void 0 : jobs.slug)
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`TRY NOW`);
                } else {
                  return [
                    createTextVNode("TRY NOW")
                  ];
                }
              }),
              _: 2
            }, _parent));
            _push(ssrRenderComponent(_component_ToogleSwitch, {
              modelValue: unref(cronJobSettings)[jobs == null ? void 0 : jobs.slug],
              "onUpdate:modelValue": ($event) => unref(cronJobSettings)[jobs == null ? void 0 : jobs.slug] = $event,
              onChange: saveSettings
            }, null, _parent));
            _push(`</div>`);
          });
          _push(`<!--]--></div>`);
        });
        _push(`<!--]-->`);
      }
      if (unref(isSubmitting)) {
        _push(`<div class="font-semibold text-sky-800">Please wait...</div>`);
      } else if (unref(responses).length) {
        _push(`<div class="font-normal text-green-800">${(_a = ("markdownToHtmlLite" in _ctx ? _ctx.markdownToHtmlLite : unref(markdownToHtmlLite))(unref(responses).join(" "))) != null ? _a : ""}</div>`);
      } else {
        _push(`<div class="font-medium text-red-600">${(_b = ("markdownToHtmlLite" in _ctx ? _ctx.markdownToHtmlLite : unref(markdownToHtmlLite))(unref(errors).join(" "))) != null ? _b : ""}</div>`);
      }
      _push(`</div>`);
    };
  }
};
const _sfc_setup$9 = _sfc_main$9.setup;
_sfc_main$9.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Settings/CronJobs.vue");
  return _sfc_setup$9 ? _sfc_setup$9(props, ctx) : void 0;
};
const _sfc_main$8 = {
  __name: "LabelBlock",
  __ssrInlineRender: true,
  props: ["class"],
  setup(__props) {
    const props = __props;
    const attrs = useAttrs();
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<label${ssrRenderAttrs(mergeProps(unref(attrs), {
        class: ("cn" in _ctx ? _ctx.cn : unref(cn))("block m-0", props == null ? void 0 : props.class)
      }, _attrs))}>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</label>`);
    };
  }
};
const _sfc_setup$8 = _sfc_main$8.setup;
_sfc_main$8.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/LabelBlock.vue");
  return _sfc_setup$8 ? _sfc_setup$8(props, ctx) : void 0;
};
const _sfc_main$7 = {
  __name: "LabelText",
  __ssrInlineRender: true,
  props: ["class"],
  setup(__props) {
    const props = __props;
    const attrs = useAttrs();
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<label${ssrRenderAttrs(mergeProps(unref(attrs), {
        class: ("cn" in _ctx ? _ctx.cn : unref(cn))("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", props == null ? void 0 : props.classes)
      }, _attrs))}>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</label>`);
    };
  }
};
const _sfc_setup$7 = _sfc_main$7.setup;
_sfc_main$7.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/LabelText.vue");
  return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
const _sfc_main$6 = {
  __name: "SmtpSettings",
  __ssrInlineRender: true,
  setup(__props) {
    const isSubmitting = ref(false);
    const isLoading = ref(true);
    const testStatus = ref({});
    const useByUrl = ref("true");
    const errors = ref([]);
    const smtp = reactive({
      from: "",
      host: "",
      port: "",
      user: "",
      pass: "",
      ssl: false,
      url: ""
    });
    function getRefValues() {
      const result = {};
      for (const key in smtp) {
        result[key] = smtp[key];
      }
      return result;
    }
    function setRefValues(obj) {
      for (const key in obj) {
        if (key in smtp) {
          smtp[key] = obj[key];
        }
      }
    }
    function getColorClassByExitCode(code) {
      if (code === 0) return `text-green-700`;
      if (code === 1) return `text-red-700`;
      if (code === 2) return `text-indigo-700`;
      if (code === 3) return `text-amber-700`;
      return `text-gray-800`;
    }
    function getMessageByExitCode(code) {
      if (code === 0) return `Success, reaches to your inbox.`;
      if (code === 1) return `Failed, unable to deliver your test email, try again.`;
      if (code === 2) return `New changes detected, hit the above **__TEST EMAIL__** button.`;
      if (code === 3) return `Never Executed, hit the above **__TEST EMAIL__** button.`;
      return `please wait...`;
    }
    async function fetchSettings() {
      const data = await useApi(`/api/fetch/getAccountData?fields=smtpUrl,smtpFrom,smtpUseByUrl,smtpTestStatus`);
      return {
        url: data == null ? void 0 : data.smtpUrl,
        from: data == null ? void 0 : data.smtpFrom,
        useByUrl: String(data == null ? void 0 : data.smtpUseByUrl),
        testStatus: data == null ? void 0 : data.smtpTestStatus
      };
    }
    async function saveSettings() {
      try {
        if (Array.from(errors.value).length) {
          return errors.value.push("Unable to submit, errors ahead.");
        }
        errors.value = [];
        isSubmitting.value = true;
        const body = { smtpUrl: smtp == null ? void 0 : smtp.url, smtpFrom: smtp == null ? void 0 : smtp.from, smtpUseByUrl: useByUrl.value == "true", smtpTestStatus: { exit: 2 } };
        const resp = await useApi(`/api/action/setAccountData`, { method: "POST", body });
        await loadComponent();
        isSubmitting.value = false;
        toast("Saved successfully.");
      } catch (error) {
        isSubmitting.value = false;
        errors.value = [(error == null ? void 0 : error.message) || error || "oops, something went wrong"];
        toast((error == null ? void 0 : error.message) || error || "oops, something went wrong");
      }
    }
    async function sendTestEmail() {
      try {
        testStatus.value = { exit: -1 };
        const body = { timestamp: Date.now() };
        const resp = await useApi(`/api/action/sendSmtpTestEmail`, { method: "POST", body });
        await loadComponent();
      } catch (e) {
        console.warn(e);
      }
    }
    async function loadComponent() {
      var _a;
      const saved = await fetchSettings();
      isLoading.value = false;
      if (typeof ((_a = saved == null ? void 0 : saved.testStatus) == null ? void 0 : _a.exit) === "number") {
        testStatus.value = saved == null ? void 0 : saved.testStatus;
      } else {
        testStatus.value = { exit: 3 };
      }
      if (saved == null ? void 0 : saved.useByUrl) {
        useByUrl.value = ["true", "false"].includes(saved == null ? void 0 : saved.useByUrl) ? saved == null ? void 0 : saved.useByUrl : "true";
      }
      if (saved == null ? void 0 : saved.from) {
        setRefValues({ from: saved == null ? void 0 : saved.from });
      }
      if (saved == null ? void 0 : saved.url) {
        setRefValues({ url: saved == null ? void 0 : saved.url });
        setRefValues(parseSmtpUrl(saved == null ? void 0 : saved.url));
      } else if (saved == null ? void 0 : saved.host) {
        setRefValues({
          host: (saved == null ? void 0 : saved.host) || "",
          port: (saved == null ? void 0 : saved.port) || "",
          user: (saved == null ? void 0 : saved.user) || "",
          pass: (saved == null ? void 0 : saved.pass) || "",
          ssl: (saved == null ? void 0 : saved.ssl) || false
        });
      }
    }
    watch(
      () => smtp.url,
      (newUrl, oldUrl) => {
        if (newUrl === "") {
          return setRefValues({ host: "", port: "", user: "", pass: "", ssl: false });
        }
        if (newUrl !== oldUrl) {
          const validator = validateSmtpUrl(newUrl);
          if (!validator.valid) {
            errors.value = [validator.message];
          } else {
            errors.value = [];
          }
          const parsed = parseSmtpUrl(newUrl);
          return setRefValues(parsed);
        }
      }
    );
    watch(
      () => [smtp.host.value, smtp.port.value, smtp.user.value, smtp.pass.value, smtp.ssl.value],
      () => {
        const smtpUrl = buildSmtpUrl(getRefValues());
        if (smtpUrl) setRefValues({ url: smtpUrl });
      }
    );
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c, _d, _e, _f;
      const _component_Loading = _sfc_main$b;
      const _component_LabelBlock = _sfc_main$8;
      const _component_LabelText = _sfc_main$7;
      const _component_Input = _sfc_main$j;
      const _component_RadioGroup = _sfc_main$2$2;
      const _component_RadioGroupItem = _sfc_main$1$2;
      const _component_ToogleSwitch = _sfc_main$a;
      const _component_Button = _sfc_main$g;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex w-full" }, _attrs))}>`);
      if (unref(isLoading)) {
        _push(ssrRenderComponent(_component_Loading, {
          class: "mx-auto my-20",
          size: "80"
        }, null, _parent));
      } else {
        _push(`<div class="w-full space-y-6 text-stone-700 dark:text-white">`);
        _push(ssrRenderComponent(_component_LabelBlock, { class: "space-y-1" }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_LabelText, null, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`SMTP From`);
                  } else {
                    return [
                      createTextVNode("SMTP From")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(_component_Input, {
                modelValue: unref(smtp).from,
                "onUpdate:modelValue": ($event) => unref(smtp).from = $event,
                placeholder: "example@domain.xyz"
              }, null, _parent2, _scopeId));
            } else {
              return [
                createVNode(_component_LabelText, null, {
                  default: withCtx(() => [
                    createTextVNode("SMTP From")
                  ]),
                  _: 1
                }),
                createVNode(_component_Input, {
                  modelValue: unref(smtp).from,
                  "onUpdate:modelValue": ($event) => unref(smtp).from = $event,
                  placeholder: "example@domain.xyz"
                }, null, 8, ["modelValue", "onUpdate:modelValue"])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_RadioGroup, {
          class: "flex items-center gap-3",
          modelValue: unref(useByUrl),
          "onUpdate:modelValue": ($event) => isRef(useByUrl) ? useByUrl.value = $event : null
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_LabelText, null, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`Use By:`);
                  } else {
                    return [
                      createTextVNode("Use By:")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(_component_LabelBlock, { class: "flex items-center leading-none cursor-pointer" }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_RadioGroupItem, { value: "true" }, null, _parent3, _scopeId2));
                    _push3(`<span class="pl-2"${_scopeId2}>URL</span>`);
                  } else {
                    return [
                      createVNode(_component_RadioGroupItem, { value: "true" }),
                      createVNode("span", { class: "pl-2" }, "URL")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(_component_LabelBlock, { class: "flex items-center leading-none cursor-pointer" }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_RadioGroupItem, { value: "false" }, null, _parent3, _scopeId2));
                    _push3(`<span class="pl-2"${_scopeId2}>Host</span>`);
                  } else {
                    return [
                      createVNode(_component_RadioGroupItem, { value: "false" }),
                      createVNode("span", { class: "pl-2" }, "Host")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              return [
                createVNode(_component_LabelText, null, {
                  default: withCtx(() => [
                    createTextVNode("Use By:")
                  ]),
                  _: 1
                }),
                createVNode(_component_LabelBlock, { class: "flex items-center leading-none cursor-pointer" }, {
                  default: withCtx(() => [
                    createVNode(_component_RadioGroupItem, { value: "true" }),
                    createVNode("span", { class: "pl-2" }, "URL")
                  ]),
                  _: 1
                }),
                createVNode(_component_LabelBlock, { class: "flex items-center leading-none cursor-pointer" }, {
                  default: withCtx(() => [
                    createVNode(_component_RadioGroupItem, { value: "false" }),
                    createVNode("span", { class: "pl-2" }, "Host")
                  ]),
                  _: 1
                })
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_LabelBlock, {
          class: ["space-y-1", { disabled: unref(useByUrl) != "true" }],
          key: unref(useByUrl)
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_LabelText, null, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`SMTP URL`);
                  } else {
                    return [
                      createTextVNode("SMTP URL")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(_component_Input, {
                modelValue: unref(smtp).url,
                "onUpdate:modelValue": ($event) => unref(smtp).url = $event,
                placeholder: "smtp://user:pass@mail.example.com:587"
              }, null, _parent2, _scopeId));
            } else {
              return [
                createVNode(_component_LabelText, null, {
                  default: withCtx(() => [
                    createTextVNode("SMTP URL")
                  ]),
                  _: 1
                }),
                createVNode(_component_Input, {
                  modelValue: unref(smtp).url,
                  "onUpdate:modelValue": ($event) => unref(smtp).url = $event,
                  placeholder: "smtp://user:pass@mail.example.com:587"
                }, null, 8, ["modelValue", "onUpdate:modelValue"])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<div class="${ssrRenderClass([{ disabled: unref(useByUrl) == "true" }, "grid grid-cols-2 gap-4"])}">`);
        _push(ssrRenderComponent(_component_LabelBlock, { class: "space-y-1" }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_LabelText, null, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`SMTP Host`);
                  } else {
                    return [
                      createTextVNode("SMTP Host")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(_component_Input, {
                autocomplete: "off",
                modelValue: unref(smtp).host,
                "onUpdate:modelValue": ($event) => unref(smtp).host = $event,
                placeholder: "mail.example.com"
              }, null, _parent2, _scopeId));
            } else {
              return [
                createVNode(_component_LabelText, null, {
                  default: withCtx(() => [
                    createTextVNode("SMTP Host")
                  ]),
                  _: 1
                }),
                createVNode(_component_Input, {
                  autocomplete: "off",
                  modelValue: unref(smtp).host,
                  "onUpdate:modelValue": ($event) => unref(smtp).host = $event,
                  placeholder: "mail.example.com"
                }, null, 8, ["modelValue", "onUpdate:modelValue"])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_LabelBlock, { class: "space-y-1" }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_LabelText, null, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`SMTP Port`);
                  } else {
                    return [
                      createTextVNode("SMTP Port")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(_component_Input, {
                autocomplete: "off",
                modelValue: unref(smtp).port,
                "onUpdate:modelValue": ($event) => unref(smtp).port = $event,
                placeholder: "465/25",
                type: "number"
              }, null, _parent2, _scopeId));
            } else {
              return [
                createVNode(_component_LabelText, null, {
                  default: withCtx(() => [
                    createTextVNode("SMTP Port")
                  ]),
                  _: 1
                }),
                createVNode(_component_Input, {
                  autocomplete: "off",
                  modelValue: unref(smtp).port,
                  "onUpdate:modelValue": ($event) => unref(smtp).port = $event,
                  placeholder: "465/25",
                  type: "number"
                }, null, 8, ["modelValue", "onUpdate:modelValue"])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_LabelBlock, { class: "space-y-1" }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_LabelText, null, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`SMTP User`);
                  } else {
                    return [
                      createTextVNode("SMTP User")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(_component_Input, {
                autocomplete: "off",
                modelValue: unref(smtp).user,
                "onUpdate:modelValue": ($event) => unref(smtp).user = $event,
                placeholder: "username"
              }, null, _parent2, _scopeId));
            } else {
              return [
                createVNode(_component_LabelText, null, {
                  default: withCtx(() => [
                    createTextVNode("SMTP User")
                  ]),
                  _: 1
                }),
                createVNode(_component_Input, {
                  autocomplete: "off",
                  modelValue: unref(smtp).user,
                  "onUpdate:modelValue": ($event) => unref(smtp).user = $event,
                  placeholder: "username"
                }, null, 8, ["modelValue", "onUpdate:modelValue"])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_LabelBlock, { class: "space-y-1" }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_LabelText, null, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`SMTP Password`);
                  } else {
                    return [
                      createTextVNode("SMTP Password")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(_component_Input, {
                autocomplete: "off",
                modelValue: unref(smtp).pass,
                "onUpdate:modelValue": ($event) => unref(smtp).pass = $event,
                placeholder: "password",
                type: "password"
              }, null, _parent2, _scopeId));
            } else {
              return [
                createVNode(_component_LabelText, null, {
                  default: withCtx(() => [
                    createTextVNode("SMTP Password")
                  ]),
                  _: 1
                }),
                createVNode(_component_Input, {
                  autocomplete: "off",
                  modelValue: unref(smtp).pass,
                  "onUpdate:modelValue": ($event) => unref(smtp).pass = $event,
                  placeholder: "password",
                  type: "password"
                }, null, 8, ["modelValue", "onUpdate:modelValue"])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_LabelBlock, { class: "flex items-center space-x-2" }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_ToogleSwitch, {
                modelValue: unref(smtp).ssl,
                "onUpdate:modelValue": ($event) => unref(smtp).ssl = $event
              }, null, _parent2, _scopeId));
              _push2(ssrRenderComponent(_component_LabelText, null, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`Use SSL`);
                  } else {
                    return [
                      createTextVNode("Use SSL")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              return [
                createVNode(_component_ToogleSwitch, {
                  modelValue: unref(smtp).ssl,
                  "onUpdate:modelValue": ($event) => unref(smtp).ssl = $event
                }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                createVNode(_component_LabelText, null, {
                  default: withCtx(() => [
                    createTextVNode("Use SSL")
                  ]),
                  _: 1
                })
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div><div class="${ssrRenderClass([{ disabled: unref(isSubmitting) }, "flex items-center space-x-2 mt-4"])}">`);
        _push(ssrRenderComponent(_component_Button, {
          size: "sm",
          class: "ring-1 ring-gray-300 uppercase",
          variant: "",
          onClick: saveSettings
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Save`);
            } else {
              return [
                createTextVNode("Save")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_Button, {
          size: "sm",
          class: "ring-1 ring-gray-300 uppercase",
          variant: "secondary",
          onClick: sendTestEmail
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Test Email`);
            } else {
              return [
                createTextVNode("Test Email")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
        if (typeof ((_a = unref(testStatus)) == null ? void 0 : _a.exit) === "number") {
          _push(`<div class="tracking-normal"> Test Email Status: <span class="${ssrRenderClass(("cn" in _ctx ? _ctx.cn : unref(cn))("font-semibold", getColorClassByExitCode((_b = unref(testStatus)) == null ? void 0 : _b.exit)))}">${(_e = ("markdownToHtmlLite" in _ctx ? _ctx.markdownToHtmlLite : unref(markdownToHtmlLite))([getMessageByExitCode((_c = unref(testStatus)) == null ? void 0 : _c.exit), (_d = unref(testStatus)) == null ? void 0 : _d.note].join(" "))) != null ? _e : ""}</span></div>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(isSubmitting)) {
          _push(`<div class="font-semibold text-sky-800">Please wait...</div>`);
        } else {
          _push(`<div class="font-medium text-red-600">${(_f = ("markdownToHtmlLite" in _ctx ? _ctx.markdownToHtmlLite : unref(markdownToHtmlLite))(unref(errors).join(" "))) != null ? _f : ""}</div>`);
        }
        _push(`</div>`);
      }
      _push(`</div>`);
    };
  }
};
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Settings/SmtpSettings.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const _sfc_main$5 = {
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    var _a;
    const navItems = [
      // {
      //   slug: "general",
      //   navLabel: "General",
      //   label: "General Settings",
      //   brief: "Be updated always with your settings",
      //   component: SettingsGeneral,
      // },
      // {
      //   slug: "notifications",
      //   navLabel: "Notifications",
      //   label: "Email Notifications",
      //   brief: "Choose which email notifications you want to receive",
      //   component: SettingsNotifications,
      // },
      {
        slug: "cronjobs",
        navLabel: "Cron Jobs",
        label: "Cron Jobs Settings",
        brief: "Choose how cron-jobs works on your vps",
        component: _sfc_main$9
      },
      {
        slug: "smtpSettings",
        navLabel: "SMTP Settings",
        label: "SMTP Settings",
        brief: "Configure your vps to send emails globally",
        component: _sfc_main$6
      }
    ];
    const currentSlug = ref((_a = navItems == null ? void 0 : navItems[0]) == null ? void 0 : _a.slug);
    const selectedOne = computed(() => navItems.find((itm) => (itm == null ? void 0 : itm.slug) === currentSlug.value));
    return (_ctx, _push, _parent, _attrs) => {
      var _a2, _b, _c, _d, _e, _f, _g, _h;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex-1 mx-auto grid w-full items-start md:grid-cols-[180px_1fr] lg:grid-cols-[200px_1fr] xl:grid-cols-[240px_1fr] overflow-y-auto" }, _attrs))}><aside class="bg-gray-200/50 p-4 pl-3 h-full" style="${ssrRenderStyle({ __boxShadow_kill: "rgba(0, 0, 0, 0.3) 2px 0 16px 1px" })}"><nav class="grid gap-1"><!--[-->`);
      ssrRenderList(navItems, (item) => {
        _push(`<button class="${ssrRenderClass([
          ("cn" in _ctx ? _ctx.cn : unref(cn))(
            unref(currentSlug) === (item == null ? void 0 : item.slug) ? "font-semibold bg-gray-300" : "hover:bg-gray-200"
          ),
          "px-2 py-1 text-left text-sm text-gray-800 rounded-md border border-transparent outline-none"
        ])}">${ssrInterpolate((item == null ? void 0 : item.navLabel) || (item == null ? void 0 : item.label))}</button>`);
      });
      _push(`<!--]--></nav></aside><main class="flex-1 p-8"><div class="space-y-6">`);
      if (((_a2 = unref(selectedOne)) == null ? void 0 : _a2.label) || ((_b = unref(selectedOne)) == null ? void 0 : _b.brief)) {
        _push(`<div><h3 class="${ssrRenderClass(("cn" in _ctx ? _ctx.cn : unref(cn))("text-md font-medium", (_c = unref(selectedOne)) == null ? void 0 : _c.labelClass))}">${ssrInterpolate(((_d = unref(selectedOne)) == null ? void 0 : _d.label) || "")}</h3><p class="${ssrRenderClass(("cn" in _ctx ? _ctx.cn : unref(cn))("text-xs text-muted-foreground", (_e = unref(selectedOne)) == null ? void 0 : _e.briefClass))}">${ssrInterpolate(((_f = unref(selectedOne)) == null ? void 0 : _f.brief) || "")}</p></div>`);
      } else {
        _push(`<!---->`);
      }
      if ((_g = unref(selectedOne)) == null ? void 0 : _g.component) {
        ssrRenderVNode(_push, createVNode(resolveDynamicComponent((_h = unref(selectedOne)) == null ? void 0 : _h.component), { class: "text-sm" }, null), _parent);
      } else if (unref(currentSlug)) {
        _push(`<pre>component is missing</pre>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></main></div>`);
    };
  }
};
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Settings/index.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const _sfc_main$4 = {
  __name: "Sidebar",
  __ssrInlineRender: true,
  props: ["class", "styles", "fixed_classes"],
  setup(__props) {
    const props = __props;
    const appData = ref({});
    const { title, icon } = useAppConfig();
    const config = useRuntimeConfig();
    const route = useRoute();
    const navs = [
      //
      {
        icon: CpuIcon,
        label: "Dashboard",
        href: "/home"
      },
      {
        icon: ShieldCheckIcon,
        label: "SSL Certificates",
        href: "/certs"
      },
      {
        icon: RssIcon,
        label: "Web Sites",
        href: "/sites"
      },
      {
        icon: ComputerIcon,
        label: "--PM2",
        href: "/sample"
      },
      {
        icon: TerminalIcon,
        label: "--Deploys",
        href: "/sample"
      },
      {
        icon: AirplayIcon,
        label: "--Actions",
        href: "/sample"
      },
      {
        icon: SwatchBookIcon,
        label: "--sample",
        href: "/sample"
      }
    ].filter((i) => {
      var _a, _b;
      return ((_a = i == null ? void 0 : i.label) == null ? void 0 : _a.startsWith("--")) ? String((_b = config == null ? void 0 : config.public) == null ? void 0 : _b.appEnv).startsWith("dev") : true;
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      const _component_LayoutsAvatarDiv = _sfc_main$c;
      const _component_Dialog = _sfc_main$3$1;
      const _component_DialogTrigger = _sfc_main$h;
      const _component_DialogContent = _sfc_main$2$1;
      const _component_DialogTitle = _sfc_main$1$1;
      const _component_DialogDescription = _sfc_main$i;
      const _component_Settings = _sfc_main$5;
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: ("cn" in _ctx ? _ctx.cn : unref(cn))("flex h-full flex-col relative overflow-hidden", props == null ? void 0 : props.class),
        style: { ...props == null ? void 0 : props.styles }
      }, _attrs))}>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        class: "flex items-center h-[60px] px-4 gap-3 font-bold text-lg border-b-8 border-cyan-600 bg-gray-50 shrink-0"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<img${ssrRenderAttr("src", unref(icon))} class="size-6"${_scopeId}><span${_scopeId}>${ssrInterpolate(unref(title))}</span>`);
          } else {
            return [
              createVNode("img", {
                src: unref(icon),
                class: "size-6"
              }, null, 8, ["src"]),
              createVNode("span", null, toDisplayString(unref(title)), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="flex-1"><nav class="grid items-start text-sm text-white"><!--[-->`);
      ssrRenderList(unref(navs), (nav) => {
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: nav.href,
          class: ["flex items-center gap-4 px-4 py-3 tracking-wide text-white hover:bg-slate-700 transition-all border-0", { "bg-cyan-900": unref(route).path === nav.href }]
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderVNode(_push2, createVNode(resolveDynamicComponent(nav.icon), { class: "size-4" }, null), _parent2, _scopeId);
              _push2(` ${ssrInterpolate(nav == null ? void 0 : nav.label)}`);
            } else {
              return [
                (openBlock(), createBlock(resolveDynamicComponent(nav.icon), { class: "size-4" })),
                createTextVNode(" " + toDisplayString(nav == null ? void 0 : nav.label), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></nav></div><div class="${ssrRenderClass(("cn" in _ctx ? _ctx.cn : unref(cn))("w-full fixed bottom-0 left-0 right-0 p-2 pb-0 bg-gray-800", props == null ? void 0 : props.fixed_classes))}"><div class="z-50 min-w-56 overflow-hidden rounded-sm border-0 bg-gray-700 p-1 text-white shadow-inner"><div class="flex items-center px-1 py-1.5 text-left text-sm font-normal">`);
      _push(ssrRenderComponent(_component_LayoutsAvatarDiv, null, null, _parent));
      _push(`</div><div class="-mx-1 my-1 h-px bg-gray-800"></div>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/guide",
        class: "cursor-pointer relative flex select-none items-center rounded-sm gap-2 px-2 py-1 h-10 text-sm outline-none transition-colors hover:bg-gray-800 [&>svg]:size-4 [&>svg]:shrink-0"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(MonitorCheckIcon), null, null, _parent2, _scopeId));
            _push2(` Welcome Guide `);
          } else {
            return [
              createVNode(unref(MonitorCheckIcon)),
              createTextVNode(" Welcome Guide ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_Dialog, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_DialogTrigger, { "as-child": "" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<a class="cursor-pointer relative flex select-none items-center rounded-sm gap-2 px-2 py-1 h-10 text-sm outline-none transition-colors hover:bg-gray-800 [&amp;&gt;svg]:size-4 [&amp;&gt;svg]:shrink-0"${_scopeId2}>`);
                  _push3(ssrRenderComponent(unref(SettingsIcon), null, null, _parent3, _scopeId2));
                  _push3(` Settings </a>`);
                } else {
                  return [
                    createVNode("a", { class: "cursor-pointer relative flex select-none items-center rounded-sm gap-2 px-2 py-1 h-10 text-sm outline-none transition-colors hover:bg-gray-800 [&>svg]:size-4 [&>svg]:shrink-0" }, [
                      createVNode(unref(SettingsIcon)),
                      createTextVNode(" Settings ")
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_DialogContent, {
              class: "flex sm:max-w-xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl p-0 h-[90dvh] max-h-[90dvh] overflow-auto rounded-none md:rounded-lg",
              onInteractOutside: (event) => event.preventDefault()
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_DialogTitle, { class: "sr-only" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`Settings`);
                      } else {
                        return [
                          createTextVNode("Settings")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_DialogDescription, { class: "sr-only" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`Settings`);
                      } else {
                        return [
                          createTextVNode("Settings")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_Settings, null, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_DialogTitle, { class: "sr-only" }, {
                      default: withCtx(() => [
                        createTextVNode("Settings")
                      ]),
                      _: 1
                    }),
                    createVNode(_component_DialogDescription, { class: "sr-only" }, {
                      default: withCtx(() => [
                        createTextVNode("Settings")
                      ]),
                      _: 1
                    }),
                    createVNode(_component_Settings)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_DialogTrigger, { "as-child": "" }, {
                default: withCtx(() => [
                  createVNode("a", { class: "cursor-pointer relative flex select-none items-center rounded-sm gap-2 px-2 py-1 h-10 text-sm outline-none transition-colors hover:bg-gray-800 [&>svg]:size-4 [&>svg]:shrink-0" }, [
                    createVNode(unref(SettingsIcon)),
                    createTextVNode(" Settings ")
                  ])
                ]),
                _: 1
              }),
              createVNode(_component_DialogContent, {
                class: "flex sm:max-w-xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl p-0 h-[90dvh] max-h-[90dvh] overflow-auto rounded-none md:rounded-lg",
                onInteractOutside: (event) => event.preventDefault()
              }, {
                default: withCtx(() => [
                  createVNode(_component_DialogTitle, { class: "sr-only" }, {
                    default: withCtx(() => [
                      createTextVNode("Settings")
                    ]),
                    _: 1
                  }),
                  createVNode(_component_DialogDescription, { class: "sr-only" }, {
                    default: withCtx(() => [
                      createTextVNode("Settings")
                    ]),
                    _: 1
                  }),
                  createVNode(_component_Settings)
                ]),
                _: 1
              }, 8, ["onInteractOutside"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="cursor-pointer relative flex select-none items-center rounded-sm gap-2 px-2 py-1 h-10 text-sm outline-none transition-colors hover:bg-gray-800 [&amp;&gt;svg]:size-4 [&amp;&gt;svg]:shrink-0">`);
      _push(ssrRenderComponent(unref(LogOutIcon), null, null, _parent));
      _push(` Log out </div></div><div class="relative flex items-center rounded-sm gap-2 py-1"><a href="https://github.com/vulrun/vpscap" target="_blank" class="cursor-pointer flex select-none items-center mr-auto gap-2 p-1 h-8 text-sm outline-none transition-colors text-gray-500 hover:text-gray-400 [&amp;&gt;svg]:size-4 [&amp;&gt;svg]:shrink-0">`);
      _push(ssrRenderComponent(unref(GithubIcon), null, null, _parent));
      _push(` Github </a><span class="px-1 select-none text-xs text-gray-600">Ver: ${ssrInterpolate(unref(appData).version)}</span></div></div></div>`);
    };
  }
};
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Layouts/Sidebar.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "Sheet",
  __ssrInlineRender: true,
  props: {
    open: { type: Boolean },
    defaultOpen: { type: Boolean },
    modal: { type: Boolean }
  },
  emits: ["update:open"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const forwarded = useForwardPropsEmits(props, emits);
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(DialogRoot), mergeProps(unref(forwarded), _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent2, _scopeId);
          } else {
            return [
              renderSlot(_ctx.$slots, "default")
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/sheet/Sheet.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  ...{
    inheritAttrs: false
  },
  __name: "SheetContent",
  __ssrInlineRender: true,
  props: {
    class: { type: [Boolean, null, String, Object, Array] },
    side: {},
    forceMount: { type: Boolean },
    trapFocus: { type: Boolean },
    disableOutsidePointerEvents: { type: Boolean },
    asChild: { type: Boolean },
    as: {}
  },
  emits: ["escapeKeyDown", "pointerDownOutside", "focusOutside", "interactOutside", "openAutoFocus", "closeAutoFocus"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const delegatedProps = computed(() => {
      const { class: _, side, ...delegated } = props;
      return delegated;
    });
    const forwarded = useForwardPropsEmits(delegatedProps, emits);
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(DialogPortal), _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(DialogOverlay), { class: "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(DialogContent), mergeProps({
              class: unref(cn)(unref(sheetVariants)({ side: __props.side }), props.class)
            }, { ...unref(forwarded), ..._ctx.$attrs }), {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  ssrRenderSlot(_ctx.$slots, "default", {}, null, _push3, _parent3, _scopeId2);
                  _push3(ssrRenderComponent(unref(DialogClose), { class: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(unref(Cross2Icon), { class: "w-4 h-4" }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(unref(Cross2Icon), { class: "w-4 h-4" })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    renderSlot(_ctx.$slots, "default"),
                    createVNode(unref(DialogClose), { class: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary" }, {
                      default: withCtx(() => [
                        createVNode(unref(Cross2Icon), { class: "w-4 h-4" })
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 3
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(DialogOverlay), { class: "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" }),
              createVNode(unref(DialogContent), mergeProps({
                class: unref(cn)(unref(sheetVariants)({ side: __props.side }), props.class)
              }, { ...unref(forwarded), ..._ctx.$attrs }), {
                default: withCtx(() => [
                  renderSlot(_ctx.$slots, "default"),
                  createVNode(unref(DialogClose), { class: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary" }, {
                    default: withCtx(() => [
                      createVNode(unref(Cross2Icon), { class: "w-4 h-4" })
                    ]),
                    _: 1
                  })
                ]),
                _: 3
              }, 16, ["class"])
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/sheet/SheetContent.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "SheetTrigger",
  __ssrInlineRender: true,
  props: {
    asChild: { type: Boolean },
    as: {}
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(DialogTrigger), mergeProps(props, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent2, _scopeId);
          } else {
            return [
              renderSlot(_ctx.$slots, "default")
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/sheet/SheetTrigger.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const sheetVariants = cva(
  "fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
  {
    variants: {
      side: {
        top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
        bottom: "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
        left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
        right: "inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm"
      }
    },
    defaultVariants: {
      side: "right"
    }
  }
);
const _sfc_main = {
  __name: "dashboard",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_LayoutsSidebar = _sfc_main$4;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "grid min-h-screen w-full lg:grid-cols-[280px_1fr] relative" }, _attrs))}><div class="hidden lg:block bg-gray-800">`);
      _push(ssrRenderComponent(_component_LayoutsSidebar, {
        fixed_classes: "w-[280px]",
        class: "w-[280px] h-full",
        styles: { boxShadow: "rgba(0, 0, 0, 0.4) 0.25rem -0.5rem 1rem 0.1rem" }
      }, null, _parent));
      _push(`</div>`);
      _push(ssrRenderComponent(unref(_sfc_main$3), null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(_sfc_main$1), { "as-child": "" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(_sfc_main$g), {
                    variant: "outline",
                    size: "icon",
                    class: "shrink-0 lg:hidden fixed top-4 left-6 m-0"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(unref(Menu), { class: "size-5" }, null, _parent4, _scopeId3));
                        _push4(`<span class="sr-only"${_scopeId3}>Toggle navigation menu</span>`);
                      } else {
                        return [
                          createVNode(unref(Menu), { class: "size-5" }),
                          createVNode("span", { class: "sr-only" }, "Toggle navigation menu")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(_sfc_main$g), {
                      variant: "outline",
                      size: "icon",
                      class: "shrink-0 lg:hidden fixed top-4 left-6 m-0"
                    }, {
                      default: withCtx(() => [
                        createVNode(unref(Menu), { class: "size-5" }),
                        createVNode("span", { class: "sr-only" }, "Toggle navigation menu")
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(_sfc_main$2), {
              side: "left",
              class: "w-[300px] flex flex-col bg-gray-800 p-0 gap-0 border-r-0"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_LayoutsSidebar, {
                    fixed_classes: "w-[300px]",
                    class: "w-[300px]"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_LayoutsSidebar, {
                      fixed_classes: "w-[300px]",
                      class: "w-[300px]"
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(_sfc_main$1), { "as-child": "" }, {
                default: withCtx(() => [
                  createVNode(unref(_sfc_main$g), {
                    variant: "outline",
                    size: "icon",
                    class: "shrink-0 lg:hidden fixed top-4 left-6 m-0"
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(Menu), { class: "size-5" }),
                      createVNode("span", { class: "sr-only" }, "Toggle navigation menu")
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              createVNode(unref(_sfc_main$2), {
                side: "left",
                class: "w-[300px] flex flex-col bg-gray-800 p-0 gap-0 border-r-0"
              }, {
                default: withCtx(() => [
                  createVNode(_component_LayoutsSidebar, {
                    fixed_classes: "w-[300px]",
                    class: "w-[300px]"
                  })
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<section class="bg-gray-100 pt-10 lg:pt-0"><main class="w-full max-w-full lg:max-w-[900px] xl:max-w-[1000px] 2xl:max-w-[1200px] mx-auto p-6 gap-6">`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</main></section></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/dashboard.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=dashboard-CGmKHTRP.mjs.map
