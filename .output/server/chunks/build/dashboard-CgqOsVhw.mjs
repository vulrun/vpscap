import { _ as __nuxt_component_0 } from './nuxt-link-Cc8lKs-9.mjs';
import { _ as _sfc_main$a } from './Skeleton-DYetLY0s.mjs';
import { cva } from 'class-variance-authority';
import { _ as _sfc_main$9, c as cn } from './index-CBgozba7.mjs';
import { c as createAvatarInitials } from './helpers-Dzo_4TpY.mjs';
import { mergeProps, unref, defineComponent, withCtx, createVNode, toDisplayString, resolveDynamicComponent, createBlock, createTextVNode, openBlock, renderSlot, computed, ref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderSlot, ssrRenderAttr, ssrInterpolate, ssrRenderList, ssrRenderVNode, ssrRenderClass } from 'vue/server-renderer';
import { useForwardPropsEmits, DialogRoot, DialogTrigger, DialogPortal, DialogOverlay, DialogContent, DialogClose, AvatarRoot, AvatarImage, AvatarFallback } from 'radix-vue';
import { Menu, CpuIcon, ShieldCheckIcon, RssIcon, ComputerIcon, TerminalIcon, AirplayIcon, SwatchBookIcon, SettingsIcon, MonitorCheckIcon, GithubIcon, LogOutIcon } from 'lucide-vue-next';
import { e as useAppConfig, a as useRoute, f as useRuntimeConfig } from './server.mjs';
import { Cross2Icon } from '@radix-icons/vue';
import '../nitro/nitro.mjs';
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
import 'clsx';
import 'tailwind-merge';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';
import 'vue-router';
import 'vue-sonner';

const _sfc_main$8 = /* @__PURE__ */ defineComponent({
  __name: "Avatar",
  __ssrInlineRender: true,
  props: {
    class: {},
    size: { default: "sm" },
    shape: { default: "circle" }
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(AvatarRoot), mergeProps({
        class: unref(cn)(unref(avatarVariant)({ size: _ctx.size, shape: _ctx.shape }), props.class)
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
const _sfc_setup$8 = _sfc_main$8.setup;
_sfc_main$8.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/avatar/Avatar.vue");
  return _sfc_setup$8 ? _sfc_setup$8(props, ctx) : void 0;
};
const _sfc_main$7 = /* @__PURE__ */ defineComponent({
  __name: "AvatarFallback",
  __ssrInlineRender: true,
  props: {
    delayMs: {},
    asChild: { type: Boolean },
    as: { type: [String, Object, Function] }
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
const _sfc_setup$7 = _sfc_main$7.setup;
_sfc_main$7.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/avatar/AvatarFallback.vue");
  return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
const _sfc_main$6 = /* @__PURE__ */ defineComponent({
  __name: "AvatarImage",
  __ssrInlineRender: true,
  props: {
    src: {},
    referrerPolicy: {},
    asChild: { type: Boolean },
    as: { type: [String, Object, Function] }
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(AvatarImage), mergeProps(props, { class: "h-full w-full object-cover" }, _attrs), null, _parent));
    };
  }
});
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/avatar/AvatarImage.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
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
const _sfc_main$5 = {
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
      const _component_Skeleton = _sfc_main$a;
      const _component_Avatar = _sfc_main$8;
      const _component_AvatarImage = _sfc_main$6;
      const _component_AvatarFallback = _sfc_main$7;
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
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Layouts/AvatarDiv.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const _sfc_main$4 = {
  __name: "Sidebar",
  __ssrInlineRender: true,
  props: ["class", "styles", "fixed_classes"],
  setup(__props) {
    const props = __props;
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
      },
      {
        icon: SettingsIcon,
        label: "--settings",
        href: "/settings"
      }
    ].filter((i) => {
      var _a, _b;
      return ((_a = i == null ? void 0 : i.label) == null ? void 0 : _a.startsWith("--")) ? String((_b = config == null ? void 0 : config.public) == null ? void 0 : _b.appEnv).startsWith("dev") : true;
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      const _component_LayoutsAvatarDiv = _sfc_main$5;
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
      _push(`<!--]--></nav></div><div class="${ssrRenderClass(("cn" in _ctx ? _ctx.cn : unref(cn))("w-full fixed bottom-0 left-0 right-0 p-2", props == null ? void 0 : props.fixed_classes))}"><div class="z-50 min-w-56 overflow-hidden rounded-sm border-0 bg-gray-700 p-1 text-white shadow-inner"><div class="flex items-center px-1 py-1.5 text-left text-sm font-normal">`);
      _push(ssrRenderComponent(_component_LayoutsAvatarDiv, null, null, _parent));
      _push(`</div><div class="-mx-1 my-1 h-px bg-gray-800"></div>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/guide",
        class: "cursor-pointer relative flex select-none items-center rounded-sm gap-2 px-2 py-1 h-10 text-sm outline-none transition-colors hover:bg-gray-800 [&>svg]:size-4 [&>svg]:shrink-0"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(MonitorCheckIcon), null, null, _parent2, _scopeId));
            _push2(` Installation Guide `);
          } else {
            return [
              createVNode(unref(MonitorCheckIcon)),
              createTextVNode(" Installation Guide ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<a href="https://github.com/vulrun/vpscap" target="_blank" class="cursor-pointer relative flex select-none items-center rounded-sm gap-2 px-2 py-1 h-10 text-sm outline-none transition-colors hover:bg-gray-800 [&amp;&gt;svg]:size-4 [&amp;&gt;svg]:shrink-0">`);
      _push(ssrRenderComponent(unref(GithubIcon), { class: "size-4" }, null, _parent));
      _push(` Github </a><div class="cursor-pointer relative flex select-none items-center rounded-sm gap-2 px-2 py-1 h-10 text-sm outline-none transition-colors hover:bg-gray-800 [&amp;&gt;svg]:size-4 [&amp;&gt;svg]:shrink-0">`);
      _push(ssrRenderComponent(unref(LogOutIcon), null, null, _parent));
      _push(` Log out </div></div></div></div>`);
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
    class: {},
    side: {},
    forceMount: { type: Boolean },
    trapFocus: { type: Boolean },
    disableOutsidePointerEvents: { type: Boolean },
    asChild: { type: Boolean },
    as: { type: [String, Object, Function] }
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
              class: unref(cn)(unref(sheetVariants)({ side: _ctx.side }), props.class)
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
                class: unref(cn)(unref(sheetVariants)({ side: _ctx.side }), props.class)
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
    as: { type: [String, Object, Function] }
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
                  _push3(ssrRenderComponent(unref(_sfc_main$9), {
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
                    createVNode(unref(_sfc_main$9), {
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
                  createVNode(unref(_sfc_main$9), {
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
//# sourceMappingURL=dashboard-CgqOsVhw.mjs.map
