import { _ as _sfc_main$z } from './MainHeading-bajQKQtP.mjs';
import { mergeProps, withCtx, createTextVNode, unref, createVNode, h, createBlock, openBlock, useAttrs, defineComponent, renderSlot, toDisplayString, createCommentVNode, ref, isRef, withModifiers, computed, Fragment, renderList, resolveDynamicComponent, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderSlot, ssrInterpolate, ssrRenderList, ssrRenderClass, ssrRenderVNode, ssrRenderAttr } from 'vue/server-renderer';
import { TooltipProvider, useForwardPropsEmits, TooltipRoot, TooltipTrigger, TooltipPortal, TooltipContent, useForwardProps, DialogDescription, DialogClose, DropdownMenuRoot, DropdownMenuTrigger, DropdownMenuPortal, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem, DropdownMenuCheckboxItem, DropdownMenuItemIndicator } from 'radix-vue';
import { _ as _sfc_main$C, c as cn, v as valueUpdater } from './index-CBgozba7.mjs';
import { _ as _sfc_main$4$1, a as _sfc_main$D, b as _sfc_main$3$1, c as _sfc_main$2$1, d as _sfc_main$1$1 } from './DialogTrigger-C8LiYfR4.mjs';
import { D as DependencyType, _ as _sfc_main$E, a as _sfc_main$B$1, b as _sfc_main$e$1, c as _sfc_main$9$1, d as _sfc_main$8$1, e as _sfc_main$d$1, f as _sfc_main$c$1 } from './AutoForm-C_owl8I3.mjs';
import { s as sanitizeDomains, m as markdownToHtmlLite, d as delay } from './helpers-Dzo_4TpY.mjs';
import { z } from 'zod';
import { toast } from 'vue-sonner';
import { RefreshCwIcon, PlusIcon, ReplaceAllIcon, LoaderCircleIcon, Loader2Icon, XIcon, CircleFadingPlusIcon, CheckIcon, EllipsisIcon, ChevronsLeftIcon, ChevronLeftIcon, ChevronRightIcon, ChevronsRightIcon, FolderOpenIcon, FolderRootIcon, FolderSymlinkIcon, WifiZeroIcon, BinocularsIcon, ArrowDownIcon, ArrowUpIcon, ArrowDownUpIcon, DotIcon, FilePenLineIcon, TrashIcon, ToggleRightIcon, ToggleLeftIcon, Repeat1Icon, ShieldAlertIcon, ShieldCheckIcon } from 'lucide-vue-next';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { u as useApiFetch, a as useLocalRef, b as useApi, c as useSlotAsText } from './hooks--hR63Zme.mjs';
import { _ as _sfc_main$A } from './SimpleCard-DjYniZcs.mjs';
import { _ as _sfc_main$B } from './Skeleton-DYetLY0s.mjs';
import { _ as _sfc_main$F } from './Input-DZIpcJF6.mjs';
import { cva } from 'class-variance-authority';
import { CheckIcon as CheckIcon$1 } from '@radix-icons/vue';
import { useVueTable, getFacetedUniqueValues, getFacetedRowModel, getPaginationRowModel, getFilteredRowModel, getExpandedRowModel, getSortedRowModel, getCoreRowModel, FlexRender } from '@tanstack/vue-table';
import { _ as __nuxt_component_0 } from './nuxt-link-Cc8lKs-9.mjs';
import 'clsx';
import 'tailwind-merge';
import '@internationalized/date';
import '@vueuse/core';
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
import 'glob';
import 'node:url';
import 'bcryptjs';
import './server.mjs';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';
import 'vue-router';

const _sfc_main$y = /* @__PURE__ */ defineComponent({
  __name: "DialogClose",
  __ssrInlineRender: true,
  props: {
    asChild: { type: Boolean },
    as: { type: [String, Object, Function] }
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(DialogClose), mergeProps(props, _attrs), {
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
const _sfc_setup$y = _sfc_main$y.setup;
_sfc_main$y.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/dialog/DialogClose.vue");
  return _sfc_setup$y ? _sfc_setup$y(props, ctx) : void 0;
};
const _sfc_main$x = /* @__PURE__ */ defineComponent({
  __name: "DialogDescription",
  __ssrInlineRender: true,
  props: {
    asChild: { type: Boolean },
    as: { type: [String, Object, Function] },
    class: {}
  },
  setup(__props) {
    const props = __props;
    const delegatedProps = computed(() => {
      const { class: _, ...delegated } = props;
      return delegated;
    });
    const forwardedProps = useForwardProps(delegatedProps);
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(DialogDescription), mergeProps(unref(forwardedProps), {
        class: unref(cn)("text-sm text-muted-foreground", props.class)
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
const _sfc_setup$x = _sfc_main$x.setup;
_sfc_main$x.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/dialog/DialogDescription.vue");
  return _sfc_setup$x ? _sfc_setup$x(props, ctx) : void 0;
};
const _sfc_main$w = /* @__PURE__ */ defineComponent({
  __name: "DialogFooter",
  __ssrInlineRender: true,
  props: {
    class: {}
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: unref(cn)(
          "flex flex-col-reverse sm:flex-row sm:justify-end sm:gap-x-2",
          props.class
        )
      }, _attrs))}>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</div>`);
    };
  }
});
const _sfc_setup$w = _sfc_main$w.setup;
_sfc_main$w.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/dialog/DialogFooter.vue");
  return _sfc_setup$w ? _sfc_setup$w(props, ctx) : void 0;
};
const _sfc_main$v = /* @__PURE__ */ defineComponent({
  __name: "DropdownMenu",
  __ssrInlineRender: true,
  props: {
    defaultOpen: { type: Boolean },
    open: { type: Boolean },
    dir: {},
    modal: { type: Boolean }
  },
  emits: ["update:open"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const forwarded = useForwardPropsEmits(props, emits);
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(DropdownMenuRoot), mergeProps(unref(forwarded), _attrs), {
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
const _sfc_setup$v = _sfc_main$v.setup;
_sfc_main$v.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/dropdown-menu/DropdownMenu.vue");
  return _sfc_setup$v ? _sfc_setup$v(props, ctx) : void 0;
};
const _sfc_main$u = /* @__PURE__ */ defineComponent({
  __name: "DropdownMenuCheckboxItem",
  __ssrInlineRender: true,
  props: {
    checked: { type: [Boolean, String] },
    disabled: { type: Boolean },
    textValue: {},
    asChild: { type: Boolean },
    as: { type: [String, Object, Function] },
    class: {}
  },
  emits: ["select", "update:checked"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const delegatedProps = computed(() => {
      const { class: _, ...delegated } = props;
      return delegated;
    });
    const forwarded = useForwardPropsEmits(delegatedProps, emits);
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(DropdownMenuCheckboxItem), mergeProps(unref(forwarded), {
        class: unref(cn)(
          "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
          props.class
        )
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span class="absolute left-2 flex h-3.5 w-3.5 items-center justify-center"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(DropdownMenuItemIndicator), null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(CheckIcon$1), { class: "w-4 h-4" }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(CheckIcon$1), { class: "w-4 h-4" })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</span>`);
            ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent2, _scopeId);
          } else {
            return [
              createVNode("span", { class: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center" }, [
                createVNode(unref(DropdownMenuItemIndicator), null, {
                  default: withCtx(() => [
                    createVNode(unref(CheckIcon$1), { class: "w-4 h-4" })
                  ]),
                  _: 1
                })
              ]),
              renderSlot(_ctx.$slots, "default")
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
});
const _sfc_setup$u = _sfc_main$u.setup;
_sfc_main$u.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/dropdown-menu/DropdownMenuCheckboxItem.vue");
  return _sfc_setup$u ? _sfc_setup$u(props, ctx) : void 0;
};
const _sfc_main$t = /* @__PURE__ */ defineComponent({
  __name: "DropdownMenuContent",
  __ssrInlineRender: true,
  props: {
    forceMount: { type: Boolean },
    loop: { type: Boolean },
    side: {},
    sideOffset: { default: 4 },
    align: {},
    alignOffset: {},
    avoidCollisions: { type: Boolean },
    collisionBoundary: {},
    collisionPadding: {},
    arrowPadding: {},
    sticky: {},
    hideWhenDetached: { type: Boolean },
    updatePositionStrategy: {},
    prioritizePosition: { type: Boolean },
    asChild: { type: Boolean },
    as: {},
    class: {}
  },
  emits: ["escapeKeyDown", "pointerDownOutside", "focusOutside", "interactOutside", "closeAutoFocus"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const delegatedProps = computed(() => {
      const { class: _, ...delegated } = props;
      return delegated;
    });
    const forwarded = useForwardPropsEmits(delegatedProps, emits);
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(DropdownMenuPortal), _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(DropdownMenuContent), mergeProps(unref(forwarded), {
              class: unref(cn)("z-50 min-w-32 overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2", props.class)
            }), {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  ssrRenderSlot(_ctx.$slots, "default", {}, null, _push3, _parent3, _scopeId2);
                } else {
                  return [
                    renderSlot(_ctx.$slots, "default")
                  ];
                }
              }),
              _: 3
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(DropdownMenuContent), mergeProps(unref(forwarded), {
                class: unref(cn)("z-50 min-w-32 overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2", props.class)
              }), {
                default: withCtx(() => [
                  renderSlot(_ctx.$slots, "default")
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
const _sfc_setup$t = _sfc_main$t.setup;
_sfc_main$t.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/dropdown-menu/DropdownMenuContent.vue");
  return _sfc_setup$t ? _sfc_setup$t(props, ctx) : void 0;
};
const _sfc_main$s = /* @__PURE__ */ defineComponent({
  __name: "DropdownMenuItem",
  __ssrInlineRender: true,
  props: {
    disabled: { type: Boolean },
    textValue: {},
    asChild: { type: Boolean },
    as: { type: [String, Object, Function] },
    class: {},
    inset: { type: Boolean }
  },
  setup(__props) {
    const props = __props;
    const delegatedProps = computed(() => {
      const { class: _, ...delegated } = props;
      return delegated;
    });
    const forwardedProps = useForwardProps(delegatedProps);
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(DropdownMenuItem), mergeProps(unref(forwardedProps), {
        class: unref(cn)(
          "relative flex cursor-default select-none items-center rounded-sm gap-2 px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50  [&>svg]:size-4 [&>svg]:shrink-0",
          _ctx.inset && "pl-8",
          props.class
        )
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
const _sfc_setup$s = _sfc_main$s.setup;
_sfc_main$s.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/dropdown-menu/DropdownMenuItem.vue");
  return _sfc_setup$s ? _sfc_setup$s(props, ctx) : void 0;
};
const _sfc_main$r = /* @__PURE__ */ defineComponent({
  __name: "DropdownMenuLabel",
  __ssrInlineRender: true,
  props: {
    asChild: { type: Boolean },
    as: { type: [String, Object, Function] },
    class: {},
    inset: { type: Boolean }
  },
  setup(__props) {
    const props = __props;
    const delegatedProps = computed(() => {
      const { class: _, ...delegated } = props;
      return delegated;
    });
    const forwardedProps = useForwardProps(delegatedProps);
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(DropdownMenuLabel), mergeProps(unref(forwardedProps), {
        class: unref(cn)("px-2 py-1.5 text-sm font-semibold", _ctx.inset && "pl-8", props.class)
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
const _sfc_setup$r = _sfc_main$r.setup;
_sfc_main$r.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/dropdown-menu/DropdownMenuLabel.vue");
  return _sfc_setup$r ? _sfc_setup$r(props, ctx) : void 0;
};
const _sfc_main$q = /* @__PURE__ */ defineComponent({
  __name: "DropdownMenuSeparator",
  __ssrInlineRender: true,
  props: {
    asChild: { type: Boolean },
    as: { type: [String, Object, Function] },
    class: {}
  },
  setup(__props) {
    const props = __props;
    const delegatedProps = computed(() => {
      const { class: _, ...delegated } = props;
      return delegated;
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(DropdownMenuSeparator), mergeProps(delegatedProps.value, {
        class: unref(cn)("-mx-1 my-1 h-px bg-muted", props.class)
      }, _attrs), null, _parent));
    };
  }
});
const _sfc_setup$q = _sfc_main$q.setup;
_sfc_main$q.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/dropdown-menu/DropdownMenuSeparator.vue");
  return _sfc_setup$q ? _sfc_setup$q(props, ctx) : void 0;
};
const _sfc_main$p = /* @__PURE__ */ defineComponent({
  __name: "DropdownMenuTrigger",
  __ssrInlineRender: true,
  props: {
    disabled: { type: Boolean },
    asChild: { type: Boolean },
    as: { type: [String, Object, Function] }
  },
  setup(__props) {
    const props = __props;
    const forwardedProps = useForwardProps(props);
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(DropdownMenuTrigger), mergeProps({ class: "outline-none" }, unref(forwardedProps), _attrs), {
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
const _sfc_setup$p = _sfc_main$p.setup;
_sfc_main$p.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/dropdown-menu/DropdownMenuTrigger.vue");
  return _sfc_setup$p ? _sfc_setup$p(props, ctx) : void 0;
};
const _sfc_main$o = {
  __name: "ColumnHeader",
  __ssrInlineRender: true,
  props: ["column", "title"],
  setup(__props) {
    const attrs = useAttrs();
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      if (!__props.column.getCanSort()) {
        _push(`<div${ssrRenderAttrs(mergeProps({
          class: unref(attrs).class
        }, _attrs))}>${ssrInterpolate(__props.title)}</div>`);
      } else {
        _push(`<div${ssrRenderAttrs(mergeProps({
          class: unref(cn)("flex items-center space-x-2", (_a = unref(attrs).class) != null ? _a : "")
        }, _attrs))}>`);
        _push(ssrRenderComponent(unref(_sfc_main$v), null, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(_sfc_main$p), { "as-child": "" }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(unref(_sfc_main$C), {
                      variant: "ghost",
                      size: "sm",
                      class: "-ml-3 h-8 data-[state=open]:bg-accent"
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`<span${_scopeId3}>${ssrInterpolate(__props.title)}</span>`);
                          if (__props.column.getIsSorted() === "desc") {
                            _push4(ssrRenderComponent(unref(ArrowDownIcon), { class: "ml-2 h-4 w-4" }, null, _parent4, _scopeId3));
                          } else if (__props.column.getIsSorted() === "asc") {
                            _push4(ssrRenderComponent(unref(ArrowUpIcon), { class: "ml-2 h-4 w-4" }, null, _parent4, _scopeId3));
                          } else {
                            _push4(ssrRenderComponent(unref(ArrowDownUpIcon), { class: "ml-2 h-4 w-4" }, null, _parent4, _scopeId3));
                          }
                        } else {
                          return [
                            createVNode("span", null, toDisplayString(__props.title), 1),
                            __props.column.getIsSorted() === "desc" ? (openBlock(), createBlock(unref(ArrowDownIcon), {
                              key: 0,
                              class: "ml-2 h-4 w-4"
                            })) : __props.column.getIsSorted() === "asc" ? (openBlock(), createBlock(unref(ArrowUpIcon), {
                              key: 1,
                              class: "ml-2 h-4 w-4"
                            })) : (openBlock(), createBlock(unref(ArrowDownUpIcon), {
                              key: 2,
                              class: "ml-2 h-4 w-4"
                            }))
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(unref(_sfc_main$C), {
                        variant: "ghost",
                        size: "sm",
                        class: "-ml-3 h-8 data-[state=open]:bg-accent"
                      }, {
                        default: withCtx(() => [
                          createVNode("span", null, toDisplayString(__props.title), 1),
                          __props.column.getIsSorted() === "desc" ? (openBlock(), createBlock(unref(ArrowDownIcon), {
                            key: 0,
                            class: "ml-2 h-4 w-4"
                          })) : __props.column.getIsSorted() === "asc" ? (openBlock(), createBlock(unref(ArrowUpIcon), {
                            key: 1,
                            class: "ml-2 h-4 w-4"
                          })) : (openBlock(), createBlock(unref(ArrowDownUpIcon), {
                            key: 2,
                            class: "ml-2 h-4 w-4"
                          }))
                        ]),
                        _: 1
                      })
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(unref(_sfc_main$t), { align: "start" }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(unref(_sfc_main$s), {
                      onClick: ($event) => __props.column.toggleSorting(false)
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(unref(ArrowUpIcon), { class: "mr-2 h-3.5 w-3.5 text-muted-foreground/70" }, null, _parent4, _scopeId3));
                          _push4(` Asc `);
                        } else {
                          return [
                            createVNode(unref(ArrowUpIcon), { class: "mr-2 h-3.5 w-3.5 text-muted-foreground/70" }),
                            createTextVNode(" Asc ")
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(unref(_sfc_main$s), {
                      onClick: ($event) => __props.column.toggleSorting(true)
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(unref(ArrowDownIcon), { class: "mr-2 h-3.5 w-3.5 text-muted-foreground/70" }, null, _parent4, _scopeId3));
                          _push4(` Desc `);
                        } else {
                          return [
                            createVNode(unref(ArrowDownIcon), { class: "mr-2 h-3.5 w-3.5 text-muted-foreground/70" }),
                            createTextVNode(" Desc ")
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(unref(_sfc_main$s), {
                        onClick: withModifiers(($event) => __props.column.toggleSorting(false), ["prevent"])
                      }, {
                        default: withCtx(() => [
                          createVNode(unref(ArrowUpIcon), { class: "mr-2 h-3.5 w-3.5 text-muted-foreground/70" }),
                          createTextVNode(" Asc ")
                        ]),
                        _: 1
                      }, 8, ["onClick"]),
                      createVNode(unref(_sfc_main$s), {
                        onClick: withModifiers(($event) => __props.column.toggleSorting(true), ["prevent"])
                      }, {
                        default: withCtx(() => [
                          createVNode(unref(ArrowDownIcon), { class: "mr-2 h-3.5 w-3.5 text-muted-foreground/70" }),
                          createTextVNode(" Desc ")
                        ]),
                        _: 1
                      }, 8, ["onClick"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              return [
                createVNode(unref(_sfc_main$p), { "as-child": "" }, {
                  default: withCtx(() => [
                    createVNode(unref(_sfc_main$C), {
                      variant: "ghost",
                      size: "sm",
                      class: "-ml-3 h-8 data-[state=open]:bg-accent"
                    }, {
                      default: withCtx(() => [
                        createVNode("span", null, toDisplayString(__props.title), 1),
                        __props.column.getIsSorted() === "desc" ? (openBlock(), createBlock(unref(ArrowDownIcon), {
                          key: 0,
                          class: "ml-2 h-4 w-4"
                        })) : __props.column.getIsSorted() === "asc" ? (openBlock(), createBlock(unref(ArrowUpIcon), {
                          key: 1,
                          class: "ml-2 h-4 w-4"
                        })) : (openBlock(), createBlock(unref(ArrowDownUpIcon), {
                          key: 2,
                          class: "ml-2 h-4 w-4"
                        }))
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                }),
                createVNode(unref(_sfc_main$t), { align: "start" }, {
                  default: withCtx(() => [
                    createVNode(unref(_sfc_main$s), {
                      onClick: withModifiers(($event) => __props.column.toggleSorting(false), ["prevent"])
                    }, {
                      default: withCtx(() => [
                        createVNode(unref(ArrowUpIcon), { class: "mr-2 h-3.5 w-3.5 text-muted-foreground/70" }),
                        createTextVNode(" Asc ")
                      ]),
                      _: 1
                    }, 8, ["onClick"]),
                    createVNode(unref(_sfc_main$s), {
                      onClick: withModifiers(($event) => __props.column.toggleSorting(true), ["prevent"])
                    }, {
                      default: withCtx(() => [
                        createVNode(unref(ArrowDownIcon), { class: "mr-2 h-3.5 w-3.5 text-muted-foreground/70" }),
                        createTextVNode(" Desc ")
                      ]),
                      _: 1
                    }, 8, ["onClick"])
                  ]),
                  _: 1
                })
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      }
    };
  }
};
const _sfc_setup$o = _sfc_main$o.setup;
_sfc_main$o.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/DataTable/ColumnHeader.vue");
  return _sfc_setup$o ? _sfc_setup$o(props, ctx) : void 0;
};
const _sfc_main$n = /* @__PURE__ */ defineComponent({
  __name: "Tooltip",
  __ssrInlineRender: true,
  props: {
    defaultOpen: { type: Boolean },
    open: { type: Boolean },
    delayDuration: {},
    disableHoverableContent: { type: Boolean },
    disableClosingTrigger: { type: Boolean },
    disabled: { type: Boolean },
    ignoreNonKeyboardFocus: { type: Boolean }
  },
  emits: ["update:open"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const forwarded = useForwardPropsEmits(props, emits);
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(TooltipRoot), mergeProps(unref(forwarded), _attrs), {
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
const _sfc_setup$n = _sfc_main$n.setup;
_sfc_main$n.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/tooltip/Tooltip.vue");
  return _sfc_setup$n ? _sfc_setup$n(props, ctx) : void 0;
};
const _sfc_main$m = /* @__PURE__ */ defineComponent({
  ...{
    inheritAttrs: false
  },
  __name: "TooltipContent",
  __ssrInlineRender: true,
  props: {
    forceMount: { type: Boolean },
    ariaLabel: {},
    asChild: { type: Boolean },
    as: {},
    side: {},
    sideOffset: { default: 4 },
    align: {},
    alignOffset: {},
    avoidCollisions: { type: Boolean },
    collisionBoundary: {},
    collisionPadding: {},
    arrowPadding: {},
    sticky: {},
    hideWhenDetached: { type: Boolean },
    class: {}
  },
  emits: ["escapeKeyDown", "pointerDownOutside"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const delegatedProps = computed(() => {
      const { class: _, ...delegated } = props;
      return delegated;
    });
    const forwarded = useForwardPropsEmits(delegatedProps, emits);
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(TooltipPortal), _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(TooltipContent), mergeProps({ ...unref(forwarded), ..._ctx.$attrs }, {
              class: unref(cn)("z-50 overflow-hidden rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2", props.class)
            }), {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  ssrRenderSlot(_ctx.$slots, "default", {}, null, _push3, _parent3, _scopeId2);
                } else {
                  return [
                    renderSlot(_ctx.$slots, "default")
                  ];
                }
              }),
              _: 3
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(TooltipContent), mergeProps({ ...unref(forwarded), ..._ctx.$attrs }, {
                class: unref(cn)("z-50 overflow-hidden rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2", props.class)
              }), {
                default: withCtx(() => [
                  renderSlot(_ctx.$slots, "default")
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
const _sfc_setup$m = _sfc_main$m.setup;
_sfc_main$m.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/tooltip/TooltipContent.vue");
  return _sfc_setup$m ? _sfc_setup$m(props, ctx) : void 0;
};
const _sfc_main$l = /* @__PURE__ */ defineComponent({
  __name: "TooltipProvider",
  __ssrInlineRender: true,
  props: {
    delayDuration: {},
    skipDelayDuration: {},
    disableHoverableContent: { type: Boolean },
    disableClosingTrigger: { type: Boolean },
    disabled: { type: Boolean },
    ignoreNonKeyboardFocus: { type: Boolean }
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(TooltipProvider), mergeProps(props, _attrs), {
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
const _sfc_setup$l = _sfc_main$l.setup;
_sfc_main$l.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/tooltip/TooltipProvider.vue");
  return _sfc_setup$l ? _sfc_setup$l(props, ctx) : void 0;
};
const _sfc_main$k = /* @__PURE__ */ defineComponent({
  __name: "TooltipTrigger",
  __ssrInlineRender: true,
  props: {
    asChild: { type: Boolean },
    as: { type: [String, Object, Function] }
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(TooltipTrigger), mergeProps(props, _attrs), {
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
const _sfc_setup$k = _sfc_main$k.setup;
_sfc_main$k.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/tooltip/TooltipTrigger.vue");
  return _sfc_setup$k ? _sfc_setup$k(props, ctx) : void 0;
};
const _sfc_main$j = {
  __name: "HintButton",
  __ssrInlineRender: true,
  setup(__props) {
    const { title, ...attrs } = useAttrs();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_TooltipProvider = _sfc_main$l;
      const _component_Tooltip = _sfc_main$n;
      const _component_TooltipTrigger = _sfc_main$k;
      const _component_Button = _sfc_main$C;
      const _component_TooltipContent = _sfc_main$m;
      _push(ssrRenderComponent(_component_TooltipProvider, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_Tooltip, null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_TooltipTrigger, { "as-child": "" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_Button, attrs, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              ssrRenderSlot(_ctx.$slots, "default", {}, null, _push5, _parent5, _scopeId4);
                            } else {
                              return [
                                renderSlot(_ctx.$slots, "default")
                              ];
                            }
                          }),
                          _: 3
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_Button, attrs, {
                            default: withCtx(() => [
                              renderSlot(_ctx.$slots, "default")
                            ]),
                            _: 3
                          }, 16)
                        ];
                      }
                    }),
                    _: 3
                  }, _parent3, _scopeId2));
                  if (unref(title)) {
                    _push3(ssrRenderComponent(_component_TooltipContent, null, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`${ssrInterpolate(unref(title))}`);
                        } else {
                          return [
                            createTextVNode(toDisplayString(unref(title)), 1)
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                  } else {
                    _push3(`<!---->`);
                  }
                } else {
                  return [
                    createVNode(_component_TooltipTrigger, { "as-child": "" }, {
                      default: withCtx(() => [
                        createVNode(_component_Button, attrs, {
                          default: withCtx(() => [
                            renderSlot(_ctx.$slots, "default")
                          ]),
                          _: 3
                        }, 16)
                      ]),
                      _: 3
                    }),
                    unref(title) ? (openBlock(), createBlock(_component_TooltipContent, { key: 0 }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(unref(title)), 1)
                      ]),
                      _: 1
                    })) : createCommentVNode("", true)
                  ];
                }
              }),
              _: 3
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_Tooltip, null, {
                default: withCtx(() => [
                  createVNode(_component_TooltipTrigger, { "as-child": "" }, {
                    default: withCtx(() => [
                      createVNode(_component_Button, attrs, {
                        default: withCtx(() => [
                          renderSlot(_ctx.$slots, "default")
                        ]),
                        _: 3
                      }, 16)
                    ]),
                    _: 3
                  }),
                  unref(title) ? (openBlock(), createBlock(_component_TooltipContent, { key: 0 }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(unref(title)), 1)
                    ]),
                    _: 1
                  })) : createCommentVNode("", true)
                ]),
                _: 3
              })
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
};
const _sfc_setup$j = _sfc_main$j.setup;
_sfc_main$j.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/HintButton.vue");
  return _sfc_setup$j ? _sfc_setup$j(props, ctx) : void 0;
};
const _sfc_main$i = {
  __name: "RotatingText",
  __ssrInlineRender: true,
  props: ["class", "delay", "values"],
  setup(__props) {
    const props = __props;
    const values = ref([]);
    const currentIndex = ref(0);
    ref((props == null ? void 0 : props.delay) || 400);
    ref(null);
    return (_ctx, _push, _parent, _attrs) => {
      if (unref(values).length > 0) {
        _push(`<div${ssrRenderAttrs(mergeProps({
          class: unref(cn)("", props.class)
        }, _attrs))}><span>${ssrInterpolate(unref(values)[unref(currentIndex)])}</span></div>`);
      } else {
        _push(`<div${ssrRenderAttrs(mergeProps({
          class: unref(cn)("", props.class)
        }, _attrs))}>`);
        ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
        _push(`</div>`);
      }
    };
  }
};
const _sfc_setup$i = _sfc_main$i.setup;
_sfc_main$i.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/RotatingText.vue");
  return _sfc_setup$i ? _sfc_setup$i(props, ctx) : void 0;
};
const _sfc_main$h = {
  __name: "ConfirmAction",
  __ssrInlineRender: true,
  props: ["class", "actionPayload", "action", "disabled", "asChild", "title", "description"],
  emits: ["update:list"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const errors = ref([]);
    const isSubmitting = ref(false);
    const dialogOpen = ref(false);
    async function onSubmit() {
      try {
        errors.value = [];
        isSubmitting.value = true;
        const resp = await useApi(`/api/action/${props == null ? void 0 : props.action}`, { method: "POST", body: (props == null ? void 0 : props.actionPayload) || {} });
        emits("update:list", resp);
        toast((resp == null ? void 0 : resp.message) || resp);
        await delay(400);
        isSubmitting.value = false;
        dialogOpen.value = false;
      } catch (error) {
        isSubmitting.value = false;
        errors.value = [error == null ? void 0 : error.message];
        toast((error == null ? void 0 : error.message) || "oops, something went wrong");
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Dialog = _sfc_main$4$1;
      const _component_DialogTrigger = _sfc_main$D;
      const _component_DialogContent = _sfc_main$3$1;
      const _component_DialogTitle = _sfc_main$1$1;
      const _component_DialogFooter = _sfc_main$w;
      const _component_RotatingText = _sfc_main$i;
      const _component_Button = _sfc_main$C;
      _push(ssrRenderComponent(_component_Dialog, mergeProps({
        open: unref(dialogOpen),
        "onUpdate:open": ($event) => isRef(dialogOpen) ? dialogOpen.value = $event : null
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_DialogTrigger, mergeProps({
              class: ("cn" in _ctx ? _ctx.cn : unref(cn))(props == null ? void 0 : props.class),
              disabled: props == null ? void 0 : props.disabled
            }, { asChild: props == null ? void 0 : props.asChild }), {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  ssrRenderSlot(_ctx.$slots, "default", {}, null, _push3, _parent3, _scopeId2);
                } else {
                  return [
                    renderSlot(_ctx.$slots, "default")
                  ];
                }
              }),
              _: 3
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_DialogContent, {
              class: "space-y-0 [&_button.absolute]:hidden",
              disableOutsidePointerEvents: true
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_DialogTitle, { class: "leading-normal tracking-normal" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`${ssrInterpolate((props == null ? void 0 : props.title) || "Are you absolutely sure?")}`);
                      } else {
                        return [
                          createTextVNode(toDisplayString((props == null ? void 0 : props.title) || "Are you absolutely sure?"), 1)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`<div class="text-justify text-sm text-muted-foreground leading-5"${_scopeId2}>${(props == null ? void 0 : props.description) || "Warning: These changes are permanent. Once you hit <b>Continue</b>, there's no undo button. Think twice before you act!"}</div>`);
                  _push3(ssrRenderComponent(_component_DialogFooter, { class: "flex gap-2 pt-4" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        if (unref(isSubmitting)) {
                          _push4(ssrRenderComponent(_component_RotatingText, {
                            delay: 2e3,
                            class: "text-sm font-medium text-green-700"
                          }, null, _parent4, _scopeId3));
                        } else if (unref(errors).length > 0) {
                          _push4(`<span class="text-sm font-medium text-red-600"${_scopeId3}>${ssrInterpolate(unref(errors).join(" "))}</span>`);
                        } else {
                          _push4(`<!---->`);
                        }
                        _push4(`<i class="mx-auto"${_scopeId3}></i>`);
                        _push4(ssrRenderComponent(_component_Button, {
                          type: "button",
                          variant: "secondary",
                          class: "border border-gray-300",
                          onClick: ($event) => dialogOpen.value = false
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`Cancel`);
                            } else {
                              return [
                                createTextVNode("Cancel")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        if (!unref(isSubmitting)) {
                          _push4(ssrRenderComponent(_component_Button, {
                            type: "button",
                            variant: "primary",
                            class: "bg-gray-800 text-white",
                            onClick: onSubmit
                          }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`Continue`);
                              } else {
                                return [
                                  createTextVNode("Continue")
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                        } else {
                          _push4(ssrRenderComponent(_component_Button, {
                            disabled: "",
                            variant: "primary",
                            class: "relative bg-gray-800 text-white"
                          }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`<i class="opacity-0"${_scopeId4}>Continue</i>`);
                                _push5(ssrRenderComponent(unref(Loader2Icon), { class: "size-4 animate-spin absolute" }, null, _parent5, _scopeId4));
                              } else {
                                return [
                                  createVNode("i", { class: "opacity-0" }, "Continue"),
                                  createVNode(unref(Loader2Icon), { class: "size-4 animate-spin absolute" })
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                        }
                      } else {
                        return [
                          unref(isSubmitting) ? (openBlock(), createBlock(_component_RotatingText, {
                            key: 0,
                            delay: 2e3,
                            class: "text-sm font-medium text-green-700"
                          })) : unref(errors).length > 0 ? (openBlock(), createBlock("span", {
                            key: 1,
                            class: "text-sm font-medium text-red-600"
                          }, toDisplayString(unref(errors).join(" ")), 1)) : createCommentVNode("", true),
                          createVNode("i", { class: "mx-auto" }),
                          createVNode(_component_Button, {
                            type: "button",
                            variant: "secondary",
                            class: "border border-gray-300",
                            onClick: withModifiers(($event) => dialogOpen.value = false, ["prevent"])
                          }, {
                            default: withCtx(() => [
                              createTextVNode("Cancel")
                            ]),
                            _: 1
                          }, 8, ["onClick"]),
                          !unref(isSubmitting) ? (openBlock(), createBlock(_component_Button, {
                            key: 2,
                            type: "button",
                            variant: "primary",
                            class: "bg-gray-800 text-white",
                            onClick: withModifiers(onSubmit, ["prevent"])
                          }, {
                            default: withCtx(() => [
                              createTextVNode("Continue")
                            ]),
                            _: 1
                          })) : (openBlock(), createBlock(_component_Button, {
                            key: 3,
                            disabled: "",
                            variant: "primary",
                            class: "relative bg-gray-800 text-white"
                          }, {
                            default: withCtx(() => [
                              createVNode("i", { class: "opacity-0" }, "Continue"),
                              createVNode(unref(Loader2Icon), { class: "size-4 animate-spin absolute" })
                            ]),
                            _: 1
                          }))
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_DialogTitle, { class: "leading-normal tracking-normal" }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString((props == null ? void 0 : props.title) || "Are you absolutely sure?"), 1)
                      ]),
                      _: 1
                    }),
                    createVNode("div", {
                      class: "text-justify text-sm text-muted-foreground leading-5",
                      innerHTML: (props == null ? void 0 : props.description) || "Warning: These changes are permanent. Once you hit <b>Continue</b>, there's no undo button. Think twice before you act!"
                    }, null, 8, ["innerHTML"]),
                    createVNode(_component_DialogFooter, { class: "flex gap-2 pt-4" }, {
                      default: withCtx(() => [
                        unref(isSubmitting) ? (openBlock(), createBlock(_component_RotatingText, {
                          key: 0,
                          delay: 2e3,
                          class: "text-sm font-medium text-green-700"
                        })) : unref(errors).length > 0 ? (openBlock(), createBlock("span", {
                          key: 1,
                          class: "text-sm font-medium text-red-600"
                        }, toDisplayString(unref(errors).join(" ")), 1)) : createCommentVNode("", true),
                        createVNode("i", { class: "mx-auto" }),
                        createVNode(_component_Button, {
                          type: "button",
                          variant: "secondary",
                          class: "border border-gray-300",
                          onClick: withModifiers(($event) => dialogOpen.value = false, ["prevent"])
                        }, {
                          default: withCtx(() => [
                            createTextVNode("Cancel")
                          ]),
                          _: 1
                        }, 8, ["onClick"]),
                        !unref(isSubmitting) ? (openBlock(), createBlock(_component_Button, {
                          key: 2,
                          type: "button",
                          variant: "primary",
                          class: "bg-gray-800 text-white",
                          onClick: withModifiers(onSubmit, ["prevent"])
                        }, {
                          default: withCtx(() => [
                            createTextVNode("Continue")
                          ]),
                          _: 1
                        })) : (openBlock(), createBlock(_component_Button, {
                          key: 3,
                          disabled: "",
                          variant: "primary",
                          class: "relative bg-gray-800 text-white"
                        }, {
                          default: withCtx(() => [
                            createVNode("i", { class: "opacity-0" }, "Continue"),
                            createVNode(unref(Loader2Icon), { class: "size-4 animate-spin absolute" })
                          ]),
                          _: 1
                        }))
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_DialogTrigger, mergeProps({
                class: ("cn" in _ctx ? _ctx.cn : unref(cn))(props == null ? void 0 : props.class),
                disabled: props == null ? void 0 : props.disabled
              }, { asChild: props == null ? void 0 : props.asChild }), {
                default: withCtx(() => [
                  renderSlot(_ctx.$slots, "default")
                ]),
                _: 3
              }, 16, ["class", "disabled"]),
              createVNode(_component_DialogContent, {
                class: "space-y-0 [&_button.absolute]:hidden",
                disableOutsidePointerEvents: true
              }, {
                default: withCtx(() => [
                  createVNode(_component_DialogTitle, { class: "leading-normal tracking-normal" }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString((props == null ? void 0 : props.title) || "Are you absolutely sure?"), 1)
                    ]),
                    _: 1
                  }),
                  createVNode("div", {
                    class: "text-justify text-sm text-muted-foreground leading-5",
                    innerHTML: (props == null ? void 0 : props.description) || "Warning: These changes are permanent. Once you hit <b>Continue</b>, there's no undo button. Think twice before you act!"
                  }, null, 8, ["innerHTML"]),
                  createVNode(_component_DialogFooter, { class: "flex gap-2 pt-4" }, {
                    default: withCtx(() => [
                      unref(isSubmitting) ? (openBlock(), createBlock(_component_RotatingText, {
                        key: 0,
                        delay: 2e3,
                        class: "text-sm font-medium text-green-700"
                      })) : unref(errors).length > 0 ? (openBlock(), createBlock("span", {
                        key: 1,
                        class: "text-sm font-medium text-red-600"
                      }, toDisplayString(unref(errors).join(" ")), 1)) : createCommentVNode("", true),
                      createVNode("i", { class: "mx-auto" }),
                      createVNode(_component_Button, {
                        type: "button",
                        variant: "secondary",
                        class: "border border-gray-300",
                        onClick: withModifiers(($event) => dialogOpen.value = false, ["prevent"])
                      }, {
                        default: withCtx(() => [
                          createTextVNode("Cancel")
                        ]),
                        _: 1
                      }, 8, ["onClick"]),
                      !unref(isSubmitting) ? (openBlock(), createBlock(_component_Button, {
                        key: 2,
                        type: "button",
                        variant: "primary",
                        class: "bg-gray-800 text-white",
                        onClick: withModifiers(onSubmit, ["prevent"])
                      }, {
                        default: withCtx(() => [
                          createTextVNode("Continue")
                        ]),
                        _: 1
                      })) : (openBlock(), createBlock(_component_Button, {
                        key: 3,
                        disabled: "",
                        variant: "primary",
                        class: "relative bg-gray-800 text-white"
                      }, {
                        default: withCtx(() => [
                          createVNode("i", { class: "opacity-0" }, "Continue"),
                          createVNode(unref(Loader2Icon), { class: "size-4 animate-spin absolute" })
                        ]),
                        _: 1
                      }))
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
};
const _sfc_setup$h = _sfc_main$h.setup;
_sfc_main$h.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ConfirmAction.vue");
  return _sfc_setup$h ? _sfc_setup$h(props, ctx) : void 0;
};
const _sfc_main$g = {
  __name: "Editor",
  __ssrInlineRender: true,
  props: ["class", "disabled", "conf", "asChild"],
  emits: ["update:list"],
  setup(__props, { emit: __emit }) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m;
    const emits = __emit;
    const props = __props;
    const conf = ref(props == null ? void 0 : props.conf);
    const isEdit = !!((_a = conf == null ? void 0 : conf.value) == null ? void 0 : _a.confId);
    const errors = ref([]);
    const dialogOpen = ref(false);
    const isSubmitting = ref(false);
    const configTypes = ["serve", "proxy", "redirect"];
    const AddSiteConfSchema = z.object({
      confType: z.enum(configTypes).describe("Configuration Type").default(configTypes == null ? void 0 : configTypes[0]),
      domain: z.string().trim().describe("Domains & Aliases").refine((val) => sanitizeDomains(val).length, { message: "Domains must be in valid format" }),
      target: z.string().trim().min(10).describe("Target Location"),
      enableIndexing: z.boolean().default(false).describe("Enable Auto Indexing")
    });
    const EditSiteConfSchema = z.object({
      confType: z.enum(configTypes).describe("Configuration Type").default(configTypes == null ? void 0 : configTypes[0]),
      domain: z.string().trim().describe("Domains & Aliases").refine((val) => sanitizeDomains(val).length, { message: "Domains must be in valid format" }),
      target: z.string().trim().min(10).describe("Target Location"),
      enableIndexing: z.boolean().default(false).describe("Enable Auto Indexing"),
      enableSSL: z.boolean().default(false).describe("Enable SSL"),
      forceSSL: z.boolean().default(false).describe("Force SSL")
    });
    const SiteConfSchema = isEdit ? EditSiteConfSchema : AddSiteConfSchema;
    const dependencies = [
      {
        sourceField: "confType",
        targetField: "confType",
        type: DependencyType.HIDES,
        when: () => {
          var _a2;
          return (_a2 = conf == null ? void 0 : conf.value) == null ? void 0 : _a2.isDefault;
        }
      },
      {
        sourceField: "confType",
        targetField: "enableIndexing",
        type: DependencyType.HIDES,
        when: (confType) => confType !== "serve"
      },
      {
        sourceField: "enableSSL",
        targetField: "forceSSL",
        type: DependencyType.HIDES,
        when: (enableSSL) => enableSSL === false
      }
    ];
    const fieldConfig = {
      enableIndexing: { component: "switch", label: (_e = (_d = (_c = (_b = SiteConfSchema == null ? void 0 : SiteConfSchema._getCached()) == null ? void 0 : _b.shape) == null ? void 0 : _c.enableIndexing) == null ? void 0 : _d._def) == null ? void 0 : _e.description },
      enableSSL: { component: "switch", label: (_i = (_h = (_g = (_f = SiteConfSchema == null ? void 0 : SiteConfSchema._getCached()) == null ? void 0 : _f.shape) == null ? void 0 : _g.enableSSL) == null ? void 0 : _h._def) == null ? void 0 : _i.description },
      forceSSL: { component: "switch", label: (_m = (_l = (_k = (_j = SiteConfSchema == null ? void 0 : SiteConfSchema._getCached()) == null ? void 0 : _j.shape) == null ? void 0 : _k.forceSSL) == null ? void 0 : _l._def) == null ? void 0 : _m.description }
    };
    const form = useForm({
      validationSchema: toTypedSchema(SiteConfSchema),
      validateOnMount: isEdit,
      keepValuesOnUnmount: isEdit
    });
    async function onSubmit(formData) {
      var _a2;
      try {
        errors.value = [];
        isSubmitting.value = true;
        const body = { id: (_a2 = conf == null ? void 0 : conf.value) == null ? void 0 : _a2.confId, ...formData };
        const resp = await useApi(`/api/action/${isEdit ? "updateSite" : "createSite"}`, { method: "POST", body });
        emits("update:list");
        toast((resp == null ? void 0 : resp.message) || resp);
        await delay(400);
        isSubmitting.value = false;
        dialogOpen.value = false;
      } catch (error) {
        isSubmitting.value = false;
        errors.value = [error == null ? void 0 : error.message];
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Dialog = _sfc_main$4$1;
      const _component_DialogTrigger = _sfc_main$D;
      const _component_Button = _sfc_main$C;
      const _component_DialogContent = _sfc_main$3$1;
      const _component_DialogHeader = _sfc_main$2$1;
      const _component_DialogTitle = _sfc_main$1$1;
      const _component_DialogDescription = _sfc_main$x;
      const _component_AutoForm = _sfc_main$E;
      const _component_DialogFooter = _sfc_main$w;
      const _component_RotatingText = _sfc_main$i;
      const _component_DialogClose = _sfc_main$y;
      _push(ssrRenderComponent(_component_Dialog, mergeProps({
        open: unref(dialogOpen),
        "onUpdate:open": ($event) => isRef(dialogOpen) ? dialogOpen.value = $event : null
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_DialogTrigger, { class: props == null ? void 0 : props.class, disabled: props == null ? void 0 : props.disabled, asChild: props == null ? void 0 : props.asChild }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  ssrRenderSlot(_ctx.$slots, "default", {}, () => {
                    _push3(ssrRenderComponent(_component_Button, {
                      class: "ml-2",
                      variant: "outline"
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`Add`);
                        } else {
                          return [
                            createTextVNode("Add")
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                  }, _push3, _parent3, _scopeId2);
                } else {
                  return [
                    renderSlot(_ctx.$slots, "default", {}, () => [
                      createVNode(_component_Button, {
                        class: "ml-2",
                        variant: "outline"
                      }, {
                        default: withCtx(() => [
                          createTextVNode("Add")
                        ]),
                        _: 1
                      })
                    ])
                  ];
                }
              }),
              _: 3
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_DialogContent, { class: "max-w-[95svw] max-h-[95svh] md:max-w-lg grid-rows-[auto_minmax(0,1fr)_auto]" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_DialogHeader, null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_DialogTitle, { class: "font-semibold text-lg" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`Add Site`);
                            } else {
                              return [
                                createTextVNode("Add Site")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_DialogDescription, { class: "hidden" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`Description goes here`);
                            } else {
                              return [
                                createTextVNode("Description goes here")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_DialogTitle, { class: "font-semibold text-lg" }, {
                            default: withCtx(() => [
                              createTextVNode("Add Site")
                            ]),
                            _: 1
                          }),
                          createVNode(_component_DialogDescription, { class: "hidden" }, {
                            default: withCtx(() => [
                              createTextVNode("Description goes here")
                            ]),
                            _: 1
                          })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_AutoForm, {
                    class: "space-y-4",
                    schema: unref(SiteConfSchema),
                    "field-config": fieldConfig,
                    dependencies,
                    form: unref(form),
                    onSubmit
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_DialogFooter, { class: "flex flex-row items-center gap-2" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            var _a2;
                            if (_push5) {
                              _push5(`<div class="flex-1"${_scopeId4}>`);
                              if (unref(isSubmitting)) {
                                _push5(ssrRenderComponent(_component_RotatingText, {
                                  delay: 2e3,
                                  class: "font-medium lowercase text-sm text-green-700"
                                }, null, _parent5, _scopeId4));
                              } else if (unref(errors).length > 0) {
                                _push5(`<span class="font-medium text-sm text-red-600 text-justify"${_scopeId4}>${(_a2 = ("markdownToHtmlLite" in _ctx ? _ctx.markdownToHtmlLite : unref(markdownToHtmlLite))(unref(errors).join(" "))) != null ? _a2 : ""}</span>`);
                              } else {
                                _push5(`<!---->`);
                              }
                              _push5(`</div>`);
                              _push5(ssrRenderComponent(_component_DialogClose, { "as-child": "" }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(_component_Button, {
                                      type: "button",
                                      variant: "secondary",
                                      class: "w-20 border border-gray-300"
                                    }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(`Close`);
                                        } else {
                                          return [
                                            createTextVNode("Close")
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                  } else {
                                    return [
                                      createVNode(_component_Button, {
                                        type: "button",
                                        variant: "secondary",
                                        class: "w-20 border border-gray-300"
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode("Close")
                                        ]),
                                        _: 1
                                      })
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              if (unref(isSubmitting)) {
                                _push5(ssrRenderComponent(_component_Button, {
                                  disabled: "",
                                  class: "w-20"
                                }, {
                                  default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(ssrRenderComponent(unref(LoaderCircleIcon), { class: "size-6 animate-spin" }, null, _parent6, _scopeId5));
                                    } else {
                                      return [
                                        createVNode(unref(LoaderCircleIcon), { class: "size-6 animate-spin" })
                                      ];
                                    }
                                  }),
                                  _: 1
                                }, _parent5, _scopeId4));
                              } else {
                                _push5(ssrRenderComponent(_component_Button, {
                                  type: "submit",
                                  class: "w-20"
                                }, {
                                  default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(`Save`);
                                    } else {
                                      return [
                                        createTextVNode("Save")
                                      ];
                                    }
                                  }),
                                  _: 1
                                }, _parent5, _scopeId4));
                              }
                            } else {
                              return [
                                createVNode("div", { class: "flex-1" }, [
                                  unref(isSubmitting) ? (openBlock(), createBlock(_component_RotatingText, {
                                    key: 0,
                                    delay: 2e3,
                                    class: "font-medium lowercase text-sm text-green-700"
                                  })) : unref(errors).length > 0 ? (openBlock(), createBlock("span", {
                                    key: 1,
                                    class: "font-medium text-sm text-red-600 text-justify",
                                    innerHTML: ("markdownToHtmlLite" in _ctx ? _ctx.markdownToHtmlLite : unref(markdownToHtmlLite))(unref(errors).join(" "))
                                  }, null, 8, ["innerHTML"])) : createCommentVNode("", true)
                                ]),
                                createVNode(_component_DialogClose, { "as-child": "" }, {
                                  default: withCtx(() => [
                                    createVNode(_component_Button, {
                                      type: "button",
                                      variant: "secondary",
                                      class: "w-20 border border-gray-300"
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode("Close")
                                      ]),
                                      _: 1
                                    })
                                  ]),
                                  _: 1
                                }),
                                unref(isSubmitting) ? (openBlock(), createBlock(_component_Button, {
                                  key: 0,
                                  disabled: "",
                                  class: "w-20"
                                }, {
                                  default: withCtx(() => [
                                    createVNode(unref(LoaderCircleIcon), { class: "size-6 animate-spin" })
                                  ]),
                                  _: 1
                                })) : (openBlock(), createBlock(_component_Button, {
                                  key: 1,
                                  type: "submit",
                                  class: "w-20"
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode("Save")
                                  ]),
                                  _: 1
                                }))
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_DialogFooter, { class: "flex flex-row items-center gap-2" }, {
                            default: withCtx(() => [
                              createVNode("div", { class: "flex-1" }, [
                                unref(isSubmitting) ? (openBlock(), createBlock(_component_RotatingText, {
                                  key: 0,
                                  delay: 2e3,
                                  class: "font-medium lowercase text-sm text-green-700"
                                })) : unref(errors).length > 0 ? (openBlock(), createBlock("span", {
                                  key: 1,
                                  class: "font-medium text-sm text-red-600 text-justify",
                                  innerHTML: ("markdownToHtmlLite" in _ctx ? _ctx.markdownToHtmlLite : unref(markdownToHtmlLite))(unref(errors).join(" "))
                                }, null, 8, ["innerHTML"])) : createCommentVNode("", true)
                              ]),
                              createVNode(_component_DialogClose, { "as-child": "" }, {
                                default: withCtx(() => [
                                  createVNode(_component_Button, {
                                    type: "button",
                                    variant: "secondary",
                                    class: "w-20 border border-gray-300"
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode("Close")
                                    ]),
                                    _: 1
                                  })
                                ]),
                                _: 1
                              }),
                              unref(isSubmitting) ? (openBlock(), createBlock(_component_Button, {
                                key: 0,
                                disabled: "",
                                class: "w-20"
                              }, {
                                default: withCtx(() => [
                                  createVNode(unref(LoaderCircleIcon), { class: "size-6 animate-spin" })
                                ]),
                                _: 1
                              })) : (openBlock(), createBlock(_component_Button, {
                                key: 1,
                                type: "submit",
                                class: "w-20"
                              }, {
                                default: withCtx(() => [
                                  createTextVNode("Save")
                                ]),
                                _: 1
                              }))
                            ]),
                            _: 1
                          })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_DialogHeader, null, {
                      default: withCtx(() => [
                        createVNode(_component_DialogTitle, { class: "font-semibold text-lg" }, {
                          default: withCtx(() => [
                            createTextVNode("Add Site")
                          ]),
                          _: 1
                        }),
                        createVNode(_component_DialogDescription, { class: "hidden" }, {
                          default: withCtx(() => [
                            createTextVNode("Description goes here")
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }),
                    createVNode(_component_AutoForm, {
                      class: "space-y-4",
                      schema: unref(SiteConfSchema),
                      "field-config": fieldConfig,
                      dependencies,
                      form: unref(form),
                      onSubmit
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_DialogFooter, { class: "flex flex-row items-center gap-2" }, {
                          default: withCtx(() => [
                            createVNode("div", { class: "flex-1" }, [
                              unref(isSubmitting) ? (openBlock(), createBlock(_component_RotatingText, {
                                key: 0,
                                delay: 2e3,
                                class: "font-medium lowercase text-sm text-green-700"
                              })) : unref(errors).length > 0 ? (openBlock(), createBlock("span", {
                                key: 1,
                                class: "font-medium text-sm text-red-600 text-justify",
                                innerHTML: ("markdownToHtmlLite" in _ctx ? _ctx.markdownToHtmlLite : unref(markdownToHtmlLite))(unref(errors).join(" "))
                              }, null, 8, ["innerHTML"])) : createCommentVNode("", true)
                            ]),
                            createVNode(_component_DialogClose, { "as-child": "" }, {
                              default: withCtx(() => [
                                createVNode(_component_Button, {
                                  type: "button",
                                  variant: "secondary",
                                  class: "w-20 border border-gray-300"
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode("Close")
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            }),
                            unref(isSubmitting) ? (openBlock(), createBlock(_component_Button, {
                              key: 0,
                              disabled: "",
                              class: "w-20"
                            }, {
                              default: withCtx(() => [
                                createVNode(unref(LoaderCircleIcon), { class: "size-6 animate-spin" })
                              ]),
                              _: 1
                            })) : (openBlock(), createBlock(_component_Button, {
                              key: 1,
                              type: "submit",
                              class: "w-20"
                            }, {
                              default: withCtx(() => [
                                createTextVNode("Save")
                              ]),
                              _: 1
                            }))
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }, 8, ["schema", "form"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_DialogTrigger, { class: props == null ? void 0 : props.class, disabled: props == null ? void 0 : props.disabled, asChild: props == null ? void 0 : props.asChild }, {
                default: withCtx(() => [
                  renderSlot(_ctx.$slots, "default", {}, () => [
                    createVNode(_component_Button, {
                      class: "ml-2",
                      variant: "outline"
                    }, {
                      default: withCtx(() => [
                        createTextVNode("Add")
                      ]),
                      _: 1
                    })
                  ])
                ]),
                _: 3
              }, 16),
              createVNode(_component_DialogContent, { class: "max-w-[95svw] max-h-[95svh] md:max-w-lg grid-rows-[auto_minmax(0,1fr)_auto]" }, {
                default: withCtx(() => [
                  createVNode(_component_DialogHeader, null, {
                    default: withCtx(() => [
                      createVNode(_component_DialogTitle, { class: "font-semibold text-lg" }, {
                        default: withCtx(() => [
                          createTextVNode("Add Site")
                        ]),
                        _: 1
                      }),
                      createVNode(_component_DialogDescription, { class: "hidden" }, {
                        default: withCtx(() => [
                          createTextVNode("Description goes here")
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }),
                  createVNode(_component_AutoForm, {
                    class: "space-y-4",
                    schema: unref(SiteConfSchema),
                    "field-config": fieldConfig,
                    dependencies,
                    form: unref(form),
                    onSubmit
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_DialogFooter, { class: "flex flex-row items-center gap-2" }, {
                        default: withCtx(() => [
                          createVNode("div", { class: "flex-1" }, [
                            unref(isSubmitting) ? (openBlock(), createBlock(_component_RotatingText, {
                              key: 0,
                              delay: 2e3,
                              class: "font-medium lowercase text-sm text-green-700"
                            })) : unref(errors).length > 0 ? (openBlock(), createBlock("span", {
                              key: 1,
                              class: "font-medium text-sm text-red-600 text-justify",
                              innerHTML: ("markdownToHtmlLite" in _ctx ? _ctx.markdownToHtmlLite : unref(markdownToHtmlLite))(unref(errors).join(" "))
                            }, null, 8, ["innerHTML"])) : createCommentVNode("", true)
                          ]),
                          createVNode(_component_DialogClose, { "as-child": "" }, {
                            default: withCtx(() => [
                              createVNode(_component_Button, {
                                type: "button",
                                variant: "secondary",
                                class: "w-20 border border-gray-300"
                              }, {
                                default: withCtx(() => [
                                  createTextVNode("Close")
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }),
                          unref(isSubmitting) ? (openBlock(), createBlock(_component_Button, {
                            key: 0,
                            disabled: "",
                            class: "w-20"
                          }, {
                            default: withCtx(() => [
                              createVNode(unref(LoaderCircleIcon), { class: "size-6 animate-spin" })
                            ]),
                            _: 1
                          })) : (openBlock(), createBlock(_component_Button, {
                            key: 1,
                            type: "submit",
                            class: "w-20"
                          }, {
                            default: withCtx(() => [
                              createTextVNode("Save")
                            ]),
                            _: 1
                          }))
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }, 8, ["schema", "form"])
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
};
const _sfc_setup$g = _sfc_main$g.setup;
_sfc_main$g.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Sites/Editor.vue");
  return _sfc_setup$g ? _sfc_setup$g(props, ctx) : void 0;
};
const _sfc_main$f = /* @__PURE__ */ defineComponent({
  __name: "Badge",
  __ssrInlineRender: true,
  props: {
    variant: {},
    class: {}
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: unref(cn)(unref(badgeVariants)({ variant: _ctx.variant }), props.class)
      }, _attrs))}>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</div>`);
    };
  }
});
const _sfc_setup$f = _sfc_main$f.setup;
_sfc_main$f.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/badge/Badge.vue");
  return _sfc_setup$f ? _sfc_setup$f(props, ctx) : void 0;
};
const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        outline: "text-foreground"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
const _sfc_main$e = {
  __name: "DataFilters",
  __ssrInlineRender: true,
  props: ["column", "title", "options"],
  setup(__props) {
    const props = __props;
    const selectedValues = computed(() => {
      var _a;
      return new Set((_a = props.column) == null ? void 0 : _a.getFilterValue());
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_DropdownMenu = _sfc_main$v;
      const _component_DropdownMenuTrigger = _sfc_main$p;
      const _component_Button = _sfc_main$C;
      const _component_Separator = _sfc_main$B$1;
      const _component_Badge = _sfc_main$f;
      const _component_DropdownMenuContent = _sfc_main$t;
      const _component_DropdownMenuLabel = _sfc_main$r;
      const _component_DropdownMenuSeparator = _sfc_main$q;
      const _component_DropdownMenuItem = _sfc_main$s;
      _push(ssrRenderComponent(_component_DropdownMenu, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_DropdownMenuTrigger, { "as-child": "" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_Button, {
                    variant: "outline",
                    size: "sm",
                    class: "h-8 border-dashed"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(unref(CircleFadingPlusIcon), { class: "mr-2 h-4 w-4" }, null, _parent4, _scopeId3));
                        _push4(` ${ssrInterpolate(__props.title)} `);
                        if (selectedValues.value.size > 0) {
                          _push4(`<!--[-->`);
                          _push4(ssrRenderComponent(_component_Separator, {
                            orientation: "vertical",
                            class: "mx-2 h-4"
                          }, null, _parent4, _scopeId3));
                          _push4(ssrRenderComponent(_component_Badge, {
                            variant: "secondary",
                            class: "rounded-sm px-1 font-normal lg:hidden"
                          }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`${ssrInterpolate(selectedValues.value.size)}`);
                              } else {
                                return [
                                  createTextVNode(toDisplayString(selectedValues.value.size), 1)
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                          _push4(`<div class="hidden space-x-1 lg:flex"${_scopeId3}>`);
                          if (selectedValues.value.size > 2) {
                            _push4(ssrRenderComponent(_component_Badge, {
                              variant: "secondary",
                              class: "rounded-sm px-1 font-normal"
                            }, {
                              default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  _push5(`${ssrInterpolate(selectedValues.value.size)} selected`);
                                } else {
                                  return [
                                    createTextVNode(toDisplayString(selectedValues.value.size) + " selected", 1)
                                  ];
                                }
                              }),
                              _: 1
                            }, _parent4, _scopeId3));
                          } else {
                            _push4(`<!--[-->`);
                            ssrRenderList(__props.options.filter((option) => selectedValues.value.has(option.value)), (option) => {
                              _push4(ssrRenderComponent(_component_Badge, {
                                key: option.value,
                                variant: "secondary",
                                class: "rounded-sm px-1 font-normal"
                              }, {
                                default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                  if (_push5) {
                                    _push5(`${ssrInterpolate(option.label)}`);
                                  } else {
                                    return [
                                      createTextVNode(toDisplayString(option.label), 1)
                                    ];
                                  }
                                }),
                                _: 2
                              }, _parent4, _scopeId3));
                            });
                            _push4(`<!--]-->`);
                          }
                          _push4(`</div><!--]-->`);
                        } else {
                          _push4(`<!---->`);
                        }
                      } else {
                        return [
                          createVNode(unref(CircleFadingPlusIcon), { class: "mr-2 h-4 w-4" }),
                          createTextVNode(" " + toDisplayString(__props.title) + " ", 1),
                          selectedValues.value.size > 0 ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                            createVNode(_component_Separator, {
                              orientation: "vertical",
                              class: "mx-2 h-4"
                            }),
                            createVNode(_component_Badge, {
                              variant: "secondary",
                              class: "rounded-sm px-1 font-normal lg:hidden"
                            }, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(selectedValues.value.size), 1)
                              ]),
                              _: 1
                            }),
                            createVNode("div", { class: "hidden space-x-1 lg:flex" }, [
                              selectedValues.value.size > 2 ? (openBlock(), createBlock(_component_Badge, {
                                key: 0,
                                variant: "secondary",
                                class: "rounded-sm px-1 font-normal"
                              }, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(selectedValues.value.size) + " selected", 1)
                                ]),
                                _: 1
                              })) : (openBlock(true), createBlock(Fragment, { key: 1 }, renderList(__props.options.filter((option) => selectedValues.value.has(option.value)), (option) => {
                                return openBlock(), createBlock(_component_Badge, {
                                  key: option.value,
                                  variant: "secondary",
                                  class: "rounded-sm px-1 font-normal"
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode(toDisplayString(option.label), 1)
                                  ]),
                                  _: 2
                                }, 1024);
                              }), 128))
                            ])
                          ], 64)) : createCommentVNode("", true)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_Button, {
                      variant: "outline",
                      size: "sm",
                      class: "h-8 border-dashed"
                    }, {
                      default: withCtx(() => [
                        createVNode(unref(CircleFadingPlusIcon), { class: "mr-2 h-4 w-4" }),
                        createTextVNode(" " + toDisplayString(__props.title) + " ", 1),
                        selectedValues.value.size > 0 ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                          createVNode(_component_Separator, {
                            orientation: "vertical",
                            class: "mx-2 h-4"
                          }),
                          createVNode(_component_Badge, {
                            variant: "secondary",
                            class: "rounded-sm px-1 font-normal lg:hidden"
                          }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(selectedValues.value.size), 1)
                            ]),
                            _: 1
                          }),
                          createVNode("div", { class: "hidden space-x-1 lg:flex" }, [
                            selectedValues.value.size > 2 ? (openBlock(), createBlock(_component_Badge, {
                              key: 0,
                              variant: "secondary",
                              class: "rounded-sm px-1 font-normal"
                            }, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(selectedValues.value.size) + " selected", 1)
                              ]),
                              _: 1
                            })) : (openBlock(true), createBlock(Fragment, { key: 1 }, renderList(__props.options.filter((option) => selectedValues.value.has(option.value)), (option) => {
                              return openBlock(), createBlock(_component_Badge, {
                                key: option.value,
                                variant: "secondary",
                                class: "rounded-sm px-1 font-normal"
                              }, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(option.label), 1)
                                ]),
                                _: 2
                              }, 1024);
                            }), 128))
                          ])
                        ], 64)) : createCommentVNode("", true)
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_DropdownMenuContent, null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_DropdownMenuLabel, null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`${ssrInterpolate(__props.title)}`);
                      } else {
                        return [
                          createTextVNode(toDisplayString(__props.title), 1)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_DropdownMenuSeparator, null, null, _parent3, _scopeId2));
                  _push3(`<!--[-->`);
                  ssrRenderList(__props.options, (option) => {
                    _push3(ssrRenderComponent(_component_DropdownMenuItem, {
                      key: option == null ? void 0 : option.value,
                      onClick: (e) => {
                        var _a;
                        const valueStr = typeof (option == null ? void 0 : option.value) === "string" ? option == null ? void 0 : option.value : JSON.stringify(option == null ? void 0 : option.value);
                        selectedValues.value.clear();
                        selectedValues.value.add(valueStr);
                        (_a = __props.column) == null ? void 0 : _a.setFilterValue([...selectedValues.value]);
                      }
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`<div class="${ssrRenderClass(
                            unref(cn)(
                              "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                              selectedValues.value.has(option == null ? void 0 : option.value) ? "bg-primary text-primary-foreground" : "opacity-50 [&_svg]:invisible"
                            )
                          )}"${_scopeId3}>`);
                          _push4(ssrRenderComponent(unref(CheckIcon), { class: "h-4 w-4" }, null, _parent4, _scopeId3));
                          _push4(`</div>`);
                          if (option == null ? void 0 : option.icon) {
                            ssrRenderVNode(_push4, createVNode(resolveDynamicComponent(option == null ? void 0 : option.icon), { class: "mr-2 h-4 w-4 text-muted-foreground" }, null), _parent4, _scopeId3);
                          } else {
                            _push4(`<!---->`);
                          }
                          _push4(`<span${_scopeId3}>${ssrInterpolate(option == null ? void 0 : option.label)}</span>`);
                        } else {
                          return [
                            createVNode("div", {
                              class: unref(cn)(
                                "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                selectedValues.value.has(option == null ? void 0 : option.value) ? "bg-primary text-primary-foreground" : "opacity-50 [&_svg]:invisible"
                              )
                            }, [
                              createVNode(unref(CheckIcon), { class: "h-4 w-4" })
                            ], 2),
                            (option == null ? void 0 : option.icon) ? (openBlock(), createBlock(resolveDynamicComponent(option == null ? void 0 : option.icon), {
                              key: 0,
                              class: "mr-2 h-4 w-4 text-muted-foreground"
                            })) : createCommentVNode("", true),
                            createVNode("span", null, toDisplayString(option == null ? void 0 : option.label), 1)
                          ];
                        }
                      }),
                      _: 2
                    }, _parent3, _scopeId2));
                  });
                  _push3(`<!--]-->`);
                  if (selectedValues.value.size > 0) {
                    _push3(`<!--[-->`);
                    _push3(ssrRenderComponent(_component_DropdownMenuSeparator, null, null, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(_component_DropdownMenuItem, {
                      value: { label: "Clear filters" },
                      class: "justify-center text-center",
                      onSelect: ($event) => {
                        var _a;
                        return (_a = __props.column) == null ? void 0 : _a.setFilterValue(void 0);
                      }
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`Clear filters`);
                        } else {
                          return [
                            createTextVNode("Clear filters")
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(`<!--]-->`);
                  } else {
                    _push3(`<!---->`);
                  }
                } else {
                  return [
                    createVNode(_component_DropdownMenuLabel, null, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(__props.title), 1)
                      ]),
                      _: 1
                    }),
                    createVNode(_component_DropdownMenuSeparator),
                    (openBlock(true), createBlock(Fragment, null, renderList(__props.options, (option) => {
                      return openBlock(), createBlock(_component_DropdownMenuItem, {
                        key: option == null ? void 0 : option.value,
                        onClick: withModifiers(
                          (e) => {
                            var _a;
                            const valueStr = typeof (option == null ? void 0 : option.value) === "string" ? option == null ? void 0 : option.value : JSON.stringify(option == null ? void 0 : option.value);
                            selectedValues.value.clear();
                            selectedValues.value.add(valueStr);
                            (_a = __props.column) == null ? void 0 : _a.setFilterValue([...selectedValues.value]);
                          },
                          ["prevent"]
                        )
                      }, {
                        default: withCtx(() => [
                          createVNode("div", {
                            class: unref(cn)(
                              "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                              selectedValues.value.has(option == null ? void 0 : option.value) ? "bg-primary text-primary-foreground" : "opacity-50 [&_svg]:invisible"
                            )
                          }, [
                            createVNode(unref(CheckIcon), { class: "h-4 w-4" })
                          ], 2),
                          (option == null ? void 0 : option.icon) ? (openBlock(), createBlock(resolveDynamicComponent(option == null ? void 0 : option.icon), {
                            key: 0,
                            class: "mr-2 h-4 w-4 text-muted-foreground"
                          })) : createCommentVNode("", true),
                          createVNode("span", null, toDisplayString(option == null ? void 0 : option.label), 1)
                        ]),
                        _: 2
                      }, 1032, ["onClick"]);
                    }), 128)),
                    selectedValues.value.size > 0 ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                      createVNode(_component_DropdownMenuSeparator),
                      createVNode(_component_DropdownMenuItem, {
                        value: { label: "Clear filters" },
                        class: "justify-center text-center",
                        onSelect: ($event) => {
                          var _a;
                          return (_a = __props.column) == null ? void 0 : _a.setFilterValue(void 0);
                        }
                      }, {
                        default: withCtx(() => [
                          createTextVNode("Clear filters")
                        ]),
                        _: 1
                      }, 8, ["onSelect"])
                    ], 64)) : createCommentVNode("", true)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_DropdownMenuTrigger, { "as-child": "" }, {
                default: withCtx(() => [
                  createVNode(_component_Button, {
                    variant: "outline",
                    size: "sm",
                    class: "h-8 border-dashed"
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(CircleFadingPlusIcon), { class: "mr-2 h-4 w-4" }),
                      createTextVNode(" " + toDisplayString(__props.title) + " ", 1),
                      selectedValues.value.size > 0 ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                        createVNode(_component_Separator, {
                          orientation: "vertical",
                          class: "mx-2 h-4"
                        }),
                        createVNode(_component_Badge, {
                          variant: "secondary",
                          class: "rounded-sm px-1 font-normal lg:hidden"
                        }, {
                          default: withCtx(() => [
                            createTextVNode(toDisplayString(selectedValues.value.size), 1)
                          ]),
                          _: 1
                        }),
                        createVNode("div", { class: "hidden space-x-1 lg:flex" }, [
                          selectedValues.value.size > 2 ? (openBlock(), createBlock(_component_Badge, {
                            key: 0,
                            variant: "secondary",
                            class: "rounded-sm px-1 font-normal"
                          }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(selectedValues.value.size) + " selected", 1)
                            ]),
                            _: 1
                          })) : (openBlock(true), createBlock(Fragment, { key: 1 }, renderList(__props.options.filter((option) => selectedValues.value.has(option.value)), (option) => {
                            return openBlock(), createBlock(_component_Badge, {
                              key: option.value,
                              variant: "secondary",
                              class: "rounded-sm px-1 font-normal"
                            }, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(option.label), 1)
                              ]),
                              _: 2
                            }, 1024);
                          }), 128))
                        ])
                      ], 64)) : createCommentVNode("", true)
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              createVNode(_component_DropdownMenuContent, null, {
                default: withCtx(() => [
                  createVNode(_component_DropdownMenuLabel, null, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(__props.title), 1)
                    ]),
                    _: 1
                  }),
                  createVNode(_component_DropdownMenuSeparator),
                  (openBlock(true), createBlock(Fragment, null, renderList(__props.options, (option) => {
                    return openBlock(), createBlock(_component_DropdownMenuItem, {
                      key: option == null ? void 0 : option.value,
                      onClick: withModifiers(
                        (e) => {
                          var _a;
                          const valueStr = typeof (option == null ? void 0 : option.value) === "string" ? option == null ? void 0 : option.value : JSON.stringify(option == null ? void 0 : option.value);
                          selectedValues.value.clear();
                          selectedValues.value.add(valueStr);
                          (_a = __props.column) == null ? void 0 : _a.setFilterValue([...selectedValues.value]);
                        },
                        ["prevent"]
                      )
                    }, {
                      default: withCtx(() => [
                        createVNode("div", {
                          class: unref(cn)(
                            "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                            selectedValues.value.has(option == null ? void 0 : option.value) ? "bg-primary text-primary-foreground" : "opacity-50 [&_svg]:invisible"
                          )
                        }, [
                          createVNode(unref(CheckIcon), { class: "h-4 w-4" })
                        ], 2),
                        (option == null ? void 0 : option.icon) ? (openBlock(), createBlock(resolveDynamicComponent(option == null ? void 0 : option.icon), {
                          key: 0,
                          class: "mr-2 h-4 w-4 text-muted-foreground"
                        })) : createCommentVNode("", true),
                        createVNode("span", null, toDisplayString(option == null ? void 0 : option.label), 1)
                      ]),
                      _: 2
                    }, 1032, ["onClick"]);
                  }), 128)),
                  selectedValues.value.size > 0 ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                    createVNode(_component_DropdownMenuSeparator),
                    createVNode(_component_DropdownMenuItem, {
                      value: { label: "Clear filters" },
                      class: "justify-center text-center",
                      onSelect: ($event) => {
                        var _a;
                        return (_a = __props.column) == null ? void 0 : _a.setFilterValue(void 0);
                      }
                    }, {
                      default: withCtx(() => [
                        createTextVNode("Clear filters")
                      ]),
                      _: 1
                    }, 8, ["onSelect"])
                  ], 64)) : createCommentVNode("", true)
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
};
const _sfc_setup$e = _sfc_main$e.setup;
_sfc_main$e.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Sites/DataFilters.vue");
  return _sfc_setup$e ? _sfc_setup$e(props, ctx) : void 0;
};
const _sfc_main$d = {
  __name: "ViewOptions",
  __ssrInlineRender: true,
  props: ["table"],
  setup(__props) {
    const props = __props;
    const columns = computed(() => props.table.getAllColumns().filter((column) => typeof column.accessorFn !== "undefined" && column.getCanHide()));
    function getColumnDisplayName(column) {
      var _a, _b, _c, _d, _e, _f, _g, _h;
      try {
        if (typeof ((_a = column == null ? void 0 : column.columnDef) == null ? void 0 : _a.header) === "function") {
          const colTitle = (_d = (_c = (_b = column == null ? void 0 : column.columnDef) == null ? void 0 : _b.header({ column })) == null ? void 0 : _c.props) == null ? void 0 : _d.title;
          if (!colTitle) throw new Error("fallback to catch");
          return colTitle;
        }
        if (typeof ((_e = column == null ? void 0 : column.columnDef) == null ? void 0 : _e.header) === "string" && ((_f = column == null ? void 0 : column.columnDef) == null ? void 0 : _f.header.length)) {
          return (_g = column == null ? void 0 : column.columnDef) == null ? void 0 : _g.header;
        }
        throw new Error("fallback to catch");
      } catch (error) {
        return ((_h = column == null ? void 0 : column.columnDef) == null ? void 0 : _h.displayName) || (column == null ? void 0 : column.id);
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(_sfc_main$v), _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(_sfc_main$p), { "as-child": "" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(_sfc_main$C), {
                    variant: "outline",
                    size: "sm",
                    class: "ml-auto hidden h-8 lg:flex"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(unref(EllipsisIcon), { class: "mr-2 h-4 w-4" }, null, _parent4, _scopeId3));
                        _push4(` View `);
                      } else {
                        return [
                          createVNode(unref(EllipsisIcon), { class: "mr-2 h-4 w-4" }),
                          createTextVNode(" View ")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(_sfc_main$C), {
                      variant: "outline",
                      size: "sm",
                      class: "ml-auto hidden h-8 lg:flex"
                    }, {
                      default: withCtx(() => [
                        createVNode(unref(EllipsisIcon), { class: "mr-2 h-4 w-4" }),
                        createTextVNode(" View ")
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(_sfc_main$t), {
              align: "end",
              class: "w-[150px]"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(_sfc_main$r), null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`Toggle columns`);
                      } else {
                        return [
                          createTextVNode("Toggle columns")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(_sfc_main$q), null, null, _parent3, _scopeId2));
                  _push3(`<!--[-->`);
                  ssrRenderList(columns.value, (column) => {
                    _push3(ssrRenderComponent(unref(_sfc_main$u), {
                      key: column.id,
                      classss: "capitalize",
                      checked: column.getIsVisible(),
                      "onUpdate:checked": (value) => column.toggleVisibility(!!value)
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`${ssrInterpolate(getColumnDisplayName(column))}`);
                        } else {
                          return [
                            createTextVNode(toDisplayString(getColumnDisplayName(column)), 1)
                          ];
                        }
                      }),
                      _: 2
                    }, _parent3, _scopeId2));
                  });
                  _push3(`<!--]-->`);
                } else {
                  return [
                    createVNode(unref(_sfc_main$r), null, {
                      default: withCtx(() => [
                        createTextVNode("Toggle columns")
                      ]),
                      _: 1
                    }),
                    createVNode(unref(_sfc_main$q)),
                    (openBlock(true), createBlock(Fragment, null, renderList(columns.value, (column) => {
                      return openBlock(), createBlock(unref(_sfc_main$u), {
                        key: column.id,
                        classss: "capitalize",
                        checked: column.getIsVisible(),
                        "onUpdate:checked": (value) => column.toggleVisibility(!!value)
                      }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(getColumnDisplayName(column)), 1)
                        ]),
                        _: 2
                      }, 1032, ["checked", "onUpdate:checked"]);
                    }), 128))
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(_sfc_main$p), { "as-child": "" }, {
                default: withCtx(() => [
                  createVNode(unref(_sfc_main$C), {
                    variant: "outline",
                    size: "sm",
                    class: "ml-auto hidden h-8 lg:flex"
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(EllipsisIcon), { class: "mr-2 h-4 w-4" }),
                      createTextVNode(" View ")
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              createVNode(unref(_sfc_main$t), {
                align: "end",
                class: "w-[150px]"
              }, {
                default: withCtx(() => [
                  createVNode(unref(_sfc_main$r), null, {
                    default: withCtx(() => [
                      createTextVNode("Toggle columns")
                    ]),
                    _: 1
                  }),
                  createVNode(unref(_sfc_main$q)),
                  (openBlock(true), createBlock(Fragment, null, renderList(columns.value, (column) => {
                    return openBlock(), createBlock(unref(_sfc_main$u), {
                      key: column.id,
                      classss: "capitalize",
                      checked: column.getIsVisible(),
                      "onUpdate:checked": (value) => column.toggleVisibility(!!value)
                    }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(getColumnDisplayName(column)), 1)
                      ]),
                      _: 2
                    }, 1032, ["checked", "onUpdate:checked"]);
                  }), 128))
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
};
const _sfc_setup$d = _sfc_main$d.setup;
_sfc_main$d.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/DataTable/ViewOptions.vue");
  return _sfc_setup$d ? _sfc_setup$d(props, ctx) : void 0;
};
const _sfc_main$c = /* @__PURE__ */ defineComponent({
  __name: "Pagination",
  __ssrInlineRender: true,
  props: {
    table: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex items-center justify-between px-2" }, _attrs))}><div class="flex-1 text-sm text-muted-foreground">${ssrInterpolate(_ctx.table.getFilteredSelectedRowModel().rows.length)} of ${ssrInterpolate(_ctx.table.getFilteredRowModel().rows.length)} row(s) selected.</div><div class="flex items-center space-x-6 lg:space-x-8"><div class="flex items-center space-x-2"><p class="text-sm font-medium">Rows per page</p>`);
      _push(ssrRenderComponent(unref(_sfc_main$e$1), {
        "model-value": `${_ctx.table.getState().pagination.pageSize}`,
        "onUpdate:modelValue": _ctx.table.setPageSize
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(_sfc_main$9$1), { class: "h-8 w-[70px]" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(_sfc_main$8$1), {
                    placeholder: `${_ctx.table.getState().pagination.pageSize}`
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(_sfc_main$8$1), {
                      placeholder: `${_ctx.table.getState().pagination.pageSize}`
                    }, null, 8, ["placeholder"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(_sfc_main$d$1), { side: "top" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<!--[-->`);
                  ssrRenderList([20, 40, 60, 100], (pageSize) => {
                    _push3(ssrRenderComponent(unref(_sfc_main$c$1), {
                      key: pageSize,
                      value: `${pageSize}`
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`${ssrInterpolate(pageSize)}`);
                        } else {
                          return [
                            createTextVNode(toDisplayString(pageSize), 1)
                          ];
                        }
                      }),
                      _: 2
                    }, _parent3, _scopeId2));
                  });
                  _push3(`<!--]-->`);
                } else {
                  return [
                    (openBlock(), createBlock(Fragment, null, renderList([20, 40, 60, 100], (pageSize) => {
                      return createVNode(unref(_sfc_main$c$1), {
                        key: pageSize,
                        value: `${pageSize}`
                      }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(pageSize), 1)
                        ]),
                        _: 2
                      }, 1032, ["value"]);
                    }), 64))
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(_sfc_main$9$1), { class: "h-8 w-[70px]" }, {
                default: withCtx(() => [
                  createVNode(unref(_sfc_main$8$1), {
                    placeholder: `${_ctx.table.getState().pagination.pageSize}`
                  }, null, 8, ["placeholder"])
                ]),
                _: 1
              }),
              createVNode(unref(_sfc_main$d$1), { side: "top" }, {
                default: withCtx(() => [
                  (openBlock(), createBlock(Fragment, null, renderList([20, 40, 60, 100], (pageSize) => {
                    return createVNode(unref(_sfc_main$c$1), {
                      key: pageSize,
                      value: `${pageSize}`
                    }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(pageSize), 1)
                      ]),
                      _: 2
                    }, 1032, ["value"]);
                  }), 64))
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="flex w-[100px] items-center justify-center text-sm font-medium">Page ${ssrInterpolate(_ctx.table.getState().pagination.pageIndex + 1)} of ${ssrInterpolate(_ctx.table.getPageCount())}</div><div class="flex items-center space-x-2">`);
      _push(ssrRenderComponent(unref(_sfc_main$C), {
        variant: "outline",
        class: "hidden h-8 w-8 p-0 lg:flex",
        disabled: !_ctx.table.getCanPreviousPage(),
        onClick: ($event) => _ctx.table.setPageIndex(0)
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span class="sr-only"${_scopeId}>Go to first page</span>`);
            _push2(ssrRenderComponent(unref(ChevronsLeftIcon), { class: "h-4 w-4" }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode("span", { class: "sr-only" }, "Go to first page"),
              createVNode(unref(ChevronsLeftIcon), { class: "h-4 w-4" })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(_sfc_main$C), {
        variant: "outline",
        class: "h-8 w-8 p-0",
        disabled: !_ctx.table.getCanPreviousPage(),
        onClick: ($event) => _ctx.table.previousPage()
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span class="sr-only"${_scopeId}>Go to previous page</span>`);
            _push2(ssrRenderComponent(unref(ChevronLeftIcon), { class: "h-4 w-4" }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode("span", { class: "sr-only" }, "Go to previous page"),
              createVNode(unref(ChevronLeftIcon), { class: "h-4 w-4" })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(_sfc_main$C), {
        variant: "outline",
        class: "h-8 w-8 p-0",
        disabled: !_ctx.table.getCanNextPage(),
        onClick: ($event) => _ctx.table.nextPage()
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span class="sr-only"${_scopeId}>Go to next page</span>`);
            _push2(ssrRenderComponent(unref(ChevronRightIcon), { class: "h-4 w-4" }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode("span", { class: "sr-only" }, "Go to next page"),
              createVNode(unref(ChevronRightIcon), { class: "h-4 w-4" })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(_sfc_main$C), {
        variant: "outline",
        class: "hidden h-8 w-8 p-0 lg:flex",
        disabled: !_ctx.table.getCanNextPage(),
        onClick: ($event) => _ctx.table.setPageIndex(_ctx.table.getPageCount() - 1)
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span class="sr-only"${_scopeId}>Go to last page</span>`);
            _push2(ssrRenderComponent(unref(ChevronsRightIcon), { class: "h-4 w-4" }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode("span", { class: "sr-only" }, "Go to last page"),
              createVNode(unref(ChevronsRightIcon), { class: "h-4 w-4" })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></div>`);
    };
  }
});
const _sfc_setup$c = _sfc_main$c.setup;
_sfc_main$c.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/DataTable/Pagination.vue");
  return _sfc_setup$c ? _sfc_setup$c(props, ctx) : void 0;
};
const _sfc_main$b = /* @__PURE__ */ defineComponent({
  __name: "Table",
  __ssrInlineRender: true,
  props: {
    class: {}
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "relative w-full overflow-auto" }, _attrs))}><table class="${ssrRenderClass(unref(cn)("w-full caption-bottom text-sm", props.class))}">`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</table></div>`);
    };
  }
});
const _sfc_setup$b = _sfc_main$b.setup;
_sfc_main$b.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/table/Table.vue");
  return _sfc_setup$b ? _sfc_setup$b(props, ctx) : void 0;
};
const _sfc_main$a = /* @__PURE__ */ defineComponent({
  __name: "TableBody",
  __ssrInlineRender: true,
  props: {
    class: {}
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<tbody${ssrRenderAttrs(mergeProps({
        class: unref(cn)("[&_tr:last-child]:border-0", props.class)
      }, _attrs))}>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</tbody>`);
    };
  }
});
const _sfc_setup$a = _sfc_main$a.setup;
_sfc_main$a.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/table/TableBody.vue");
  return _sfc_setup$a ? _sfc_setup$a(props, ctx) : void 0;
};
const _sfc_main$9 = /* @__PURE__ */ defineComponent({
  __name: "TableCell",
  __ssrInlineRender: true,
  props: {
    class: {}
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<td${ssrRenderAttrs(mergeProps({
        class: unref(cn)(
          "p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-0.5",
          props.class
        )
      }, _attrs))}>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</td>`);
    };
  }
});
const _sfc_setup$9 = _sfc_main$9.setup;
_sfc_main$9.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/table/TableCell.vue");
  return _sfc_setup$9 ? _sfc_setup$9(props, ctx) : void 0;
};
const _sfc_main$8 = /* @__PURE__ */ defineComponent({
  __name: "TableRow",
  __ssrInlineRender: true,
  props: {
    class: {}
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<tr${ssrRenderAttrs(mergeProps({
        class: unref(cn)("border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted", props.class)
      }, _attrs))}>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</tr>`);
    };
  }
});
const _sfc_setup$8 = _sfc_main$8.setup;
_sfc_main$8.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/table/TableRow.vue");
  return _sfc_setup$8 ? _sfc_setup$8(props, ctx) : void 0;
};
const _sfc_main$7 = /* @__PURE__ */ defineComponent({
  __name: "TableHead",
  __ssrInlineRender: true,
  props: {
    class: {}
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<th${ssrRenderAttrs(mergeProps({
        class: unref(cn)("h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-0.5", props.class)
      }, _attrs))}>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</th>`);
    };
  }
});
const _sfc_setup$7 = _sfc_main$7.setup;
_sfc_main$7.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/table/TableHead.vue");
  return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
const _sfc_main$6 = /* @__PURE__ */ defineComponent({
  __name: "TableHeader",
  __ssrInlineRender: true,
  props: {
    class: {}
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<thead${ssrRenderAttrs(mergeProps({
        class: unref(cn)("[&_tr]:border-b", props.class)
      }, _attrs))}>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</thead>`);
    };
  }
});
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/table/TableHeader.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const _sfc_main$5 = {
  __name: "DataTable",
  __ssrInlineRender: true,
  props: ["data", "columns", "sorting"],
  setup(__props) {
    const statuses = [
      //
      { label: "Active", value: "1" },
      { label: "Disabled", value: "0" }
    ];
    const typeses = [
      //
      { label: "Serve", value: "serve" },
      { label: "Proxy", value: "proxy" },
      { label: "Redirect", value: "redirect" }
    ];
    const props = __props;
    const sorting = useLocalRef("sites-sorting", [].concat(props == null ? void 0 : props.sorting).filter(Boolean));
    const pagination = useLocalRef("sites-pagination", { pageIndex: 0, pageSize: 20 });
    const globalFilter = useLocalRef("sites-globalFilter", "");
    const columnFilters = useLocalRef("sites-columnFilters", []);
    const columnVisibility = useLocalRef("sites-columnVisibility", { isActive: false });
    const table = useVueTable({
      sortDescFirst: true,
      get data() {
        return props.data;
      },
      get columns() {
        return props.columns;
      },
      state: {
        get sorting() {
          return sorting.value;
        },
        get pagination() {
          return pagination.value;
        },
        get globalFilter() {
          return globalFilter.value;
        },
        get columnFilters() {
          return columnFilters.value;
        },
        get columnVisibility() {
          return columnVisibility.value;
        }
      },
      getCoreRowModel: getCoreRowModel(),
      getSortedRowModel: getSortedRowModel(),
      getExpandedRowModel: getExpandedRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      getFacetedRowModel: getFacetedRowModel(),
      getFacetedUniqueValues: getFacetedUniqueValues(),
      onSortingChange: (updaterOrValue) => valueUpdater(updaterOrValue, sorting),
      onPaginationChange: (updaterOrValue) => valueUpdater(updaterOrValue, pagination),
      onGlobalFilterChange: (updaterOrValue) => valueUpdater(updaterOrValue, globalFilter),
      onColumnFiltersChange: (updaterOrValue) => valueUpdater(updaterOrValue, columnFilters),
      onColumnVisibilityChange: (updaterOrValue) => valueUpdater(updaterOrValue, columnVisibility)
    });
    const columns = computed(() => table.getAllColumns().filter((column) => typeof column.accessorFn !== "undefined" && column.getCanHide()));
    const isFiltered = computed(() => globalFilter.value.length > 0 || table.getState().columnFilters.length > 0);
    const visibleRows = computed(() => {
      const rows = table.getRowModel().rows;
      const sticky = rows.filter((row) => row.original.confName === "_default.conf");
      const others = rows.filter((row) => row.original.confName !== "_default.conf");
      return [...sticky, ...others];
    });
    function clearAllFilters() {
      globalFilter.value = "";
      table.resetColumnFilters();
    }
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      const _component_Input = _sfc_main$F;
      const _component_SitesDataFilters = _sfc_main$e;
      const _component_Button = _sfc_main$C;
      const _component_DataTableViewOptions = _sfc_main$d;
      const _component_DataTablePagination = _sfc_main$c;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-4" }, _attrs))}><div class="flex items-center justify-between"><div class="flex flex-1 items-center space-x-2">`);
      _push(ssrRenderComponent(_component_Input, {
        placeholder: "search here...",
        class: "h-8 w-[150px] lg:w-[250px]",
        "model-value": (_a = unref(globalFilter)) != null ? _a : "",
        onInput: ($event) => globalFilter.value = String($event.target.value)
      }, null, _parent));
      if (unref(table).getColumn("confType")) {
        _push(ssrRenderComponent(_component_SitesDataFilters, {
          title: "Type",
          column: unref(table).getColumn("confType"),
          options: typeses
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      if (unref(table).getColumn("isActive")) {
        _push(ssrRenderComponent(_component_SitesDataFilters, {
          title: "Status",
          column: unref(table).getColumn("isActive"),
          options: statuses
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      if (unref(isFiltered)) {
        _push(ssrRenderComponent(_component_Button, {
          variant: "ghost",
          class: "flex items-center h-8 px-2 lg:px-3 bg-accent text-accent-foreground border border-transparent hover:border-gray-400/80",
          onClick: clearAllFilters
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Reset `);
              _push2(ssrRenderComponent(unref(XIcon), { class: "h-4 w-4" }, null, _parent2, _scopeId));
            } else {
              return [
                createTextVNode(" Reset "),
                createVNode(unref(XIcon), { class: "h-4 w-4" })
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      _push(ssrRenderComponent(_component_DataTableViewOptions, { table: unref(table) }, null, _parent));
      _push(`</div><div class="rounded-md border">`);
      _push(ssrRenderComponent(unref(_sfc_main$b), null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(_sfc_main$6), null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<!--[-->`);
                  ssrRenderList(unref(table).getHeaderGroups(), (headerGroup) => {
                    _push3(ssrRenderComponent(unref(_sfc_main$8), {
                      key: headerGroup.id
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`<!--[-->`);
                          ssrRenderList(headerGroup.headers, (header) => {
                            _push4(ssrRenderComponent(unref(_sfc_main$7), {
                              key: header.id
                            }, {
                              default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  if (!header.isPlaceholder) {
                                    _push5(ssrRenderComponent(unref(FlexRender), {
                                      render: header.column.columnDef.header,
                                      props: header.getContext()
                                    }, null, _parent5, _scopeId4));
                                  } else {
                                    _push5(`<!---->`);
                                  }
                                } else {
                                  return [
                                    !header.isPlaceholder ? (openBlock(), createBlock(unref(FlexRender), {
                                      key: 0,
                                      render: header.column.columnDef.header,
                                      props: header.getContext()
                                    }, null, 8, ["render", "props"])) : createCommentVNode("", true)
                                  ];
                                }
                              }),
                              _: 2
                            }, _parent4, _scopeId3));
                          });
                          _push4(`<!--]-->`);
                        } else {
                          return [
                            (openBlock(true), createBlock(Fragment, null, renderList(headerGroup.headers, (header) => {
                              return openBlock(), createBlock(unref(_sfc_main$7), {
                                key: header.id
                              }, {
                                default: withCtx(() => [
                                  !header.isPlaceholder ? (openBlock(), createBlock(unref(FlexRender), {
                                    key: 0,
                                    render: header.column.columnDef.header,
                                    props: header.getContext()
                                  }, null, 8, ["render", "props"])) : createCommentVNode("", true)
                                ]),
                                _: 2
                              }, 1024);
                            }), 128))
                          ];
                        }
                      }),
                      _: 2
                    }, _parent3, _scopeId2));
                  });
                  _push3(`<!--]-->`);
                } else {
                  return [
                    (openBlock(true), createBlock(Fragment, null, renderList(unref(table).getHeaderGroups(), (headerGroup) => {
                      return openBlock(), createBlock(unref(_sfc_main$8), {
                        key: headerGroup.id
                      }, {
                        default: withCtx(() => [
                          (openBlock(true), createBlock(Fragment, null, renderList(headerGroup.headers, (header) => {
                            return openBlock(), createBlock(unref(_sfc_main$7), {
                              key: header.id
                            }, {
                              default: withCtx(() => [
                                !header.isPlaceholder ? (openBlock(), createBlock(unref(FlexRender), {
                                  key: 0,
                                  render: header.column.columnDef.header,
                                  props: header.getContext()
                                }, null, 8, ["render", "props"])) : createCommentVNode("", true)
                              ]),
                              _: 2
                            }, 1024);
                          }), 128))
                        ]),
                        _: 2
                      }, 1024);
                    }), 128))
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(_sfc_main$a), null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                var _a2, _b;
                if (_push3) {
                  if ((_a2 = unref(visibleRows)) == null ? void 0 : _a2.length) {
                    _push3(`<!--[-->`);
                    ssrRenderList(unref(visibleRows), (row) => {
                      _push3(ssrRenderComponent(unref(_sfc_main$8), {
                        key: row.id,
                        "data-state": row.getIsSelected() && "selected"
                      }, {
                        default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(`<!--[-->`);
                            ssrRenderList(row.getVisibleCells(), (cell) => {
                              _push4(ssrRenderComponent(unref(_sfc_main$9), {
                                key: cell.id,
                                class: ("cn" in _ctx ? _ctx.cn : unref(cn))(cell.column.columnDef.cellClass)
                              }, {
                                default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                  if (_push5) {
                                    _push5(ssrRenderComponent(unref(FlexRender), {
                                      render: cell.column.columnDef.cell,
                                      props: cell.getContext()
                                    }, null, _parent5, _scopeId4));
                                  } else {
                                    return [
                                      createVNode(unref(FlexRender), {
                                        render: cell.column.columnDef.cell,
                                        props: cell.getContext()
                                      }, null, 8, ["render", "props"])
                                    ];
                                  }
                                }),
                                _: 2
                              }, _parent4, _scopeId3));
                            });
                            _push4(`<!--]-->`);
                          } else {
                            return [
                              (openBlock(true), createBlock(Fragment, null, renderList(row.getVisibleCells(), (cell) => {
                                return openBlock(), createBlock(unref(_sfc_main$9), {
                                  key: cell.id,
                                  class: ("cn" in _ctx ? _ctx.cn : unref(cn))(cell.column.columnDef.cellClass)
                                }, {
                                  default: withCtx(() => [
                                    createVNode(unref(FlexRender), {
                                      render: cell.column.columnDef.cell,
                                      props: cell.getContext()
                                    }, null, 8, ["render", "props"])
                                  ]),
                                  _: 2
                                }, 1032, ["class"]);
                              }), 128))
                            ];
                          }
                        }),
                        _: 2
                      }, _parent3, _scopeId2));
                    });
                    _push3(`<!--]-->`);
                  } else {
                    _push3(ssrRenderComponent(unref(_sfc_main$8), null, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(unref(_sfc_main$9), {
                            colspan: unref(columns).length,
                            class: "aspect-video text-center"
                          }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`No results.`);
                              } else {
                                return [
                                  createTextVNode("No results.")
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(unref(_sfc_main$9), {
                              colspan: unref(columns).length,
                              class: "aspect-video text-center"
                            }, {
                              default: withCtx(() => [
                                createTextVNode("No results.")
                              ]),
                              _: 1
                            }, 8, ["colspan"])
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                  }
                } else {
                  return [
                    ((_b = unref(visibleRows)) == null ? void 0 : _b.length) ? (openBlock(true), createBlock(Fragment, { key: 0 }, renderList(unref(visibleRows), (row) => {
                      return openBlock(), createBlock(unref(_sfc_main$8), {
                        key: row.id,
                        "data-state": row.getIsSelected() && "selected"
                      }, {
                        default: withCtx(() => [
                          (openBlock(true), createBlock(Fragment, null, renderList(row.getVisibleCells(), (cell) => {
                            return openBlock(), createBlock(unref(_sfc_main$9), {
                              key: cell.id,
                              class: ("cn" in _ctx ? _ctx.cn : unref(cn))(cell.column.columnDef.cellClass)
                            }, {
                              default: withCtx(() => [
                                createVNode(unref(FlexRender), {
                                  render: cell.column.columnDef.cell,
                                  props: cell.getContext()
                                }, null, 8, ["render", "props"])
                              ]),
                              _: 2
                            }, 1032, ["class"]);
                          }), 128))
                        ]),
                        _: 2
                      }, 1032, ["data-state"]);
                    }), 128)) : (openBlock(), createBlock(unref(_sfc_main$8), { key: 1 }, {
                      default: withCtx(() => [
                        createVNode(unref(_sfc_main$9), {
                          colspan: unref(columns).length,
                          class: "aspect-video text-center"
                        }, {
                          default: withCtx(() => [
                            createTextVNode("No results.")
                          ]),
                          _: 1
                        }, 8, ["colspan"])
                      ]),
                      _: 1
                    }))
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(_sfc_main$6), null, {
                default: withCtx(() => [
                  (openBlock(true), createBlock(Fragment, null, renderList(unref(table).getHeaderGroups(), (headerGroup) => {
                    return openBlock(), createBlock(unref(_sfc_main$8), {
                      key: headerGroup.id
                    }, {
                      default: withCtx(() => [
                        (openBlock(true), createBlock(Fragment, null, renderList(headerGroup.headers, (header) => {
                          return openBlock(), createBlock(unref(_sfc_main$7), {
                            key: header.id
                          }, {
                            default: withCtx(() => [
                              !header.isPlaceholder ? (openBlock(), createBlock(unref(FlexRender), {
                                key: 0,
                                render: header.column.columnDef.header,
                                props: header.getContext()
                              }, null, 8, ["render", "props"])) : createCommentVNode("", true)
                            ]),
                            _: 2
                          }, 1024);
                        }), 128))
                      ]),
                      _: 2
                    }, 1024);
                  }), 128))
                ]),
                _: 1
              }),
              createVNode(unref(_sfc_main$a), null, {
                default: withCtx(() => {
                  var _a2;
                  return [
                    ((_a2 = unref(visibleRows)) == null ? void 0 : _a2.length) ? (openBlock(true), createBlock(Fragment, { key: 0 }, renderList(unref(visibleRows), (row) => {
                      return openBlock(), createBlock(unref(_sfc_main$8), {
                        key: row.id,
                        "data-state": row.getIsSelected() && "selected"
                      }, {
                        default: withCtx(() => [
                          (openBlock(true), createBlock(Fragment, null, renderList(row.getVisibleCells(), (cell) => {
                            return openBlock(), createBlock(unref(_sfc_main$9), {
                              key: cell.id,
                              class: ("cn" in _ctx ? _ctx.cn : unref(cn))(cell.column.columnDef.cellClass)
                            }, {
                              default: withCtx(() => [
                                createVNode(unref(FlexRender), {
                                  render: cell.column.columnDef.cell,
                                  props: cell.getContext()
                                }, null, 8, ["render", "props"])
                              ]),
                              _: 2
                            }, 1032, ["class"]);
                          }), 128))
                        ]),
                        _: 2
                      }, 1032, ["data-state"]);
                    }), 128)) : (openBlock(), createBlock(unref(_sfc_main$8), { key: 1 }, {
                      default: withCtx(() => [
                        createVNode(unref(_sfc_main$9), {
                          colspan: unref(columns).length,
                          class: "aspect-video text-center"
                        }, {
                          default: withCtx(() => [
                            createTextVNode("No results.")
                          ]),
                          _: 1
                        }, 8, ["colspan"])
                      ]),
                      _: 1
                    }))
                  ];
                }),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
      _push(ssrRenderComponent(_component_DataTablePagination, { table: unref(table) }, null, _parent));
      _push(`</div>`);
    };
  }
};
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Sites/DataTable.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const _sfc_main$4 = {
  __name: "HoverText",
  __ssrInlineRender: true,
  props: ["class", "hoverClass", "innerText", "hoverText"],
  setup(__props) {
    const props = __props;
    const slotHtml = useSlotAsText();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_TooltipProvider = _sfc_main$l;
      const _component_Tooltip = _sfc_main$n;
      const _component_TooltipTrigger = _sfc_main$k;
      const _component_TooltipContent = _sfc_main$m;
      _push(ssrRenderComponent(_component_TooltipProvider, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_Tooltip, null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_TooltipTrigger, {
                    class: ("cn" in _ctx ? _ctx.cn : unref(cn))(props == null ? void 0 : props.class)
                  }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_TooltipContent, {
                    class: ("cn" in _ctx ? _ctx.cn : unref(cn))(props == null ? void 0 : props.hoverClass)
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_TooltipTrigger, {
                      class: ("cn" in _ctx ? _ctx.cn : unref(cn))(props == null ? void 0 : props.class),
                      innerHTML: (props == null ? void 0 : props.innerText) || unref(slotHtml)
                    }, null, 8, ["class", "innerHTML"]),
                    createVNode(_component_TooltipContent, {
                      class: ("cn" in _ctx ? _ctx.cn : unref(cn))(props == null ? void 0 : props.hoverClass),
                      innerHTML: (props == null ? void 0 : props.hoverText) || (props == null ? void 0 : props.innerText) || unref(slotHtml)
                    }, null, 8, ["class", "innerHTML"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_Tooltip, null, {
                default: withCtx(() => [
                  createVNode(_component_TooltipTrigger, {
                    class: ("cn" in _ctx ? _ctx.cn : unref(cn))(props == null ? void 0 : props.class),
                    innerHTML: (props == null ? void 0 : props.innerText) || unref(slotHtml)
                  }, null, 8, ["class", "innerHTML"]),
                  createVNode(_component_TooltipContent, {
                    class: ("cn" in _ctx ? _ctx.cn : unref(cn))(props == null ? void 0 : props.hoverClass),
                    innerHTML: (props == null ? void 0 : props.hoverText) || (props == null ? void 0 : props.innerText) || unref(slotHtml)
                  }, null, 8, ["class", "innerHTML"])
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
};
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/HoverText.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const _sfc_main$3 = {
  __name: "RowDomain",
  __ssrInlineRender: true,
  props: ["row", "class"],
  setup(__props) {
    var _a;
    const domains = ref((_a = __props.row.original) == null ? void 0 : _a.domain.split(" "));
    const hasValidSSL = computed(() => {
      var _a2, _b;
      return ((_a2 = __props.row.original) == null ? void 0 : _a2.enableSSL) && ((_b = __props.row.original) == null ? void 0 : _b.hasSSL);
    });
    return (_ctx, _push, _parent, _attrs) => {
      var _a2, _b;
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: ("cn" in _ctx ? _ctx.cn : unref(cn))("hstack", { "[&_*]:text-gray-500 opacity-40": !((_b = (_a2 = __props.row) == null ? void 0 : _a2.original) == null ? void 0 : _b.isActive) }, __props.class)
      }, _attrs))}><!--[-->`);
      ssrRenderList(unref(domains), (domain, index) => {
        _push(`<!--[-->`);
        if (domain !== "_") {
          _push(`<a class="${ssrRenderClass(["font-semibold", unref(hasValidSSL) ? "text-green-700" : "text-blue-500"])}"${ssrRenderAttr("href", `${unref(hasValidSSL) ? "https" : "http"}://${domain}`)} target="_blank">${ssrInterpolate(domain)}</a>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(domains).length - 1 !== index) {
          _push(ssrRenderComponent(unref(DotIcon), { class: "text-gray-500 size-4 mx-1" }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`<!--]-->`);
      });
      _push(`<!--]--></div>`);
    };
  }
};
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Sites/RowDomain.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const _sfc_main$2 = {
  __name: "RowActions",
  __ssrInlineRender: true,
  props: ["row"],
  emits: ["update:list"],
  setup(__props, { emit: __emit }) {
    const emits = __emit;
    const dropdownItemClass = ref(
      "relative flex cursor-pointer select-none items-center rounded-sm gap-2 px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-inherit [&>svg]:size-4 [&>svg]:shrink-0 text-xs w-full disabled:pointer-events-none disabled:opacity-20 font-medium uppercase"
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_DropdownMenu = _sfc_main$v;
      const _component_DropdownMenuTrigger = _sfc_main$p;
      const _component_Button = _sfc_main$C;
      const _component_DropdownMenuContent = _sfc_main$t;
      const _component_DropdownMenuItem = _sfc_main$s;
      const _component_SitesEditor = _sfc_main$g;
      const _component_ConfirmAction = _sfc_main$h;
      const _component_DropdownMenuSeparator = _sfc_main$q;
      const _component_NuxtLink = __nuxt_component_0;
      _push(ssrRenderComponent(_component_DropdownMenu, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_DropdownMenuTrigger, { "as-child": "" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                var _a, _b, _c, _d;
                if (_push3) {
                  _push3(ssrRenderComponent(_component_Button, {
                    variant: "ghost",
                    class: ["flex h-8 w-8 p-0 data-[state=open]:bg-muted", { "opacity-40": !((_b = (_a = __props.row) == null ? void 0 : _a.original) == null ? void 0 : _b.isActive) }]
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(unref(EllipsisIcon), { class: "h-4 w-4" }, null, _parent4, _scopeId3));
                        _push4(`<span class="sr-only"${_scopeId3}>Open Menu</span>`);
                      } else {
                        return [
                          createVNode(unref(EllipsisIcon), { class: "h-4 w-4" }),
                          createVNode("span", { class: "sr-only" }, "Open Menu")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_Button, {
                      variant: "ghost",
                      class: ["flex h-8 w-8 p-0 data-[state=open]:bg-muted", { "opacity-40": !((_d = (_c = __props.row) == null ? void 0 : _c.original) == null ? void 0 : _d.isActive) }]
                    }, {
                      default: withCtx(() => [
                        createVNode(unref(EllipsisIcon), { class: "h-4 w-4" }),
                        createVNode("span", { class: "sr-only" }, "Open Menu")
                      ]),
                      _: 1
                    }, 8, ["class"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_DropdownMenuContent, {
              align: "end",
              class: "w-[160px]"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_DropdownMenuItem, { "as-child": "" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      var _a, _b;
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_SitesEditor, {
                          conf: (_a = __props.row) == null ? void 0 : _a.original,
                          "onUpdate:list": ($event) => emits("update:list", $event),
                          class: [unref(dropdownItemClass), "flex"]
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(unref(FilePenLineIcon), null, null, _parent5, _scopeId4));
                              _push5(`Edit`);
                            } else {
                              return [
                                createVNode(unref(FilePenLineIcon)),
                                createTextVNode("Edit")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_SitesEditor, {
                            conf: (_b = __props.row) == null ? void 0 : _b.original,
                            "onUpdate:list": ($event) => emits("update:list", $event),
                            class: [unref(dropdownItemClass), "flex"]
                          }, {
                            default: withCtx(() => [
                              createVNode(unref(FilePenLineIcon)),
                              createTextVNode("Edit")
                            ]),
                            _: 1
                          }, 8, ["conf", "onUpdate:list", "class"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_DropdownMenuItem, { "as-child": "" }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_DropdownMenuItem, { "as-child": "" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l;
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_ConfirmAction, {
                          class: [unref(dropdownItemClass), "text-red-700"],
                          disabled: ((_b = (_a = __props.row) == null ? void 0 : _a.original) == null ? void 0 : _b.isDefault) || ((_d = (_c = __props.row) == null ? void 0 : _c.original) == null ? void 0 : _d.isActive),
                          actionPayload: { id: (_f = (_e = __props.row) == null ? void 0 : _e.original) == null ? void 0 : _f.confId },
                          action: "deleteSite",
                          "onUpdate:list": ($event) => emits("update:list", $event)
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(unref(TrashIcon), null, null, _parent5, _scopeId4));
                              _push5(`Delete`);
                            } else {
                              return [
                                createVNode(unref(TrashIcon)),
                                createTextVNode("Delete")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_ConfirmAction, {
                            class: [unref(dropdownItemClass), "text-red-700"],
                            disabled: ((_h = (_g = __props.row) == null ? void 0 : _g.original) == null ? void 0 : _h.isDefault) || ((_j = (_i = __props.row) == null ? void 0 : _i.original) == null ? void 0 : _j.isActive),
                            actionPayload: { id: (_l = (_k = __props.row) == null ? void 0 : _k.original) == null ? void 0 : _l.confId },
                            action: "deleteSite",
                            "onUpdate:list": ($event) => emits("update:list", $event)
                          }, {
                            default: withCtx(() => [
                              createVNode(unref(TrashIcon)),
                              createTextVNode("Delete")
                            ]),
                            _: 1
                          }, 8, ["class", "disabled", "actionPayload", "onUpdate:list"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_DropdownMenuSeparator, null, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_DropdownMenuItem, { "as-child": "" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l;
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_ConfirmAction, {
                          class: [unref(dropdownItemClass), "text-blue-700"],
                          disabled: ((_b = (_a = __props.row) == null ? void 0 : _a.original) == null ? void 0 : _b.isDefault) || ((_d = (_c = __props.row) == null ? void 0 : _c.original) == null ? void 0 : _d.isActive),
                          actionPayload: { id: (_f = (_e = __props.row) == null ? void 0 : _e.original) == null ? void 0 : _f.confId },
                          action: "enableSite",
                          "onUpdate:list": ($event) => emits("update:list", $event)
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(unref(ToggleRightIcon), null, null, _parent5, _scopeId4));
                              _push5(`Enable`);
                            } else {
                              return [
                                createVNode(unref(ToggleRightIcon)),
                                createTextVNode("Enable")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_ConfirmAction, {
                            class: [unref(dropdownItemClass), "text-blue-700"],
                            disabled: ((_h = (_g = __props.row) == null ? void 0 : _g.original) == null ? void 0 : _h.isDefault) || ((_j = (_i = __props.row) == null ? void 0 : _i.original) == null ? void 0 : _j.isActive),
                            actionPayload: { id: (_l = (_k = __props.row) == null ? void 0 : _k.original) == null ? void 0 : _l.confId },
                            action: "enableSite",
                            "onUpdate:list": ($event) => emits("update:list", $event)
                          }, {
                            default: withCtx(() => [
                              createVNode(unref(ToggleRightIcon)),
                              createTextVNode("Enable")
                            ]),
                            _: 1
                          }, 8, ["class", "disabled", "actionPayload", "onUpdate:list"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_DropdownMenuItem, { "as-child": "" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l;
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_ConfirmAction, {
                          class: [unref(dropdownItemClass), "text-red-700"],
                          disabled: ((_b = (_a = __props.row) == null ? void 0 : _a.original) == null ? void 0 : _b.isDefault) || !((_d = (_c = __props.row) == null ? void 0 : _c.original) == null ? void 0 : _d.isActive),
                          actionPayload: { id: (_f = (_e = __props.row) == null ? void 0 : _e.original) == null ? void 0 : _f.confId },
                          action: "disableSite",
                          "onUpdate:list": ($event) => emits("update:list", $event)
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(unref(ToggleLeftIcon), null, null, _parent5, _scopeId4));
                              _push5(`Disable`);
                            } else {
                              return [
                                createVNode(unref(ToggleLeftIcon)),
                                createTextVNode("Disable")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_ConfirmAction, {
                            class: [unref(dropdownItemClass), "text-red-700"],
                            disabled: ((_h = (_g = __props.row) == null ? void 0 : _g.original) == null ? void 0 : _h.isDefault) || !((_j = (_i = __props.row) == null ? void 0 : _i.original) == null ? void 0 : _j.isActive),
                            actionPayload: { id: (_l = (_k = __props.row) == null ? void 0 : _k.original) == null ? void 0 : _l.confId },
                            action: "disableSite",
                            "onUpdate:list": ($event) => emits("update:list", $event)
                          }, {
                            default: withCtx(() => [
                              createVNode(unref(ToggleLeftIcon)),
                              createTextVNode("Disable")
                            ]),
                            _: 1
                          }, 8, ["class", "disabled", "actionPayload", "onUpdate:list"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_DropdownMenuSeparator, null, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_DropdownMenuItem, { "as-child": "" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      var _a, _b, _c, _d, _e, _f, _g, _h;
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_ConfirmAction, {
                          class: [unref(dropdownItemClass), "text-gray-700"],
                          disabled: !((_b = (_a = __props.row) == null ? void 0 : _a.original) == null ? void 0 : _b.isActive),
                          actionPayload: { id: (_d = (_c = __props.row) == null ? void 0 : _c.original) == null ? void 0 : _d.confId },
                          action: "rebuildSite",
                          "onUpdate:list": ($event) => emits("update:list", $event)
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(unref(Repeat1Icon), null, null, _parent5, _scopeId4));
                              _push5(`Rebuild`);
                            } else {
                              return [
                                createVNode(unref(Repeat1Icon)),
                                createTextVNode("Rebuild")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_ConfirmAction, {
                            class: [unref(dropdownItemClass), "text-gray-700"],
                            disabled: !((_f = (_e = __props.row) == null ? void 0 : _e.original) == null ? void 0 : _f.isActive),
                            actionPayload: { id: (_h = (_g = __props.row) == null ? void 0 : _g.original) == null ? void 0 : _h.confId },
                            action: "rebuildSite",
                            "onUpdate:list": ($event) => emits("update:list", $event)
                          }, {
                            default: withCtx(() => [
                              createVNode(unref(Repeat1Icon)),
                              createTextVNode("Rebuild")
                            ]),
                            _: 1
                          }, 8, ["class", "disabled", "actionPayload", "onUpdate:list"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_DropdownMenuItem, { "as-child": "" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      var _a, _b, _c, _d;
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_NuxtLink, {
                          to: `/certs?monitor=${(_b = (_a = __props.row) == null ? void 0 : _a.original) == null ? void 0 : _b.domain}`,
                          as: "a",
                          class: [unref(dropdownItemClass), "text-cyan-600"]
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(unref(ShieldAlertIcon), null, null, _parent5, _scopeId4));
                              _push5(`Monitor SSL`);
                            } else {
                              return [
                                createVNode(unref(ShieldAlertIcon)),
                                createTextVNode("Monitor SSL")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_NuxtLink, {
                            to: `/certs?monitor=${(_d = (_c = __props.row) == null ? void 0 : _c.original) == null ? void 0 : _d.domain}`,
                            as: "a",
                            class: [unref(dropdownItemClass), "text-cyan-600"]
                          }, {
                            default: withCtx(() => [
                              createVNode(unref(ShieldAlertIcon)),
                              createTextVNode("Monitor SSL")
                            ]),
                            _: 1
                          }, 8, ["to", "class"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_DropdownMenuItem, { "as-child": "" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      var _a, _b, _c, _d;
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_NuxtLink, {
                          to: `/certs?install=${(_b = (_a = __props.row) == null ? void 0 : _a.original) == null ? void 0 : _b.domain}`,
                          as: "a",
                          class: [unref(dropdownItemClass), "text-green-600"]
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(unref(ShieldCheckIcon), null, null, _parent5, _scopeId4));
                              _push5(`Install SSL`);
                            } else {
                              return [
                                createVNode(unref(ShieldCheckIcon)),
                                createTextVNode("Install SSL")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_NuxtLink, {
                            to: `/certs?install=${(_d = (_c = __props.row) == null ? void 0 : _c.original) == null ? void 0 : _d.domain}`,
                            as: "a",
                            class: [unref(dropdownItemClass), "text-green-600"]
                          }, {
                            default: withCtx(() => [
                              createVNode(unref(ShieldCheckIcon)),
                              createTextVNode("Install SSL")
                            ]),
                            _: 1
                          }, 8, ["to", "class"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_DropdownMenuItem, { "as-child": "" }, {
                      default: withCtx(() => {
                        var _a;
                        return [
                          createVNode(_component_SitesEditor, {
                            conf: (_a = __props.row) == null ? void 0 : _a.original,
                            "onUpdate:list": ($event) => emits("update:list", $event),
                            class: [unref(dropdownItemClass), "flex"]
                          }, {
                            default: withCtx(() => [
                              createVNode(unref(FilePenLineIcon)),
                              createTextVNode("Edit")
                            ]),
                            _: 1
                          }, 8, ["conf", "onUpdate:list", "class"])
                        ];
                      }),
                      _: 1
                    }),
                    createVNode(_component_DropdownMenuItem, { "as-child": "" }),
                    createVNode(_component_DropdownMenuItem, { "as-child": "" }, {
                      default: withCtx(() => {
                        var _a, _b, _c, _d, _e, _f;
                        return [
                          createVNode(_component_ConfirmAction, {
                            class: [unref(dropdownItemClass), "text-red-700"],
                            disabled: ((_b = (_a = __props.row) == null ? void 0 : _a.original) == null ? void 0 : _b.isDefault) || ((_d = (_c = __props.row) == null ? void 0 : _c.original) == null ? void 0 : _d.isActive),
                            actionPayload: { id: (_f = (_e = __props.row) == null ? void 0 : _e.original) == null ? void 0 : _f.confId },
                            action: "deleteSite",
                            "onUpdate:list": ($event) => emits("update:list", $event)
                          }, {
                            default: withCtx(() => [
                              createVNode(unref(TrashIcon)),
                              createTextVNode("Delete")
                            ]),
                            _: 1
                          }, 8, ["class", "disabled", "actionPayload", "onUpdate:list"])
                        ];
                      }),
                      _: 1
                    }),
                    createVNode(_component_DropdownMenuSeparator),
                    createVNode(_component_DropdownMenuItem, { "as-child": "" }, {
                      default: withCtx(() => {
                        var _a, _b, _c, _d, _e, _f;
                        return [
                          createVNode(_component_ConfirmAction, {
                            class: [unref(dropdownItemClass), "text-blue-700"],
                            disabled: ((_b = (_a = __props.row) == null ? void 0 : _a.original) == null ? void 0 : _b.isDefault) || ((_d = (_c = __props.row) == null ? void 0 : _c.original) == null ? void 0 : _d.isActive),
                            actionPayload: { id: (_f = (_e = __props.row) == null ? void 0 : _e.original) == null ? void 0 : _f.confId },
                            action: "enableSite",
                            "onUpdate:list": ($event) => emits("update:list", $event)
                          }, {
                            default: withCtx(() => [
                              createVNode(unref(ToggleRightIcon)),
                              createTextVNode("Enable")
                            ]),
                            _: 1
                          }, 8, ["class", "disabled", "actionPayload", "onUpdate:list"])
                        ];
                      }),
                      _: 1
                    }),
                    createVNode(_component_DropdownMenuItem, { "as-child": "" }, {
                      default: withCtx(() => {
                        var _a, _b, _c, _d, _e, _f;
                        return [
                          createVNode(_component_ConfirmAction, {
                            class: [unref(dropdownItemClass), "text-red-700"],
                            disabled: ((_b = (_a = __props.row) == null ? void 0 : _a.original) == null ? void 0 : _b.isDefault) || !((_d = (_c = __props.row) == null ? void 0 : _c.original) == null ? void 0 : _d.isActive),
                            actionPayload: { id: (_f = (_e = __props.row) == null ? void 0 : _e.original) == null ? void 0 : _f.confId },
                            action: "disableSite",
                            "onUpdate:list": ($event) => emits("update:list", $event)
                          }, {
                            default: withCtx(() => [
                              createVNode(unref(ToggleLeftIcon)),
                              createTextVNode("Disable")
                            ]),
                            _: 1
                          }, 8, ["class", "disabled", "actionPayload", "onUpdate:list"])
                        ];
                      }),
                      _: 1
                    }),
                    createVNode(_component_DropdownMenuSeparator),
                    createVNode(_component_DropdownMenuItem, { "as-child": "" }, {
                      default: withCtx(() => {
                        var _a, _b, _c, _d;
                        return [
                          createVNode(_component_ConfirmAction, {
                            class: [unref(dropdownItemClass), "text-gray-700"],
                            disabled: !((_b = (_a = __props.row) == null ? void 0 : _a.original) == null ? void 0 : _b.isActive),
                            actionPayload: { id: (_d = (_c = __props.row) == null ? void 0 : _c.original) == null ? void 0 : _d.confId },
                            action: "rebuildSite",
                            "onUpdate:list": ($event) => emits("update:list", $event)
                          }, {
                            default: withCtx(() => [
                              createVNode(unref(Repeat1Icon)),
                              createTextVNode("Rebuild")
                            ]),
                            _: 1
                          }, 8, ["class", "disabled", "actionPayload", "onUpdate:list"])
                        ];
                      }),
                      _: 1
                    }),
                    createVNode(_component_DropdownMenuItem, { "as-child": "" }, {
                      default: withCtx(() => {
                        var _a, _b;
                        return [
                          createVNode(_component_NuxtLink, {
                            to: `/certs?monitor=${(_b = (_a = __props.row) == null ? void 0 : _a.original) == null ? void 0 : _b.domain}`,
                            as: "a",
                            class: [unref(dropdownItemClass), "text-cyan-600"]
                          }, {
                            default: withCtx(() => [
                              createVNode(unref(ShieldAlertIcon)),
                              createTextVNode("Monitor SSL")
                            ]),
                            _: 1
                          }, 8, ["to", "class"])
                        ];
                      }),
                      _: 1
                    }),
                    createVNode(_component_DropdownMenuItem, { "as-child": "" }, {
                      default: withCtx(() => {
                        var _a, _b;
                        return [
                          createVNode(_component_NuxtLink, {
                            to: `/certs?install=${(_b = (_a = __props.row) == null ? void 0 : _a.original) == null ? void 0 : _b.domain}`,
                            as: "a",
                            class: [unref(dropdownItemClass), "text-green-600"]
                          }, {
                            default: withCtx(() => [
                              createVNode(unref(ShieldCheckIcon)),
                              createTextVNode("Install SSL")
                            ]),
                            _: 1
                          }, 8, ["to", "class"])
                        ];
                      }),
                      _: 1
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_DropdownMenuTrigger, { "as-child": "" }, {
                default: withCtx(() => {
                  var _a, _b;
                  return [
                    createVNode(_component_Button, {
                      variant: "ghost",
                      class: ["flex h-8 w-8 p-0 data-[state=open]:bg-muted", { "opacity-40": !((_b = (_a = __props.row) == null ? void 0 : _a.original) == null ? void 0 : _b.isActive) }]
                    }, {
                      default: withCtx(() => [
                        createVNode(unref(EllipsisIcon), { class: "h-4 w-4" }),
                        createVNode("span", { class: "sr-only" }, "Open Menu")
                      ]),
                      _: 1
                    }, 8, ["class"])
                  ];
                }),
                _: 1
              }),
              createVNode(_component_DropdownMenuContent, {
                align: "end",
                class: "w-[160px]"
              }, {
                default: withCtx(() => [
                  createVNode(_component_DropdownMenuItem, { "as-child": "" }, {
                    default: withCtx(() => {
                      var _a;
                      return [
                        createVNode(_component_SitesEditor, {
                          conf: (_a = __props.row) == null ? void 0 : _a.original,
                          "onUpdate:list": ($event) => emits("update:list", $event),
                          class: [unref(dropdownItemClass), "flex"]
                        }, {
                          default: withCtx(() => [
                            createVNode(unref(FilePenLineIcon)),
                            createTextVNode("Edit")
                          ]),
                          _: 1
                        }, 8, ["conf", "onUpdate:list", "class"])
                      ];
                    }),
                    _: 1
                  }),
                  createVNode(_component_DropdownMenuItem, { "as-child": "" }),
                  createVNode(_component_DropdownMenuItem, { "as-child": "" }, {
                    default: withCtx(() => {
                      var _a, _b, _c, _d, _e, _f;
                      return [
                        createVNode(_component_ConfirmAction, {
                          class: [unref(dropdownItemClass), "text-red-700"],
                          disabled: ((_b = (_a = __props.row) == null ? void 0 : _a.original) == null ? void 0 : _b.isDefault) || ((_d = (_c = __props.row) == null ? void 0 : _c.original) == null ? void 0 : _d.isActive),
                          actionPayload: { id: (_f = (_e = __props.row) == null ? void 0 : _e.original) == null ? void 0 : _f.confId },
                          action: "deleteSite",
                          "onUpdate:list": ($event) => emits("update:list", $event)
                        }, {
                          default: withCtx(() => [
                            createVNode(unref(TrashIcon)),
                            createTextVNode("Delete")
                          ]),
                          _: 1
                        }, 8, ["class", "disabled", "actionPayload", "onUpdate:list"])
                      ];
                    }),
                    _: 1
                  }),
                  createVNode(_component_DropdownMenuSeparator),
                  createVNode(_component_DropdownMenuItem, { "as-child": "" }, {
                    default: withCtx(() => {
                      var _a, _b, _c, _d, _e, _f;
                      return [
                        createVNode(_component_ConfirmAction, {
                          class: [unref(dropdownItemClass), "text-blue-700"],
                          disabled: ((_b = (_a = __props.row) == null ? void 0 : _a.original) == null ? void 0 : _b.isDefault) || ((_d = (_c = __props.row) == null ? void 0 : _c.original) == null ? void 0 : _d.isActive),
                          actionPayload: { id: (_f = (_e = __props.row) == null ? void 0 : _e.original) == null ? void 0 : _f.confId },
                          action: "enableSite",
                          "onUpdate:list": ($event) => emits("update:list", $event)
                        }, {
                          default: withCtx(() => [
                            createVNode(unref(ToggleRightIcon)),
                            createTextVNode("Enable")
                          ]),
                          _: 1
                        }, 8, ["class", "disabled", "actionPayload", "onUpdate:list"])
                      ];
                    }),
                    _: 1
                  }),
                  createVNode(_component_DropdownMenuItem, { "as-child": "" }, {
                    default: withCtx(() => {
                      var _a, _b, _c, _d, _e, _f;
                      return [
                        createVNode(_component_ConfirmAction, {
                          class: [unref(dropdownItemClass), "text-red-700"],
                          disabled: ((_b = (_a = __props.row) == null ? void 0 : _a.original) == null ? void 0 : _b.isDefault) || !((_d = (_c = __props.row) == null ? void 0 : _c.original) == null ? void 0 : _d.isActive),
                          actionPayload: { id: (_f = (_e = __props.row) == null ? void 0 : _e.original) == null ? void 0 : _f.confId },
                          action: "disableSite",
                          "onUpdate:list": ($event) => emits("update:list", $event)
                        }, {
                          default: withCtx(() => [
                            createVNode(unref(ToggleLeftIcon)),
                            createTextVNode("Disable")
                          ]),
                          _: 1
                        }, 8, ["class", "disabled", "actionPayload", "onUpdate:list"])
                      ];
                    }),
                    _: 1
                  }),
                  createVNode(_component_DropdownMenuSeparator),
                  createVNode(_component_DropdownMenuItem, { "as-child": "" }, {
                    default: withCtx(() => {
                      var _a, _b, _c, _d;
                      return [
                        createVNode(_component_ConfirmAction, {
                          class: [unref(dropdownItemClass), "text-gray-700"],
                          disabled: !((_b = (_a = __props.row) == null ? void 0 : _a.original) == null ? void 0 : _b.isActive),
                          actionPayload: { id: (_d = (_c = __props.row) == null ? void 0 : _c.original) == null ? void 0 : _d.confId },
                          action: "rebuildSite",
                          "onUpdate:list": ($event) => emits("update:list", $event)
                        }, {
                          default: withCtx(() => [
                            createVNode(unref(Repeat1Icon)),
                            createTextVNode("Rebuild")
                          ]),
                          _: 1
                        }, 8, ["class", "disabled", "actionPayload", "onUpdate:list"])
                      ];
                    }),
                    _: 1
                  }),
                  createVNode(_component_DropdownMenuItem, { "as-child": "" }, {
                    default: withCtx(() => {
                      var _a, _b;
                      return [
                        createVNode(_component_NuxtLink, {
                          to: `/certs?monitor=${(_b = (_a = __props.row) == null ? void 0 : _a.original) == null ? void 0 : _b.domain}`,
                          as: "a",
                          class: [unref(dropdownItemClass), "text-cyan-600"]
                        }, {
                          default: withCtx(() => [
                            createVNode(unref(ShieldAlertIcon)),
                            createTextVNode("Monitor SSL")
                          ]),
                          _: 1
                        }, 8, ["to", "class"])
                      ];
                    }),
                    _: 1
                  }),
                  createVNode(_component_DropdownMenuItem, { "as-child": "" }, {
                    default: withCtx(() => {
                      var _a, _b;
                      return [
                        createVNode(_component_NuxtLink, {
                          to: `/certs?install=${(_b = (_a = __props.row) == null ? void 0 : _a.original) == null ? void 0 : _b.domain}`,
                          as: "a",
                          class: [unref(dropdownItemClass), "text-green-600"]
                        }, {
                          default: withCtx(() => [
                            createVNode(unref(ShieldCheckIcon)),
                            createTextVNode("Install SSL")
                          ]),
                          _: 1
                        }, 8, ["to", "class"])
                      ];
                    }),
                    _: 1
                  })
                ]),
                _: 1
              })
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Sites/RowActions.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = {
  __name: "RowConfType",
  __ssrInlineRender: true,
  props: ["row", "class"],
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c, _d, _e, _f, _g;
      const _component_HoverText = _sfc_main$4;
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: ("cn" in _ctx ? _ctx.cn : unref(cn))("hstack justify-start space-x-2 [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-gray-400", ((_b = (_a = __props.row) == null ? void 0 : _a.original) == null ? void 0 : _b.isActive) ? null : "[&_span]:text-gray-500 opacity-40", __props.class)
      }, _attrs))}>`);
      if ((_d = (_c = __props.row) == null ? void 0 : _c.original) == null ? void 0 : _d.confType) {
        _push(ssrRenderComponent(_component_HoverText, {
          hoverText: (_f = (_e = __props.row) == null ? void 0 : _e.original) == null ? void 0 : _f.confType
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            var _a2, _b2, _c2, _d2, _e2, _f2, _g2, _h, _i, _j, _k, _l;
            if (_push2) {
              if (((_b2 = (_a2 = __props.row) == null ? void 0 : _a2.original) == null ? void 0 : _b2.confType) === "serve") {
                _push2(ssrRenderComponent(unref(FolderOpenIcon), null, null, _parent2, _scopeId));
              } else if (((_d2 = (_c2 = __props.row) == null ? void 0 : _c2.original) == null ? void 0 : _d2.confType) === "proxy") {
                _push2(ssrRenderComponent(unref(FolderRootIcon), null, null, _parent2, _scopeId));
              } else if (((_f2 = (_e2 = __props.row) == null ? void 0 : _e2.original) == null ? void 0 : _f2.confType) === "redirect") {
                _push2(ssrRenderComponent(unref(FolderSymlinkIcon), null, null, _parent2, _scopeId));
              } else {
                _push2(ssrRenderComponent(unref(WifiZeroIcon), null, null, _parent2, _scopeId));
              }
            } else {
              return [
                ((_h = (_g2 = __props.row) == null ? void 0 : _g2.original) == null ? void 0 : _h.confType) === "serve" ? (openBlock(), createBlock(unref(FolderOpenIcon), { key: 1 })) : ((_j = (_i = __props.row) == null ? void 0 : _i.original) == null ? void 0 : _j.confType) === "proxy" ? (openBlock(), createBlock(unref(FolderRootIcon), { key: 2 })) : ((_l = (_k = __props.row) == null ? void 0 : _k.original) == null ? void 0 : _l.confType) === "redirect" ? (openBlock(), createBlock(unref(FolderSymlinkIcon), { key: 3 })) : (openBlock(), createBlock(unref(WifiZeroIcon), { key: 4 }))
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      if ((_g = __props.row.original) == null ? void 0 : _g.hasSSLMonitor) {
        _push(ssrRenderComponent(_component_HoverText, { hoverText: "SSL monitoring is active" }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(BinocularsIcon), null, null, _parent2, _scopeId));
            } else {
              return [
                createVNode(unref(BinocularsIcon))
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Sites/RowConfType.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = {
  __name: "sites",
  __ssrInlineRender: true,
  setup(__props) {
    const availableSites = useApiFetch(`/api/fetch/availableSites`);
    const availableSiteCols = [
      {
        id: "isActive",
        accessorFn: (row) => (row == null ? void 0 : row.isActive) === true ? "1" : "0",
        enableHiding: false
      },
      {
        accessorKey: "confType",
        header: "",
        cell: ({ row }) => h(_sfc_main$1, { row }),
        enableHiding: false
      },
      {
        accessorKey: "confName",
        header: ({ column }) => h(_sfc_main$o, { column, title: "Configuration" }),
        cell: ({ row }) => {
          var _a, _b;
          return h("div", { class: ["font-mono text-xs text-gray-500 truncate w-[160px]", { "opacity-40": !((_a = row == null ? void 0 : row.original) == null ? void 0 : _a.isActive) }] }, (_b = row == null ? void 0 : row.original) == null ? void 0 : _b.confName);
        }
      },
      {
        accessorKey: "domain",
        header: ({ column }) => h(_sfc_main$o, { column, title: "Domains" }),
        cell: ({ row }) => h(_sfc_main$3, { row, class: "font-mono font-medium text-xs truncate w-[180px]" })
      },
      {
        accessorKey: "target",
        header: ({ column }) => h(_sfc_main$o, { column, title: "Target" }),
        cell: ({ row }) => {
          var _a, _b, _c;
          return h(_sfc_main$4, {
            class: cn(["font-mono text-left text-xs text-pink-600 truncate w-[320px]", { "text-gray-500 opacity-40": !((_a = row == null ? void 0 : row.original) == null ? void 0 : _a.isActive) }]),
            innerText: (_b = row == null ? void 0 : row.original) == null ? void 0 : _b.target,
            hoverText: (_c = row == null ? void 0 : row.original) == null ? void 0 : _c.target,
            hoverClass: ""
          });
        }
      },
      {
        id: "actions",
        cell: ({ row }) => h(_sfc_main$2, { row, "onUpdate:list": () => availableSites.reload.value() })
      }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      const _component_MainHeading = _sfc_main$z;
      const _component_HintButton = _sfc_main$j;
      const _component_SitesEditor = _sfc_main$g;
      const _component_ConfirmAction = _sfc_main$h;
      const _component_SimpleCard = _sfc_main$A;
      const _component_Skeleton = _sfc_main$B;
      const _component_SitesDataTable = _sfc_main$5;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "w-full h-full flex-1" }, _attrs))}><div class="hstack items-start justify-between">`);
      _push(ssrRenderComponent(_component_MainHeading, { title: "Web Sites" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Manage or customize configuration files for your websites.`);
          } else {
            return [
              createTextVNode("Manage or customize configuration files for your websites.")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="flex gap-2">`);
      _push(ssrRenderComponent(_component_HintButton, {
        title: "Refresh",
        variant: "outline",
        size: "sm",
        class: "relative hstack bg-background text-muted-foreground h-10 w-10 [&_svg]:size-4",
        onClick: (_a = unref(availableSites)) == null ? void 0 : _a.reload.value
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(RefreshCwIcon), null, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(RefreshCwIcon))
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_SitesEditor, {
        "onUpdate:list": () => {
          var _a2;
          return (_a2 = unref(availableSites)) == null ? void 0 : _a2.reload.value();
        },
        asChild: ""
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_HintButton, {
              title: "Add Site",
              variant: "outline",
              size: "sm",
              class: "relative hstack bg-background text-muted-foreground h-10 w-10 [&_svg]:size-4"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(PlusIcon), null, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(PlusIcon))
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_HintButton, {
                title: "Add Site",
                variant: "outline",
                size: "sm",
                class: "relative hstack bg-background text-muted-foreground h-10 w-10 [&_svg]:size-4"
              }, {
                default: withCtx(() => [
                  createVNode(unref(PlusIcon))
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_ConfirmAction, {
        class: ["text-gray-700"],
        action: "rebuildAllSites",
        "onUpdate:list": () => {
          var _a2;
          return (_a2 = unref(availableSites)) == null ? void 0 : _a2.reload.value();
        },
        title: "Are you sure to rebuild all site configurations?",
        asChild: ""
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_HintButton, {
              title: "Rebuild All",
              variant: "outline",
              size: "sm",
              class: "relative hstack bg-background text-muted-foreground h-10 w-10 [&_svg]:size-4"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(ReplaceAllIcon), null, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(ReplaceAllIcon))
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_HintButton, {
                title: "Rebuild All",
                variant: "outline",
                size: "sm",
                class: "relative hstack bg-background text-muted-foreground h-10 w-10 [&_svg]:size-4"
              }, {
                default: withCtx(() => [
                  createVNode(unref(ReplaceAllIcon))
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div>`);
      _push(ssrRenderComponent(_component_SimpleCard, { class: "gap-2" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          var _a2, _b, _c, _d, _e, _f, _g, _h;
          if (_push2) {
            if ((_b = (_a2 = unref(availableSites)) == null ? void 0 : _a2.isLoading) == null ? void 0 : _b.value) {
              _push2(ssrRenderComponent(_component_Skeleton, { class: "aspect-video" }, null, _parent2, _scopeId));
            } else {
              _push2(ssrRenderComponent(_component_SitesDataTable, {
                data: (_d = (_c = unref(availableSites)) == null ? void 0 : _c.result) == null ? void 0 : _d.value,
                columns: availableSiteCols,
                sorting: [{ id: "confName", desc: false }]
              }, null, _parent2, _scopeId));
            }
          } else {
            return [
              ((_f = (_e = unref(availableSites)) == null ? void 0 : _e.isLoading) == null ? void 0 : _f.value) ? (openBlock(), createBlock(_component_Skeleton, {
                key: 0,
                class: "aspect-video"
              })) : (openBlock(), createBlock(_component_SitesDataTable, {
                key: 1,
                data: (_h = (_g = unref(availableSites)) == null ? void 0 : _g.result) == null ? void 0 : _h.value,
                columns: availableSiteCols,
                sorting: [{ id: "confName", desc: false }]
              }, null, 8, ["data"]))
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/sites.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=sites-63td7vyy.mjs.map
