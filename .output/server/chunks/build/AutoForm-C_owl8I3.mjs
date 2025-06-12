import { defineComponent, toRefs, computed, createVNode, resolveDynamicComponent, mergeProps, withCtx, renderSlot, createBlock, openBlock, Fragment, renderList, unref, ref, watch, provide, createTextVNode, toDisplayString, createCommentVNode, toValue, inject, useSSRContext } from 'vue';
import { ssrRenderVNode, ssrRenderSlot, ssrRenderList, ssrRenderComponent, ssrRenderAttrs, ssrInterpolate, ssrRenderClass } from 'vue/server-renderer';
import { Form, useFormValues, useFieldValue, useField, FieldContextKey, FieldArray, Field, ErrorMessage, useFieldError, useIsFieldTouched, useIsFieldDirty, useIsFieldValid } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { createContext, Separator, useForwardPropsEmits, SelectRoot, useForwardProps, SelectTrigger, SelectIcon, SelectValue, SelectPortal, SelectContent, SelectViewport, SelectItem, SelectItemIndicator, SelectItemText, AccordionRoot, useId, AccordionItem, AccordionHeader, AccordionTrigger, AccordionContent, Slot, SwitchRoot, SwitchThumb, RadioGroupRoot, RadioGroupItem, RadioGroupIndicator, Label, PopoverRoot, PopoverTrigger, PopoverPortal, PopoverContent, CalendarRoot, SelectScrollUpButton, SelectScrollDownButton, CalendarHeader, CalendarPrev, CalendarHeading, CalendarNext, CalendarGrid, CalendarGridHead, CalendarGridRow, CalendarHeadCell, CalendarGridBody, CalendarCell, CalendarCellTrigger } from 'radix-vue';
import { _ as _sfc_main$M, c as cn, b as buttonVariants } from './index-CBgozba7.mjs';
import { TrashIcon as TrashIcon$1, CalendarIcon, CaretSortIcon, CheckIcon, ChevronDownIcon, ChevronUpIcon, ChevronLeftIcon, ChevronRightIcon } from '@radix-icons/vue';
import { TrashIcon, PlusIcon } from 'lucide-vue-next';
import * as z from 'zod';
import { _ as _sfc_main$N, a as _sfc_main$1$1 } from './Input-DZIpcJF6.mjs';
import { DateFormatter, getLocalTimeZone } from '@internationalized/date';
import { useVModel } from '@vueuse/core';

const FORM_ITEM_INJECTION_KEY = Symbol();
function useFormField() {
  const fieldContext = inject(FieldContextKey);
  const fieldItemContext = inject(FORM_ITEM_INJECTION_KEY);
  if (!fieldContext)
    throw new Error("useFormField should be used within <FormField>");
  const { name } = fieldContext;
  const id = fieldItemContext;
  const fieldState = {
    valid: useIsFieldValid(name),
    isDirty: useIsFieldDirty(name),
    isTouched: useIsFieldTouched(name),
    error: useFieldError(name)
  };
  return {
    id,
    name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState
  };
}
const _sfc_main$L = /* @__PURE__ */ defineComponent({
  __name: "FormControl",
  __ssrInlineRender: true,
  setup(__props) {
    const { error, formItemId, formDescriptionId, formMessageId } = useFormField();
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(Slot), mergeProps({
        id: unref(formItemId),
        "aria-describedby": !unref(error) ? `${unref(formDescriptionId)}` : `${unref(formDescriptionId)} ${unref(formMessageId)}`,
        "aria-invalid": !!unref(error)
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
const _sfc_setup$L = _sfc_main$L.setup;
_sfc_main$L.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/form/FormControl.vue");
  return _sfc_setup$L ? _sfc_setup$L(props, ctx) : void 0;
};
const _sfc_main$K = /* @__PURE__ */ defineComponent({
  __name: "FormDescription",
  __ssrInlineRender: true,
  props: {
    class: {}
  },
  setup(__props) {
    const props = __props;
    const { formDescriptionId } = useFormField();
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<p${ssrRenderAttrs(mergeProps({
        id: unref(formDescriptionId),
        class: unref(cn)("text-sm text-muted-foreground", props.class)
      }, _attrs))}>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</p>`);
    };
  }
});
const _sfc_setup$K = _sfc_main$K.setup;
_sfc_main$K.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/form/FormDescription.vue");
  return _sfc_setup$K ? _sfc_setup$K(props, ctx) : void 0;
};
const _sfc_main$J = /* @__PURE__ */ defineComponent({
  __name: "FormItem",
  __ssrInlineRender: true,
  props: {
    class: {}
  },
  setup(__props) {
    const props = __props;
    const id = useId();
    provide(FORM_ITEM_INJECTION_KEY, id);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: unref(cn)("space-y-2", props.class)
      }, _attrs))}>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</div>`);
    };
  }
});
const _sfc_setup$J = _sfc_main$J.setup;
_sfc_main$J.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/form/FormItem.vue");
  return _sfc_setup$J ? _sfc_setup$J(props, ctx) : void 0;
};
const _sfc_main$I = /* @__PURE__ */ defineComponent({
  __name: "Label",
  __ssrInlineRender: true,
  props: {
    for: {},
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
      _push(ssrRenderComponent(unref(Label), mergeProps(delegatedProps.value, {
        class: unref(cn)(
          "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
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
const _sfc_setup$I = _sfc_main$I.setup;
_sfc_main$I.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/label/Label.vue");
  return _sfc_setup$I ? _sfc_setup$I(props, ctx) : void 0;
};
const _sfc_main$H = /* @__PURE__ */ defineComponent({
  __name: "FormLabel",
  __ssrInlineRender: true,
  props: {
    for: {},
    asChild: { type: Boolean },
    as: { type: [String, Object, Function] },
    class: {}
  },
  setup(__props) {
    const props = __props;
    const { error, formItemId } = useFormField();
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(_sfc_main$I), mergeProps({
        class: unref(cn)(
          unref(error) && "text-destructive",
          props.class
        ),
        for: unref(formItemId)
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
const _sfc_setup$H = _sfc_main$H.setup;
_sfc_main$H.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/form/FormLabel.vue");
  return _sfc_setup$H ? _sfc_setup$H(props, ctx) : void 0;
};
const _sfc_main$G = /* @__PURE__ */ defineComponent({
  __name: "FormMessage",
  __ssrInlineRender: true,
  setup(__props) {
    const { name, formMessageId } = useFormField();
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(ErrorMessage), mergeProps({
        id: unref(formMessageId),
        as: "p",
        name: toValue(unref(name)),
        class: "text-[0.8rem] font-medium text-destructive"
      }, _attrs), null, _parent));
    };
  }
});
const _sfc_setup$G = _sfc_main$G.setup;
_sfc_main$G.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/form/FormMessage.vue");
  return _sfc_setup$G ? _sfc_setup$G(props, ctx) : void 0;
};
const _sfc_main$F = /* @__PURE__ */ defineComponent({
  __name: "Accordion",
  __ssrInlineRender: true,
  props: {
    collapsible: { type: Boolean },
    disabled: { type: Boolean },
    dir: {},
    orientation: {},
    asChild: { type: Boolean },
    as: { type: [String, Object, Function] },
    type: {},
    modelValue: {},
    defaultValue: {}
  },
  emits: ["update:modelValue"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const forwarded = useForwardPropsEmits(props, emits);
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(AccordionRoot), mergeProps(unref(forwarded), _attrs), {
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
const _sfc_setup$F = _sfc_main$F.setup;
_sfc_main$F.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/accordion/Accordion.vue");
  return _sfc_setup$F ? _sfc_setup$F(props, ctx) : void 0;
};
const _sfc_main$E = /* @__PURE__ */ defineComponent({
  __name: "AccordionContent",
  __ssrInlineRender: true,
  props: {
    forceMount: { type: Boolean },
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
      _push(ssrRenderComponent(unref(AccordionContent), mergeProps(delegatedProps.value, { class: "overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down" }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="${ssrRenderClass(unref(cn)("pb-4 pt-0", props.class))}"${_scopeId}>`);
            ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent2, _scopeId);
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", {
                class: unref(cn)("pb-4 pt-0", props.class)
              }, [
                renderSlot(_ctx.$slots, "default")
              ], 2)
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
});
const _sfc_setup$E = _sfc_main$E.setup;
_sfc_main$E.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/accordion/AccordionContent.vue");
  return _sfc_setup$E ? _sfc_setup$E(props, ctx) : void 0;
};
const _sfc_main$D = /* @__PURE__ */ defineComponent({
  __name: "AccordionItem",
  __ssrInlineRender: true,
  props: {
    disabled: { type: Boolean },
    value: {},
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
      _push(ssrRenderComponent(unref(AccordionItem), mergeProps(unref(forwardedProps), {
        class: unref(cn)("border-b", props.class)
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
const _sfc_setup$D = _sfc_main$D.setup;
_sfc_main$D.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/accordion/AccordionItem.vue");
  return _sfc_setup$D ? _sfc_setup$D(props, ctx) : void 0;
};
const _sfc_main$C = /* @__PURE__ */ defineComponent({
  __name: "AccordionTrigger",
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
      _push(ssrRenderComponent(unref(AccordionHeader), mergeProps({ class: "flex" }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(AccordionTrigger), mergeProps(delegatedProps.value, {
              class: unref(cn)(
                "flex flex-1 items-center justify-between py-4 text-sm font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180",
                props.class
              )
            }), {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  ssrRenderSlot(_ctx.$slots, "default", {}, null, _push3, _parent3, _scopeId2);
                  ssrRenderSlot(_ctx.$slots, "icon", {}, () => {
                    _push3(ssrRenderComponent(unref(ChevronDownIcon), { class: "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" }, null, _parent3, _scopeId2));
                  }, _push3, _parent3, _scopeId2);
                } else {
                  return [
                    renderSlot(_ctx.$slots, "default"),
                    renderSlot(_ctx.$slots, "icon", {}, () => [
                      createVNode(unref(ChevronDownIcon), { class: "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" })
                    ])
                  ];
                }
              }),
              _: 3
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(AccordionTrigger), mergeProps(delegatedProps.value, {
                class: unref(cn)(
                  "flex flex-1 items-center justify-between py-4 text-sm font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180",
                  props.class
                )
              }), {
                default: withCtx(() => [
                  renderSlot(_ctx.$slots, "default"),
                  renderSlot(_ctx.$slots, "icon", {}, () => [
                    createVNode(unref(ChevronDownIcon), { class: "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" })
                  ])
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
const _sfc_setup$C = _sfc_main$C.setup;
_sfc_main$C.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/accordion/AccordionTrigger.vue");
  return _sfc_setup$C ? _sfc_setup$C(props, ctx) : void 0;
};
const _sfc_main$B = /* @__PURE__ */ defineComponent({
  __name: "Separator",
  __ssrInlineRender: true,
  props: {
    orientation: {},
    decorative: { type: Boolean },
    asChild: { type: Boolean },
    as: { type: [String, Object, Function] },
    class: {},
    label: {}
  },
  setup(__props) {
    const props = __props;
    const delegatedProps = computed(() => {
      const { class: _, ...delegated } = props;
      return delegated;
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(Separator), mergeProps(delegatedProps.value, {
        class: unref(cn)(
          "shrink-0 bg-border relative",
          props.orientation === "vertical" ? "w-px h-full" : "h-px w-full",
          props.class
        )
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (props.label) {
              _push2(`<span class="${ssrRenderClass(
                unref(cn)(
                  "text-xs text-muted-foreground bg-background absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex justify-center items-center",
                  props.orientation === "vertical" ? "w-[1px] px-1 py-2" : "h-[1px] py-1 px-2"
                )
              )}"${_scopeId}>${ssrInterpolate(props.label)}</span>`);
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              props.label ? (openBlock(), createBlock("span", {
                key: 0,
                class: unref(cn)(
                  "text-xs text-muted-foreground bg-background absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex justify-center items-center",
                  props.orientation === "vertical" ? "w-[1px] px-1 py-2" : "h-[1px] py-1 px-2"
                )
              }, toDisplayString(props.label), 3)) : createCommentVNode("", true)
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup$B = _sfc_main$B.setup;
_sfc_main$B.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/separator/Separator.vue");
  return _sfc_setup$B ? _sfc_setup$B(props, ctx) : void 0;
};
const _sfc_main$A = /* @__PURE__ */ defineComponent({
  __name: "AutoFormLabel",
  __ssrInlineRender: true,
  props: {
    required: { type: Boolean }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(_sfc_main$H), _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent2, _scopeId);
            if (_ctx.required) {
              _push2(`<span class="text-destructive"${_scopeId}> *</span>`);
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              renderSlot(_ctx.$slots, "default"),
              _ctx.required ? (openBlock(), createBlock("span", {
                key: 0,
                class: "text-destructive"
              }, " *")) : createCommentVNode("", true)
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
});
const _sfc_setup$A = _sfc_main$A.setup;
_sfc_main$A.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/auto-form/AutoFormLabel.vue");
  return _sfc_setup$A ? _sfc_setup$A(props, ctx) : void 0;
};
function beautifyObjectName(string) {
  let output = string.replace(/\[\d+\]/g, "").replace(/([A-Z])/g, " $1");
  output = output.charAt(0).toUpperCase() + output.slice(1);
  return output;
}
function getIndexIfArray(string) {
  const indexRegex = /\[(\d+)\]/;
  const match = string.match(indexRegex);
  const index = match ? Number.parseInt(match[1]) : void 0;
  return index;
}
function getBaseSchema(schema) {
  if (!schema)
    return null;
  if ("innerType" in schema._def)
    return getBaseSchema(schema._def.innerType);
  if ("schema" in schema._def)
    return getBaseSchema(schema._def.schema);
  return schema;
}
function getBaseType(schema) {
  const baseSchema = getBaseSchema(schema);
  return baseSchema ? baseSchema._def.typeName : "";
}
function getDefaultValueInZodStack(schema) {
  const typedSchema = schema;
  if (typedSchema._def.typeName === "ZodDefault")
    return typedSchema._def.defaultValue();
  if ("innerType" in typedSchema._def) {
    return getDefaultValueInZodStack(
      typedSchema._def.innerType
    );
  }
  if ("schema" in typedSchema._def) {
    return getDefaultValueInZodStack(
      typedSchema._def.schema
    );
  }
  return void 0;
}
function getObjectFormSchema(schema) {
  if ((schema == null ? void 0 : schema._def.typeName) === "ZodEffects") {
    const typedSchema = schema;
    return getObjectFormSchema(typedSchema._def.schema);
  }
  return schema;
}
function isNotNestedPath(path) {
  return /^\[.+\]$/.test(path);
}
function isObject(obj) {
  return obj !== null && !!obj && typeof obj === "object" && !Array.isArray(obj);
}
function isContainerValue(value) {
  return isObject(value) || Array.isArray(value);
}
function cleanupNonNestedPath(path) {
  if (isNotNestedPath(path))
    return path.replace(/\[|\]/g, "");
  return path;
}
function getFromPath(object, path, fallback) {
  if (!object)
    return fallback;
  if (isNotNestedPath(path))
    return object[cleanupNonNestedPath(path)];
  const resolvedValue = (path || "").split(/\.|\[(\d+)\]/).filter(Boolean).reduce((acc, propKey) => {
    if (isContainerValue(acc) && propKey in acc)
      return acc[propKey];
    return fallback;
  }, object);
  return resolvedValue;
}
function booleanishToBoolean(value) {
  switch (value) {
    case "true":
    case true:
      return true;
    case "false":
    case false:
      return false;
  }
}
function maybeBooleanishToBoolean(value) {
  return value ? booleanishToBoolean(value) : void 0;
}
const _sfc_main$z = /* @__PURE__ */ defineComponent({
  __name: "AutoFormFieldArray",
  __ssrInlineRender: true,
  props: {
    fieldName: {},
    required: { type: Boolean },
    config: {},
    schema: {},
    disabled: { type: Boolean }
  },
  setup(__props) {
    const props = __props;
    function isZodArray(item) {
      return item instanceof z.ZodArray;
    }
    function isZodDefault(item) {
      return item instanceof z.ZodDefault;
    }
    const itemShape = computed(() => {
      if (!props.schema)
        return;
      const schema = isZodArray(props.schema) ? props.schema._def.type : isZodDefault(props.schema) ? props.schema._def.innerType._def.type : null;
      return {
        type: getBaseType(schema),
        schema
      };
    });
    const fieldContext = useField(props.fieldName);
    provide(FieldContextKey, fieldContext);
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(FieldArray), mergeProps({
        as: "section",
        name: _ctx.fieldName
      }, _attrs), {
        default: withCtx(({ fields, remove, push }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            ssrRenderSlot(_ctx.$slots, "default", props, () => {
              _push2(ssrRenderComponent(unref(_sfc_main$F), {
                type: "multiple",
                class: "w-full",
                collapsible: "",
                disabled: _ctx.disabled,
                "as-child": ""
              }, {
                default: withCtx((_, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(unref(_sfc_main$J), null, {
                      default: withCtx((_2, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(unref(_sfc_main$D), {
                            value: _ctx.fieldName,
                            class: "border-none"
                          }, {
                            default: withCtx((_3, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(ssrRenderComponent(unref(_sfc_main$C), null, {
                                  default: withCtx((_4, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(ssrRenderComponent(_sfc_main$A, {
                                        class: "text-base",
                                        required: _ctx.required
                                      }, {
                                        default: withCtx((_5, _push7, _parent7, _scopeId6) => {
                                          var _a, _b;
                                          if (_push7) {
                                            _push7(`${ssrInterpolate(((_a = _ctx.schema) == null ? void 0 : _a.description) || unref(beautifyObjectName)(_ctx.fieldName))}`);
                                          } else {
                                            return [
                                              createTextVNode(toDisplayString(((_b = _ctx.schema) == null ? void 0 : _b.description) || unref(beautifyObjectName)(_ctx.fieldName)), 1)
                                            ];
                                          }
                                        }),
                                        _: 2
                                      }, _parent6, _scopeId5));
                                    } else {
                                      return [
                                        createVNode(_sfc_main$A, {
                                          class: "text-base",
                                          required: _ctx.required
                                        }, {
                                          default: withCtx(() => {
                                            var _a;
                                            return [
                                              createTextVNode(toDisplayString(((_a = _ctx.schema) == null ? void 0 : _a.description) || unref(beautifyObjectName)(_ctx.fieldName)), 1)
                                            ];
                                          }),
                                          _: 1
                                        }, 8, ["required"])
                                      ];
                                    }
                                  }),
                                  _: 2
                                }, _parent5, _scopeId4));
                                _push5(ssrRenderComponent(unref(_sfc_main$E), null, {
                                  default: withCtx((_4, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(`<!--[-->`);
                                      ssrRenderList(fields, (field, index) => {
                                        _push6(`<div class="mb-4 p-1"${_scopeId5}>`);
                                        _push6(ssrRenderComponent(_sfc_main$1, {
                                          "field-name": `${_ctx.fieldName}[${index}]`,
                                          label: _ctx.fieldName,
                                          shape: itemShape.value,
                                          config: _ctx.config
                                        }, null, _parent6, _scopeId5));
                                        _push6(`<div class="!my-4 flex justify-end"${_scopeId5}>`);
                                        _push6(ssrRenderComponent(unref(_sfc_main$M), {
                                          type: "button",
                                          size: "icon",
                                          variant: "secondary",
                                          onClick: ($event) => remove(index)
                                        }, {
                                          default: withCtx((_5, _push7, _parent7, _scopeId6) => {
                                            if (_push7) {
                                              _push7(ssrRenderComponent(unref(TrashIcon), { size: 16 }, null, _parent7, _scopeId6));
                                            } else {
                                              return [
                                                createVNode(unref(TrashIcon), { size: 16 })
                                              ];
                                            }
                                          }),
                                          _: 2
                                        }, _parent6, _scopeId5));
                                        _push6(`</div>`);
                                        if (!field.isLast) {
                                          _push6(ssrRenderComponent(unref(_sfc_main$B), null, null, _parent6, _scopeId5));
                                        } else {
                                          _push6(`<!---->`);
                                        }
                                        _push6(`</div>`);
                                      });
                                      _push6(`<!--]-->`);
                                      _push6(ssrRenderComponent(unref(_sfc_main$M), {
                                        type: "button",
                                        variant: "secondary",
                                        class: "mt-4 flex items-center",
                                        onClick: ($event) => push(null)
                                      }, {
                                        default: withCtx((_5, _push7, _parent7, _scopeId6) => {
                                          if (_push7) {
                                            _push7(ssrRenderComponent(unref(PlusIcon), {
                                              class: "mr-2",
                                              size: 16
                                            }, null, _parent7, _scopeId6));
                                            _push7(` Add `);
                                          } else {
                                            return [
                                              createVNode(unref(PlusIcon), {
                                                class: "mr-2",
                                                size: 16
                                              }),
                                              createTextVNode(" Add ")
                                            ];
                                          }
                                        }),
                                        _: 2
                                      }, _parent6, _scopeId5));
                                    } else {
                                      return [
                                        (openBlock(true), createBlock(Fragment, null, renderList(fields, (field, index) => {
                                          return openBlock(), createBlock("div", {
                                            key: field.key,
                                            class: "mb-4 p-1"
                                          }, [
                                            createVNode(_sfc_main$1, {
                                              "field-name": `${_ctx.fieldName}[${index}]`,
                                              label: _ctx.fieldName,
                                              shape: itemShape.value,
                                              config: _ctx.config
                                            }, null, 8, ["field-name", "label", "shape", "config"]),
                                            createVNode("div", { class: "!my-4 flex justify-end" }, [
                                              createVNode(unref(_sfc_main$M), {
                                                type: "button",
                                                size: "icon",
                                                variant: "secondary",
                                                onClick: ($event) => remove(index)
                                              }, {
                                                default: withCtx(() => [
                                                  createVNode(unref(TrashIcon), { size: 16 })
                                                ]),
                                                _: 2
                                              }, 1032, ["onClick"])
                                            ]),
                                            !field.isLast ? (openBlock(), createBlock(unref(_sfc_main$B), { key: 0 })) : createCommentVNode("", true)
                                          ]);
                                        }), 128)),
                                        createVNode(unref(_sfc_main$M), {
                                          type: "button",
                                          variant: "secondary",
                                          class: "mt-4 flex items-center",
                                          onClick: ($event) => push(null)
                                        }, {
                                          default: withCtx(() => [
                                            createVNode(unref(PlusIcon), {
                                              class: "mr-2",
                                              size: 16
                                            }),
                                            createTextVNode(" Add ")
                                          ]),
                                          _: 2
                                        }, 1032, ["onClick"])
                                      ];
                                    }
                                  }),
                                  _: 2
                                }, _parent5, _scopeId4));
                                _push5(ssrRenderComponent(unref(_sfc_main$G), null, null, _parent5, _scopeId4));
                              } else {
                                return [
                                  createVNode(unref(_sfc_main$C), null, {
                                    default: withCtx(() => [
                                      createVNode(_sfc_main$A, {
                                        class: "text-base",
                                        required: _ctx.required
                                      }, {
                                        default: withCtx(() => {
                                          var _a;
                                          return [
                                            createTextVNode(toDisplayString(((_a = _ctx.schema) == null ? void 0 : _a.description) || unref(beautifyObjectName)(_ctx.fieldName)), 1)
                                          ];
                                        }),
                                        _: 1
                                      }, 8, ["required"])
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(unref(_sfc_main$E), null, {
                                    default: withCtx(() => [
                                      (openBlock(true), createBlock(Fragment, null, renderList(fields, (field, index) => {
                                        return openBlock(), createBlock("div", {
                                          key: field.key,
                                          class: "mb-4 p-1"
                                        }, [
                                          createVNode(_sfc_main$1, {
                                            "field-name": `${_ctx.fieldName}[${index}]`,
                                            label: _ctx.fieldName,
                                            shape: itemShape.value,
                                            config: _ctx.config
                                          }, null, 8, ["field-name", "label", "shape", "config"]),
                                          createVNode("div", { class: "!my-4 flex justify-end" }, [
                                            createVNode(unref(_sfc_main$M), {
                                              type: "button",
                                              size: "icon",
                                              variant: "secondary",
                                              onClick: ($event) => remove(index)
                                            }, {
                                              default: withCtx(() => [
                                                createVNode(unref(TrashIcon), { size: 16 })
                                              ]),
                                              _: 2
                                            }, 1032, ["onClick"])
                                          ]),
                                          !field.isLast ? (openBlock(), createBlock(unref(_sfc_main$B), { key: 0 })) : createCommentVNode("", true)
                                        ]);
                                      }), 128)),
                                      createVNode(unref(_sfc_main$M), {
                                        type: "button",
                                        variant: "secondary",
                                        class: "mt-4 flex items-center",
                                        onClick: ($event) => push(null)
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(unref(PlusIcon), {
                                            class: "mr-2",
                                            size: 16
                                          }),
                                          createTextVNode(" Add ")
                                        ]),
                                        _: 2
                                      }, 1032, ["onClick"])
                                    ]),
                                    _: 2
                                  }, 1024),
                                  createVNode(unref(_sfc_main$G))
                                ];
                              }
                            }),
                            _: 2
                          }, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(unref(_sfc_main$D), {
                              value: _ctx.fieldName,
                              class: "border-none"
                            }, {
                              default: withCtx(() => [
                                createVNode(unref(_sfc_main$C), null, {
                                  default: withCtx(() => [
                                    createVNode(_sfc_main$A, {
                                      class: "text-base",
                                      required: _ctx.required
                                    }, {
                                      default: withCtx(() => {
                                        var _a;
                                        return [
                                          createTextVNode(toDisplayString(((_a = _ctx.schema) == null ? void 0 : _a.description) || unref(beautifyObjectName)(_ctx.fieldName)), 1)
                                        ];
                                      }),
                                      _: 1
                                    }, 8, ["required"])
                                  ]),
                                  _: 1
                                }),
                                createVNode(unref(_sfc_main$E), null, {
                                  default: withCtx(() => [
                                    (openBlock(true), createBlock(Fragment, null, renderList(fields, (field, index) => {
                                      return openBlock(), createBlock("div", {
                                        key: field.key,
                                        class: "mb-4 p-1"
                                      }, [
                                        createVNode(_sfc_main$1, {
                                          "field-name": `${_ctx.fieldName}[${index}]`,
                                          label: _ctx.fieldName,
                                          shape: itemShape.value,
                                          config: _ctx.config
                                        }, null, 8, ["field-name", "label", "shape", "config"]),
                                        createVNode("div", { class: "!my-4 flex justify-end" }, [
                                          createVNode(unref(_sfc_main$M), {
                                            type: "button",
                                            size: "icon",
                                            variant: "secondary",
                                            onClick: ($event) => remove(index)
                                          }, {
                                            default: withCtx(() => [
                                              createVNode(unref(TrashIcon), { size: 16 })
                                            ]),
                                            _: 2
                                          }, 1032, ["onClick"])
                                        ]),
                                        !field.isLast ? (openBlock(), createBlock(unref(_sfc_main$B), { key: 0 })) : createCommentVNode("", true)
                                      ]);
                                    }), 128)),
                                    createVNode(unref(_sfc_main$M), {
                                      type: "button",
                                      variant: "secondary",
                                      class: "mt-4 flex items-center",
                                      onClick: ($event) => push(null)
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(unref(PlusIcon), {
                                          class: "mr-2",
                                          size: 16
                                        }),
                                        createTextVNode(" Add ")
                                      ]),
                                      _: 2
                                    }, 1032, ["onClick"])
                                  ]),
                                  _: 2
                                }, 1024),
                                createVNode(unref(_sfc_main$G))
                              ]),
                              _: 2
                            }, 1032, ["value"])
                          ];
                        }
                      }),
                      _: 2
                    }, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(unref(_sfc_main$J), null, {
                        default: withCtx(() => [
                          createVNode(unref(_sfc_main$D), {
                            value: _ctx.fieldName,
                            class: "border-none"
                          }, {
                            default: withCtx(() => [
                              createVNode(unref(_sfc_main$C), null, {
                                default: withCtx(() => [
                                  createVNode(_sfc_main$A, {
                                    class: "text-base",
                                    required: _ctx.required
                                  }, {
                                    default: withCtx(() => {
                                      var _a;
                                      return [
                                        createTextVNode(toDisplayString(((_a = _ctx.schema) == null ? void 0 : _a.description) || unref(beautifyObjectName)(_ctx.fieldName)), 1)
                                      ];
                                    }),
                                    _: 1
                                  }, 8, ["required"])
                                ]),
                                _: 1
                              }),
                              createVNode(unref(_sfc_main$E), null, {
                                default: withCtx(() => [
                                  (openBlock(true), createBlock(Fragment, null, renderList(fields, (field, index) => {
                                    return openBlock(), createBlock("div", {
                                      key: field.key,
                                      class: "mb-4 p-1"
                                    }, [
                                      createVNode(_sfc_main$1, {
                                        "field-name": `${_ctx.fieldName}[${index}]`,
                                        label: _ctx.fieldName,
                                        shape: itemShape.value,
                                        config: _ctx.config
                                      }, null, 8, ["field-name", "label", "shape", "config"]),
                                      createVNode("div", { class: "!my-4 flex justify-end" }, [
                                        createVNode(unref(_sfc_main$M), {
                                          type: "button",
                                          size: "icon",
                                          variant: "secondary",
                                          onClick: ($event) => remove(index)
                                        }, {
                                          default: withCtx(() => [
                                            createVNode(unref(TrashIcon), { size: 16 })
                                          ]),
                                          _: 2
                                        }, 1032, ["onClick"])
                                      ]),
                                      !field.isLast ? (openBlock(), createBlock(unref(_sfc_main$B), { key: 0 })) : createCommentVNode("", true)
                                    ]);
                                  }), 128)),
                                  createVNode(unref(_sfc_main$M), {
                                    type: "button",
                                    variant: "secondary",
                                    class: "mt-4 flex items-center",
                                    onClick: ($event) => push(null)
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(unref(PlusIcon), {
                                        class: "mr-2",
                                        size: 16
                                      }),
                                      createTextVNode(" Add ")
                                    ]),
                                    _: 2
                                  }, 1032, ["onClick"])
                                ]),
                                _: 2
                              }, 1024),
                              createVNode(unref(_sfc_main$G))
                            ]),
                            _: 2
                          }, 1032, ["value"])
                        ]),
                        _: 2
                      }, 1024)
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
            }, _push2, _parent2, _scopeId);
          } else {
            return [
              renderSlot(_ctx.$slots, "default", props, () => [
                createVNode(unref(_sfc_main$F), {
                  type: "multiple",
                  class: "w-full",
                  collapsible: "",
                  disabled: _ctx.disabled,
                  "as-child": ""
                }, {
                  default: withCtx(() => [
                    createVNode(unref(_sfc_main$J), null, {
                      default: withCtx(() => [
                        createVNode(unref(_sfc_main$D), {
                          value: _ctx.fieldName,
                          class: "border-none"
                        }, {
                          default: withCtx(() => [
                            createVNode(unref(_sfc_main$C), null, {
                              default: withCtx(() => [
                                createVNode(_sfc_main$A, {
                                  class: "text-base",
                                  required: _ctx.required
                                }, {
                                  default: withCtx(() => {
                                    var _a;
                                    return [
                                      createTextVNode(toDisplayString(((_a = _ctx.schema) == null ? void 0 : _a.description) || unref(beautifyObjectName)(_ctx.fieldName)), 1)
                                    ];
                                  }),
                                  _: 1
                                }, 8, ["required"])
                              ]),
                              _: 1
                            }),
                            createVNode(unref(_sfc_main$E), null, {
                              default: withCtx(() => [
                                (openBlock(true), createBlock(Fragment, null, renderList(fields, (field, index) => {
                                  return openBlock(), createBlock("div", {
                                    key: field.key,
                                    class: "mb-4 p-1"
                                  }, [
                                    createVNode(_sfc_main$1, {
                                      "field-name": `${_ctx.fieldName}[${index}]`,
                                      label: _ctx.fieldName,
                                      shape: itemShape.value,
                                      config: _ctx.config
                                    }, null, 8, ["field-name", "label", "shape", "config"]),
                                    createVNode("div", { class: "!my-4 flex justify-end" }, [
                                      createVNode(unref(_sfc_main$M), {
                                        type: "button",
                                        size: "icon",
                                        variant: "secondary",
                                        onClick: ($event) => remove(index)
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(unref(TrashIcon), { size: 16 })
                                        ]),
                                        _: 2
                                      }, 1032, ["onClick"])
                                    ]),
                                    !field.isLast ? (openBlock(), createBlock(unref(_sfc_main$B), { key: 0 })) : createCommentVNode("", true)
                                  ]);
                                }), 128)),
                                createVNode(unref(_sfc_main$M), {
                                  type: "button",
                                  variant: "secondary",
                                  class: "mt-4 flex items-center",
                                  onClick: ($event) => push(null)
                                }, {
                                  default: withCtx(() => [
                                    createVNode(unref(PlusIcon), {
                                      class: "mr-2",
                                      size: 16
                                    }),
                                    createTextVNode(" Add ")
                                  ]),
                                  _: 2
                                }, 1032, ["onClick"])
                              ]),
                              _: 2
                            }, 1024),
                            createVNode(unref(_sfc_main$G))
                          ]),
                          _: 2
                        }, 1032, ["value"])
                      ]),
                      _: 2
                    }, 1024)
                  ]),
                  _: 2
                }, 1032, ["disabled"])
              ])
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
});
const _sfc_setup$z = _sfc_main$z.setup;
_sfc_main$z.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/auto-form/AutoFormFieldArray.vue");
  return _sfc_setup$z ? _sfc_setup$z(props, ctx) : void 0;
};
const _sfc_main$y = /* @__PURE__ */ defineComponent({
  __name: "Switch",
  __ssrInlineRender: true,
  props: {
    defaultChecked: { type: Boolean },
    checked: { type: Boolean },
    disabled: { type: Boolean },
    required: { type: Boolean },
    name: {},
    id: {},
    value: {},
    asChild: { type: Boolean },
    as: { type: [String, Object, Function] },
    class: {}
  },
  emits: ["update:checked"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const delegatedProps = computed(() => {
      const { class: _, ...delegated } = props;
      return delegated;
    });
    const forwarded = useForwardPropsEmits(delegatedProps, emits);
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(SwitchRoot), mergeProps(unref(forwarded), {
        class: unref(cn)(
          "peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
          props.class
        )
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(SwitchThumb), {
              class: unref(cn)("pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0")
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  ssrRenderSlot(_ctx.$slots, "thumb", {}, null, _push3, _parent3, _scopeId2);
                } else {
                  return [
                    renderSlot(_ctx.$slots, "thumb")
                  ];
                }
              }),
              _: 3
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(SwitchThumb), {
                class: unref(cn)("pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0")
              }, {
                default: withCtx(() => [
                  renderSlot(_ctx.$slots, "thumb")
                ]),
                _: 3
              }, 8, ["class"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/switch/Switch.vue");
  return _sfc_setup$y ? _sfc_setup$y(props, ctx) : void 0;
};
const _sfc_main$x = /* @__PURE__ */ defineComponent({
  __name: "AutoFormFieldBoolean",
  __ssrInlineRender: true,
  props: {
    fieldName: {},
    label: {},
    required: { type: Boolean },
    config: {},
    disabled: { type: Boolean }
  },
  setup(__props) {
    const props = __props;
    const booleanComponent = computed(() => {
      var _a;
      return ((_a = props.config) == null ? void 0 : _a.component) === "switch" ? _sfc_main$y : _sfc_main$1$1;
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(Field), mergeProps({ name: _ctx.fieldName }, _attrs), {
        default: withCtx((slotProps, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(_sfc_main$J), null, {
              default: withCtx((_, _push3, _parent3, _scopeId2) => {
                var _a, _b, _c, _d;
                if (_push3) {
                  _push3(`<div class="space-y-0 mb-3 flex items-center gap-3"${_scopeId2}>`);
                  _push3(ssrRenderComponent(unref(_sfc_main$L), null, {
                    default: withCtx((_2, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        ssrRenderSlot(_ctx.$slots, "default", slotProps, () => {
                          var _a3;
                          var _a2, _b2;
                          ssrRenderVNode(_push4, createVNode(resolveDynamicComponent(booleanComponent.value), mergeProps({ ...slotProps.componentField }, {
                            disabled: (_a3 = unref(maybeBooleanishToBoolean)((_b2 = (_a2 = _ctx.config) == null ? void 0 : _a2.inputProps) == null ? void 0 : _b2.disabled)) != null ? _a3 : _ctx.disabled,
                            checked: slotProps.componentField.modelValue,
                            "onUpdate:checked": slotProps.componentField["onUpdate:modelValue"]
                          }), null), _parent4, _scopeId3);
                        }, _push4, _parent4, _scopeId3);
                      } else {
                        return [
                          renderSlot(_ctx.$slots, "default", slotProps, () => {
                            var _a3;
                            var _a2, _b2;
                            return [
                              (openBlock(), createBlock(resolveDynamicComponent(booleanComponent.value), mergeProps({ ...slotProps.componentField }, {
                                disabled: (_a3 = unref(maybeBooleanishToBoolean)((_b2 = (_a2 = _ctx.config) == null ? void 0 : _a2.inputProps) == null ? void 0 : _b2.disabled)) != null ? _a3 : _ctx.disabled,
                                checked: slotProps.componentField.modelValue,
                                "onUpdate:checked": slotProps.componentField["onUpdate:modelValue"]
                              }), null, 16, ["disabled", "checked", "onUpdate:checked"]))
                            ];
                          })
                        ];
                      }
                    }),
                    _: 2
                  }, _parent3, _scopeId2));
                  if (!((_a = _ctx.config) == null ? void 0 : _a.hideLabel)) {
                    _push3(ssrRenderComponent(_sfc_main$A, { required: _ctx.required }, {
                      default: withCtx((_2, _push4, _parent4, _scopeId3) => {
                        var _a3, _b3;
                        var _a2, _b2;
                        if (_push4) {
                          _push4(`${ssrInterpolate(((_a2 = _ctx.config) == null ? void 0 : _a2.label) || unref(beautifyObjectName)((_a3 = _ctx.label) != null ? _a3 : _ctx.fieldName))}`);
                        } else {
                          return [
                            createTextVNode(toDisplayString(((_b2 = _ctx.config) == null ? void 0 : _b2.label) || unref(beautifyObjectName)((_b3 = _ctx.label) != null ? _b3 : _ctx.fieldName)), 1)
                          ];
                        }
                      }),
                      _: 2
                    }, _parent3, _scopeId2));
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(`</div>`);
                  if ((_b = _ctx.config) == null ? void 0 : _b.description) {
                    _push3(ssrRenderComponent(unref(_sfc_main$K), null, {
                      default: withCtx((_2, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`${ssrInterpolate(_ctx.config.description)}`);
                        } else {
                          return [
                            createTextVNode(toDisplayString(_ctx.config.description), 1)
                          ];
                        }
                      }),
                      _: 2
                    }, _parent3, _scopeId2));
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(ssrRenderComponent(unref(_sfc_main$G), null, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode("div", { class: "space-y-0 mb-3 flex items-center gap-3" }, [
                      createVNode(unref(_sfc_main$L), null, {
                        default: withCtx(() => [
                          renderSlot(_ctx.$slots, "default", slotProps, () => {
                            var _a3;
                            var _a2, _b2;
                            return [
                              (openBlock(), createBlock(resolveDynamicComponent(booleanComponent.value), mergeProps({ ...slotProps.componentField }, {
                                disabled: (_a3 = unref(maybeBooleanishToBoolean)((_b2 = (_a2 = _ctx.config) == null ? void 0 : _a2.inputProps) == null ? void 0 : _b2.disabled)) != null ? _a3 : _ctx.disabled,
                                checked: slotProps.componentField.modelValue,
                                "onUpdate:checked": slotProps.componentField["onUpdate:modelValue"]
                              }), null, 16, ["disabled", "checked", "onUpdate:checked"]))
                            ];
                          })
                        ]),
                        _: 2
                      }, 1024),
                      !((_c = _ctx.config) == null ? void 0 : _c.hideLabel) ? (openBlock(), createBlock(_sfc_main$A, {
                        key: 0,
                        required: _ctx.required
                      }, {
                        default: withCtx(() => {
                          var _a3;
                          var _a2;
                          return [
                            createTextVNode(toDisplayString(((_a2 = _ctx.config) == null ? void 0 : _a2.label) || unref(beautifyObjectName)((_a3 = _ctx.label) != null ? _a3 : _ctx.fieldName)), 1)
                          ];
                        }),
                        _: 1
                      }, 8, ["required"])) : createCommentVNode("", true)
                    ]),
                    ((_d = _ctx.config) == null ? void 0 : _d.description) ? (openBlock(), createBlock(unref(_sfc_main$K), { key: 0 }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(_ctx.config.description), 1)
                      ]),
                      _: 1
                    })) : createCommentVNode("", true),
                    createVNode(unref(_sfc_main$G))
                  ];
                }
              }),
              _: 2
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(_sfc_main$J), null, {
                default: withCtx(() => {
                  var _a, _b;
                  return [
                    createVNode("div", { class: "space-y-0 mb-3 flex items-center gap-3" }, [
                      createVNode(unref(_sfc_main$L), null, {
                        default: withCtx(() => [
                          renderSlot(_ctx.$slots, "default", slotProps, () => {
                            var _a3;
                            var _a2, _b2;
                            return [
                              (openBlock(), createBlock(resolveDynamicComponent(booleanComponent.value), mergeProps({ ...slotProps.componentField }, {
                                disabled: (_a3 = unref(maybeBooleanishToBoolean)((_b2 = (_a2 = _ctx.config) == null ? void 0 : _a2.inputProps) == null ? void 0 : _b2.disabled)) != null ? _a3 : _ctx.disabled,
                                checked: slotProps.componentField.modelValue,
                                "onUpdate:checked": slotProps.componentField["onUpdate:modelValue"]
                              }), null, 16, ["disabled", "checked", "onUpdate:checked"]))
                            ];
                          })
                        ]),
                        _: 2
                      }, 1024),
                      !((_a = _ctx.config) == null ? void 0 : _a.hideLabel) ? (openBlock(), createBlock(_sfc_main$A, {
                        key: 0,
                        required: _ctx.required
                      }, {
                        default: withCtx(() => {
                          var _a3;
                          var _a2;
                          return [
                            createTextVNode(toDisplayString(((_a2 = _ctx.config) == null ? void 0 : _a2.label) || unref(beautifyObjectName)((_a3 = _ctx.label) != null ? _a3 : _ctx.fieldName)), 1)
                          ];
                        }),
                        _: 1
                      }, 8, ["required"])) : createCommentVNode("", true)
                    ]),
                    ((_b = _ctx.config) == null ? void 0 : _b.description) ? (openBlock(), createBlock(unref(_sfc_main$K), { key: 0 }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(_ctx.config.description), 1)
                      ]),
                      _: 1
                    })) : createCommentVNode("", true),
                    createVNode(unref(_sfc_main$G))
                  ];
                }),
                _: 2
              }, 1024)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/auto-form/AutoFormFieldBoolean.vue");
  return _sfc_setup$x ? _sfc_setup$x(props, ctx) : void 0;
};
const _sfc_main$w = /* @__PURE__ */ defineComponent({
  __name: "Calendar",
  __ssrInlineRender: true,
  props: {
    modelValue: {},
    multiple: { type: Boolean },
    defaultValue: {},
    defaultPlaceholder: {},
    placeholder: {},
    pagedNavigation: { type: Boolean },
    preventDeselect: { type: Boolean },
    weekStartsOn: {},
    weekdayFormat: {},
    calendarLabel: {},
    fixedWeeks: { type: Boolean },
    maxValue: {},
    minValue: {},
    locale: {},
    numberOfMonths: {},
    disabled: { type: Boolean },
    readonly: { type: Boolean },
    initialFocus: { type: Boolean },
    isDateDisabled: { type: Function },
    isDateUnavailable: { type: Function },
    dir: {},
    nextPage: { type: Function },
    prevPage: { type: Function },
    asChild: { type: Boolean },
    as: { type: [String, Object, Function] },
    class: {}
  },
  emits: ["update:modelValue", "update:placeholder"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const delegatedProps = computed(() => {
      const { class: _, ...delegated } = props;
      return delegated;
    });
    const forwarded = useForwardPropsEmits(delegatedProps, emits);
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(CalendarRoot), mergeProps({
        class: unref(cn)("p-3", props.class)
      }, unref(forwarded), _attrs), {
        default: withCtx(({ grid, weekDays }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(_sfc_main$o), null, {
              default: withCtx((_, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(_sfc_main$l), null, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(_sfc_main$n), null, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(_sfc_main$m), null, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(_sfc_main$l)),
                    createVNode(unref(_sfc_main$n)),
                    createVNode(unref(_sfc_main$m))
                  ];
                }
              }),
              _: 2
            }, _parent2, _scopeId));
            _push2(`<div class="flex flex-col gap-y-4 mt-4 sm:flex-row sm:gap-x-4 sm:gap-y-0"${_scopeId}><!--[-->`);
            ssrRenderList(grid, (month) => {
              _push2(ssrRenderComponent(unref(_sfc_main$t), {
                key: month.value.toString()
              }, {
                default: withCtx((_, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(unref(_sfc_main$r), null, {
                      default: withCtx((_2, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(unref(_sfc_main$q), null, {
                            default: withCtx((_3, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`<!--[-->`);
                                ssrRenderList(weekDays, (day) => {
                                  _push5(ssrRenderComponent(unref(_sfc_main$p), { key: day }, {
                                    default: withCtx((_4, _push6, _parent6, _scopeId5) => {
                                      if (_push6) {
                                        _push6(`${ssrInterpolate(day)}`);
                                      } else {
                                        return [
                                          createTextVNode(toDisplayString(day), 1)
                                        ];
                                      }
                                    }),
                                    _: 2
                                  }, _parent5, _scopeId4));
                                });
                                _push5(`<!--]-->`);
                              } else {
                                return [
                                  (openBlock(true), createBlock(Fragment, null, renderList(weekDays, (day) => {
                                    return openBlock(), createBlock(unref(_sfc_main$p), { key: day }, {
                                      default: withCtx(() => [
                                        createTextVNode(toDisplayString(day), 1)
                                      ]),
                                      _: 2
                                    }, 1024);
                                  }), 128))
                                ];
                              }
                            }),
                            _: 2
                          }, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(unref(_sfc_main$q), null, {
                              default: withCtx(() => [
                                (openBlock(true), createBlock(Fragment, null, renderList(weekDays, (day) => {
                                  return openBlock(), createBlock(unref(_sfc_main$p), { key: day }, {
                                    default: withCtx(() => [
                                      createTextVNode(toDisplayString(day), 1)
                                    ]),
                                    _: 2
                                  }, 1024);
                                }), 128))
                              ]),
                              _: 2
                            }, 1024)
                          ];
                        }
                      }),
                      _: 2
                    }, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(unref(_sfc_main$s), null, {
                      default: withCtx((_2, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`<!--[-->`);
                          ssrRenderList(month.rows, (weekDates, index) => {
                            _push4(ssrRenderComponent(unref(_sfc_main$q), {
                              key: `weekDate-${index}`,
                              class: "mt-2 w-full"
                            }, {
                              default: withCtx((_3, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  _push5(`<!--[-->`);
                                  ssrRenderList(weekDates, (weekDate) => {
                                    _push5(ssrRenderComponent(unref(_sfc_main$v), {
                                      key: weekDate.toString(),
                                      date: weekDate
                                    }, {
                                      default: withCtx((_4, _push6, _parent6, _scopeId5) => {
                                        if (_push6) {
                                          _push6(ssrRenderComponent(unref(_sfc_main$u), {
                                            day: weekDate,
                                            month: month.value
                                          }, null, _parent6, _scopeId5));
                                        } else {
                                          return [
                                            createVNode(unref(_sfc_main$u), {
                                              day: weekDate,
                                              month: month.value
                                            }, null, 8, ["day", "month"])
                                          ];
                                        }
                                      }),
                                      _: 2
                                    }, _parent5, _scopeId4));
                                  });
                                  _push5(`<!--]-->`);
                                } else {
                                  return [
                                    (openBlock(true), createBlock(Fragment, null, renderList(weekDates, (weekDate) => {
                                      return openBlock(), createBlock(unref(_sfc_main$v), {
                                        key: weekDate.toString(),
                                        date: weekDate
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(unref(_sfc_main$u), {
                                            day: weekDate,
                                            month: month.value
                                          }, null, 8, ["day", "month"])
                                        ]),
                                        _: 2
                                      }, 1032, ["date"]);
                                    }), 128))
                                  ];
                                }
                              }),
                              _: 2
                            }, _parent4, _scopeId3));
                          });
                          _push4(`<!--]-->`);
                        } else {
                          return [
                            (openBlock(true), createBlock(Fragment, null, renderList(month.rows, (weekDates, index) => {
                              return openBlock(), createBlock(unref(_sfc_main$q), {
                                key: `weekDate-${index}`,
                                class: "mt-2 w-full"
                              }, {
                                default: withCtx(() => [
                                  (openBlock(true), createBlock(Fragment, null, renderList(weekDates, (weekDate) => {
                                    return openBlock(), createBlock(unref(_sfc_main$v), {
                                      key: weekDate.toString(),
                                      date: weekDate
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(unref(_sfc_main$u), {
                                          day: weekDate,
                                          month: month.value
                                        }, null, 8, ["day", "month"])
                                      ]),
                                      _: 2
                                    }, 1032, ["date"]);
                                  }), 128))
                                ]),
                                _: 2
                              }, 1024);
                            }), 128))
                          ];
                        }
                      }),
                      _: 2
                    }, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(unref(_sfc_main$r), null, {
                        default: withCtx(() => [
                          createVNode(unref(_sfc_main$q), null, {
                            default: withCtx(() => [
                              (openBlock(true), createBlock(Fragment, null, renderList(weekDays, (day) => {
                                return openBlock(), createBlock(unref(_sfc_main$p), { key: day }, {
                                  default: withCtx(() => [
                                    createTextVNode(toDisplayString(day), 1)
                                  ]),
                                  _: 2
                                }, 1024);
                              }), 128))
                            ]),
                            _: 2
                          }, 1024)
                        ]),
                        _: 2
                      }, 1024),
                      createVNode(unref(_sfc_main$s), null, {
                        default: withCtx(() => [
                          (openBlock(true), createBlock(Fragment, null, renderList(month.rows, (weekDates, index) => {
                            return openBlock(), createBlock(unref(_sfc_main$q), {
                              key: `weekDate-${index}`,
                              class: "mt-2 w-full"
                            }, {
                              default: withCtx(() => [
                                (openBlock(true), createBlock(Fragment, null, renderList(weekDates, (weekDate) => {
                                  return openBlock(), createBlock(unref(_sfc_main$v), {
                                    key: weekDate.toString(),
                                    date: weekDate
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(unref(_sfc_main$u), {
                                        day: weekDate,
                                        month: month.value
                                      }, null, 8, ["day", "month"])
                                    ]),
                                    _: 2
                                  }, 1032, ["date"]);
                                }), 128))
                              ]),
                              _: 2
                            }, 1024);
                          }), 128))
                        ]),
                        _: 2
                      }, 1024)
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
            });
            _push2(`<!--]--></div>`);
          } else {
            return [
              createVNode(unref(_sfc_main$o), null, {
                default: withCtx(() => [
                  createVNode(unref(_sfc_main$l)),
                  createVNode(unref(_sfc_main$n)),
                  createVNode(unref(_sfc_main$m))
                ]),
                _: 1
              }),
              createVNode("div", { class: "flex flex-col gap-y-4 mt-4 sm:flex-row sm:gap-x-4 sm:gap-y-0" }, [
                (openBlock(true), createBlock(Fragment, null, renderList(grid, (month) => {
                  return openBlock(), createBlock(unref(_sfc_main$t), {
                    key: month.value.toString()
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(_sfc_main$r), null, {
                        default: withCtx(() => [
                          createVNode(unref(_sfc_main$q), null, {
                            default: withCtx(() => [
                              (openBlock(true), createBlock(Fragment, null, renderList(weekDays, (day) => {
                                return openBlock(), createBlock(unref(_sfc_main$p), { key: day }, {
                                  default: withCtx(() => [
                                    createTextVNode(toDisplayString(day), 1)
                                  ]),
                                  _: 2
                                }, 1024);
                              }), 128))
                            ]),
                            _: 2
                          }, 1024)
                        ]),
                        _: 2
                      }, 1024),
                      createVNode(unref(_sfc_main$s), null, {
                        default: withCtx(() => [
                          (openBlock(true), createBlock(Fragment, null, renderList(month.rows, (weekDates, index) => {
                            return openBlock(), createBlock(unref(_sfc_main$q), {
                              key: `weekDate-${index}`,
                              class: "mt-2 w-full"
                            }, {
                              default: withCtx(() => [
                                (openBlock(true), createBlock(Fragment, null, renderList(weekDates, (weekDate) => {
                                  return openBlock(), createBlock(unref(_sfc_main$v), {
                                    key: weekDate.toString(),
                                    date: weekDate
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(unref(_sfc_main$u), {
                                        day: weekDate,
                                        month: month.value
                                      }, null, 8, ["day", "month"])
                                    ]),
                                    _: 2
                                  }, 1032, ["date"]);
                                }), 128))
                              ]),
                              _: 2
                            }, 1024);
                          }), 128))
                        ]),
                        _: 2
                      }, 1024)
                    ]),
                    _: 2
                  }, 1024);
                }), 128))
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup$w = _sfc_main$w.setup;
_sfc_main$w.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/calendar/Calendar.vue");
  return _sfc_setup$w ? _sfc_setup$w(props, ctx) : void 0;
};
const _sfc_main$v = /* @__PURE__ */ defineComponent({
  __name: "CalendarCell",
  __ssrInlineRender: true,
  props: {
    date: {},
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
      _push(ssrRenderComponent(unref(CalendarCell), mergeProps({
        class: unref(cn)("relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([data-selected])]:rounded-md [&:has([data-selected])]:bg-accent [&:has([data-selected][data-outside-view])]:bg-accent/50", props.class)
      }, unref(forwardedProps), _attrs), {
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/calendar/CalendarCell.vue");
  return _sfc_setup$v ? _sfc_setup$v(props, ctx) : void 0;
};
const _sfc_main$u = /* @__PURE__ */ defineComponent({
  __name: "CalendarCellTrigger",
  __ssrInlineRender: true,
  props: {
    day: {},
    month: {},
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
      _push(ssrRenderComponent(unref(CalendarCellTrigger), mergeProps({
        class: unref(cn)(
          unref(buttonVariants)({ variant: "ghost" }),
          "h-8 w-8 p-0 font-normal",
          "[&[data-today]:not([data-selected])]:bg-accent [&[data-today]:not([data-selected])]:text-accent-foreground",
          // Selected
          "data-[selected]:bg-primary data-[selected]:text-primary-foreground data-[selected]:opacity-100 data-[selected]:hover:bg-primary data-[selected]:hover:text-primary-foreground data-[selected]:focus:bg-primary data-[selected]:focus:text-primary-foreground",
          // Disabled
          "data-[disabled]:text-muted-foreground data-[disabled]:opacity-50",
          // Unavailable
          "data-[unavailable]:text-destructive-foreground data-[unavailable]:line-through",
          // Outside months
          "data-[outside-view]:text-muted-foreground data-[outside-view]:opacity-50 [&[data-outside-view][data-selected]]:bg-accent/50 [&[data-outside-view][data-selected]]:text-muted-foreground [&[data-outside-view][data-selected]]:opacity-30",
          props.class
        )
      }, unref(forwardedProps), _attrs), {
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
const _sfc_setup$u = _sfc_main$u.setup;
_sfc_main$u.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/calendar/CalendarCellTrigger.vue");
  return _sfc_setup$u ? _sfc_setup$u(props, ctx) : void 0;
};
const _sfc_main$t = /* @__PURE__ */ defineComponent({
  __name: "CalendarGrid",
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
      _push(ssrRenderComponent(unref(CalendarGrid), mergeProps({
        class: unref(cn)("w-full border-collapse space-y-1", props.class)
      }, unref(forwardedProps), _attrs), {
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
const _sfc_setup$t = _sfc_main$t.setup;
_sfc_main$t.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/calendar/CalendarGrid.vue");
  return _sfc_setup$t ? _sfc_setup$t(props, ctx) : void 0;
};
const _sfc_main$s = /* @__PURE__ */ defineComponent({
  __name: "CalendarGridBody",
  __ssrInlineRender: true,
  props: {
    asChild: { type: Boolean },
    as: { type: [String, Object, Function] }
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(CalendarGridBody), mergeProps(props, _attrs), {
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/calendar/CalendarGridBody.vue");
  return _sfc_setup$s ? _sfc_setup$s(props, ctx) : void 0;
};
const _sfc_main$r = /* @__PURE__ */ defineComponent({
  __name: "CalendarGridHead",
  __ssrInlineRender: true,
  props: {
    asChild: { type: Boolean },
    as: { type: [String, Object, Function] },
    class: {}
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(CalendarGridHead), mergeProps(props, _attrs), {
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/calendar/CalendarGridHead.vue");
  return _sfc_setup$r ? _sfc_setup$r(props, ctx) : void 0;
};
const _sfc_main$q = /* @__PURE__ */ defineComponent({
  __name: "CalendarGridRow",
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
      _push(ssrRenderComponent(unref(CalendarGridRow), mergeProps({
        class: unref(cn)("flex", props.class)
      }, unref(forwardedProps), _attrs), {
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
const _sfc_setup$q = _sfc_main$q.setup;
_sfc_main$q.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/calendar/CalendarGridRow.vue");
  return _sfc_setup$q ? _sfc_setup$q(props, ctx) : void 0;
};
const _sfc_main$p = /* @__PURE__ */ defineComponent({
  __name: "CalendarHeadCell",
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
      _push(ssrRenderComponent(unref(CalendarHeadCell), mergeProps({
        class: unref(cn)("w-8 rounded-md text-[0.8rem] font-normal text-muted-foreground", props.class)
      }, unref(forwardedProps), _attrs), {
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/calendar/CalendarHeadCell.vue");
  return _sfc_setup$p ? _sfc_setup$p(props, ctx) : void 0;
};
const _sfc_main$o = /* @__PURE__ */ defineComponent({
  __name: "CalendarHeader",
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
      _push(ssrRenderComponent(unref(CalendarHeader), mergeProps({
        class: unref(cn)("relative flex w-full items-center justify-between pt-1", props.class)
      }, unref(forwardedProps), _attrs), {
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
const _sfc_setup$o = _sfc_main$o.setup;
_sfc_main$o.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/calendar/CalendarHeader.vue");
  return _sfc_setup$o ? _sfc_setup$o(props, ctx) : void 0;
};
const _sfc_main$n = /* @__PURE__ */ defineComponent({
  __name: "CalendarHeading",
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
      _push(ssrRenderComponent(unref(CalendarHeading), mergeProps({
        class: unref(cn)("text-sm font-medium", props.class)
      }, unref(forwardedProps), _attrs), {
        default: withCtx(({ headingValue }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            ssrRenderSlot(_ctx.$slots, "default", { headingValue }, () => {
              _push2(`${ssrInterpolate(headingValue)}`);
            }, _push2, _parent2, _scopeId);
          } else {
            return [
              renderSlot(_ctx.$slots, "default", { headingValue }, () => [
                createTextVNode(toDisplayString(headingValue), 1)
              ])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/calendar/CalendarHeading.vue");
  return _sfc_setup$n ? _sfc_setup$n(props, ctx) : void 0;
};
const _sfc_main$m = /* @__PURE__ */ defineComponent({
  __name: "CalendarNextButton",
  __ssrInlineRender: true,
  props: {
    step: {},
    nextPage: { type: Function },
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
      _push(ssrRenderComponent(unref(CalendarNext), mergeProps({
        class: unref(cn)(
          unref(buttonVariants)({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
          props.class
        )
      }, unref(forwardedProps), _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            ssrRenderSlot(_ctx.$slots, "default", {}, () => {
              _push2(ssrRenderComponent(unref(ChevronRightIcon), { class: "h-4 w-4" }, null, _parent2, _scopeId));
            }, _push2, _parent2, _scopeId);
          } else {
            return [
              renderSlot(_ctx.$slots, "default", {}, () => [
                createVNode(unref(ChevronRightIcon), { class: "h-4 w-4" })
              ])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/calendar/CalendarNextButton.vue");
  return _sfc_setup$m ? _sfc_setup$m(props, ctx) : void 0;
};
const _sfc_main$l = /* @__PURE__ */ defineComponent({
  __name: "CalendarPrevButton",
  __ssrInlineRender: true,
  props: {
    step: {},
    prevPage: { type: Function },
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
      _push(ssrRenderComponent(unref(CalendarPrev), mergeProps({
        class: unref(cn)(
          unref(buttonVariants)({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
          props.class
        )
      }, unref(forwardedProps), _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            ssrRenderSlot(_ctx.$slots, "default", {}, () => {
              _push2(ssrRenderComponent(unref(ChevronLeftIcon), { class: "h-4 w-4" }, null, _parent2, _scopeId));
            }, _push2, _parent2, _scopeId);
          } else {
            return [
              renderSlot(_ctx.$slots, "default", {}, () => [
                createVNode(unref(ChevronLeftIcon), { class: "h-4 w-4" })
              ])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/calendar/CalendarPrevButton.vue");
  return _sfc_setup$l ? _sfc_setup$l(props, ctx) : void 0;
};
const _sfc_main$k = /* @__PURE__ */ defineComponent({
  __name: "Popover",
  __ssrInlineRender: true,
  props: {
    defaultOpen: { type: Boolean },
    open: { type: Boolean },
    modal: { type: Boolean }
  },
  emits: ["update:open"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const forwarded = useForwardPropsEmits(props, emits);
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(PopoverRoot), mergeProps(unref(forwarded), _attrs), {
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/popover/Popover.vue");
  return _sfc_setup$k ? _sfc_setup$k(props, ctx) : void 0;
};
const _sfc_main$j = /* @__PURE__ */ defineComponent({
  ...{
    inheritAttrs: false
  },
  __name: "PopoverContent",
  __ssrInlineRender: true,
  props: {
    forceMount: { type: Boolean },
    trapFocus: { type: Boolean },
    side: {},
    sideOffset: { default: 4 },
    align: { default: "center" },
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
    disableOutsidePointerEvents: { type: Boolean },
    class: {}
  },
  emits: ["escapeKeyDown", "pointerDownOutside", "focusOutside", "interactOutside", "openAutoFocus", "closeAutoFocus"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const delegatedProps = computed(() => {
      const { class: _, ...delegated } = props;
      return delegated;
    });
    const forwarded = useForwardPropsEmits(delegatedProps, emits);
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(PopoverPortal), _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(PopoverContent), mergeProps({ ...unref(forwarded), ..._ctx.$attrs }, {
              class: unref(cn)(
                "z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
                props.class
              )
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
              createVNode(unref(PopoverContent), mergeProps({ ...unref(forwarded), ..._ctx.$attrs }, {
                class: unref(cn)(
                  "z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
                  props.class
                )
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
const _sfc_setup$j = _sfc_main$j.setup;
_sfc_main$j.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/popover/PopoverContent.vue");
  return _sfc_setup$j ? _sfc_setup$j(props, ctx) : void 0;
};
const _sfc_main$i = /* @__PURE__ */ defineComponent({
  __name: "PopoverTrigger",
  __ssrInlineRender: true,
  props: {
    asChild: { type: Boolean },
    as: { type: [String, Object, Function] }
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(PopoverTrigger), mergeProps(props, _attrs), {
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
const _sfc_setup$i = _sfc_main$i.setup;
_sfc_main$i.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/popover/PopoverTrigger.vue");
  return _sfc_setup$i ? _sfc_setup$i(props, ctx) : void 0;
};
const _sfc_main$h = /* @__PURE__ */ defineComponent({
  __name: "AutoFormFieldDate",
  __ssrInlineRender: true,
  props: {
    fieldName: {},
    label: {},
    required: { type: Boolean },
    config: {},
    disabled: { type: Boolean }
  },
  setup(__props) {
    const df = new DateFormatter("en-US", {
      dateStyle: "long"
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(Field), mergeProps({ name: _ctx.fieldName }, _attrs), {
        default: withCtx((slotProps, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(_sfc_main$J), null, {
              default: withCtx((_, _push3, _parent3, _scopeId2) => {
                var _a, _b, _c, _d;
                if (_push3) {
                  if (!((_a = _ctx.config) == null ? void 0 : _a.hideLabel)) {
                    _push3(ssrRenderComponent(_sfc_main$A, { required: _ctx.required }, {
                      default: withCtx((_2, _push4, _parent4, _scopeId3) => {
                        var _a3, _b3;
                        var _a2, _b2;
                        if (_push4) {
                          _push4(`${ssrInterpolate(((_a2 = _ctx.config) == null ? void 0 : _a2.label) || unref(beautifyObjectName)((_a3 = _ctx.label) != null ? _a3 : _ctx.fieldName))}`);
                        } else {
                          return [
                            createTextVNode(toDisplayString(((_b2 = _ctx.config) == null ? void 0 : _b2.label) || unref(beautifyObjectName)((_b3 = _ctx.label) != null ? _b3 : _ctx.fieldName)), 1)
                          ];
                        }
                      }),
                      _: 2
                    }, _parent3, _scopeId2));
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(ssrRenderComponent(unref(_sfc_main$L), null, {
                    default: withCtx((_2, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        ssrRenderSlot(_ctx.$slots, "default", slotProps, () => {
                          _push4(`<div${_scopeId3}>`);
                          _push4(ssrRenderComponent(unref(_sfc_main$k), null, {
                            default: withCtx((_3, _push5, _parent5, _scopeId4) => {
                              var _a3, _b3;
                              var _a2, _b2, _c2, _d2;
                              if (_push5) {
                                _push5(ssrRenderComponent(unref(_sfc_main$i), {
                                  "as-child": "",
                                  disabled: (_a3 = unref(maybeBooleanishToBoolean)((_b2 = (_a2 = _ctx.config) == null ? void 0 : _a2.inputProps) == null ? void 0 : _b2.disabled)) != null ? _a3 : _ctx.disabled
                                }, {
                                  default: withCtx((_4, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(ssrRenderComponent(unref(_sfc_main$M), {
                                        variant: "outline",
                                        class: unref(cn)(
                                          "w-full justify-start text-left font-normal",
                                          !slotProps.componentField.modelValue && "text-muted-foreground"
                                        )
                                      }, {
                                        default: withCtx((_5, _push7, _parent7, _scopeId6) => {
                                          if (_push7) {
                                            _push7(ssrRenderComponent(unref(CalendarIcon), { class: "mr-2 h-4 w-4" }, null, _parent7, _scopeId6));
                                            _push7(` ${ssrInterpolate(slotProps.componentField.modelValue ? unref(df).format(slotProps.componentField.modelValue.toDate(unref(getLocalTimeZone)())) : "Pick a date")}`);
                                          } else {
                                            return [
                                              createVNode(unref(CalendarIcon), { class: "mr-2 h-4 w-4" }),
                                              createTextVNode(" " + toDisplayString(slotProps.componentField.modelValue ? unref(df).format(slotProps.componentField.modelValue.toDate(unref(getLocalTimeZone)())) : "Pick a date"), 1)
                                            ];
                                          }
                                        }),
                                        _: 2
                                      }, _parent6, _scopeId5));
                                    } else {
                                      return [
                                        createVNode(unref(_sfc_main$M), {
                                          variant: "outline",
                                          class: unref(cn)(
                                            "w-full justify-start text-left font-normal",
                                            !slotProps.componentField.modelValue && "text-muted-foreground"
                                          )
                                        }, {
                                          default: withCtx(() => [
                                            createVNode(unref(CalendarIcon), { class: "mr-2 h-4 w-4" }),
                                            createTextVNode(" " + toDisplayString(slotProps.componentField.modelValue ? unref(df).format(slotProps.componentField.modelValue.toDate(unref(getLocalTimeZone)())) : "Pick a date"), 1)
                                          ]),
                                          _: 2
                                        }, 1032, ["class"])
                                      ];
                                    }
                                  }),
                                  _: 2
                                }, _parent5, _scopeId4));
                                _push5(ssrRenderComponent(unref(_sfc_main$j), { class: "w-auto p-0" }, {
                                  default: withCtx((_4, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(ssrRenderComponent(unref(_sfc_main$w), mergeProps({ "initial-focus": "" }, slotProps.componentField), null, _parent6, _scopeId5));
                                    } else {
                                      return [
                                        createVNode(unref(_sfc_main$w), mergeProps({ "initial-focus": "" }, slotProps.componentField), null, 16)
                                      ];
                                    }
                                  }),
                                  _: 2
                                }, _parent5, _scopeId4));
                              } else {
                                return [
                                  createVNode(unref(_sfc_main$i), {
                                    "as-child": "",
                                    disabled: (_b3 = unref(maybeBooleanishToBoolean)((_d2 = (_c2 = _ctx.config) == null ? void 0 : _c2.inputProps) == null ? void 0 : _d2.disabled)) != null ? _b3 : _ctx.disabled
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(unref(_sfc_main$M), {
                                        variant: "outline",
                                        class: unref(cn)(
                                          "w-full justify-start text-left font-normal",
                                          !slotProps.componentField.modelValue && "text-muted-foreground"
                                        )
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(unref(CalendarIcon), { class: "mr-2 h-4 w-4" }),
                                          createTextVNode(" " + toDisplayString(slotProps.componentField.modelValue ? unref(df).format(slotProps.componentField.modelValue.toDate(unref(getLocalTimeZone)())) : "Pick a date"), 1)
                                        ]),
                                        _: 2
                                      }, 1032, ["class"])
                                    ]),
                                    _: 2
                                  }, 1032, ["disabled"]),
                                  createVNode(unref(_sfc_main$j), { class: "w-auto p-0" }, {
                                    default: withCtx(() => [
                                      createVNode(unref(_sfc_main$w), mergeProps({ "initial-focus": "" }, slotProps.componentField), null, 16)
                                    ]),
                                    _: 2
                                  }, 1024)
                                ];
                              }
                            }),
                            _: 2
                          }, _parent4, _scopeId3));
                          _push4(`</div>`);
                        }, _push4, _parent4, _scopeId3);
                      } else {
                        return [
                          renderSlot(_ctx.$slots, "default", slotProps, () => [
                            createVNode("div", null, [
                              createVNode(unref(_sfc_main$k), null, {
                                default: withCtx(() => {
                                  var _a3;
                                  var _a2, _b2;
                                  return [
                                    createVNode(unref(_sfc_main$i), {
                                      "as-child": "",
                                      disabled: (_a3 = unref(maybeBooleanishToBoolean)((_b2 = (_a2 = _ctx.config) == null ? void 0 : _a2.inputProps) == null ? void 0 : _b2.disabled)) != null ? _a3 : _ctx.disabled
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(unref(_sfc_main$M), {
                                          variant: "outline",
                                          class: unref(cn)(
                                            "w-full justify-start text-left font-normal",
                                            !slotProps.componentField.modelValue && "text-muted-foreground"
                                          )
                                        }, {
                                          default: withCtx(() => [
                                            createVNode(unref(CalendarIcon), { class: "mr-2 h-4 w-4" }),
                                            createTextVNode(" " + toDisplayString(slotProps.componentField.modelValue ? unref(df).format(slotProps.componentField.modelValue.toDate(unref(getLocalTimeZone)())) : "Pick a date"), 1)
                                          ]),
                                          _: 2
                                        }, 1032, ["class"])
                                      ]),
                                      _: 2
                                    }, 1032, ["disabled"]),
                                    createVNode(unref(_sfc_main$j), { class: "w-auto p-0" }, {
                                      default: withCtx(() => [
                                        createVNode(unref(_sfc_main$w), mergeProps({ "initial-focus": "" }, slotProps.componentField), null, 16)
                                      ]),
                                      _: 2
                                    }, 1024)
                                  ];
                                }),
                                _: 2
                              }, 1024)
                            ])
                          ])
                        ];
                      }
                    }),
                    _: 2
                  }, _parent3, _scopeId2));
                  if ((_b = _ctx.config) == null ? void 0 : _b.description) {
                    _push3(ssrRenderComponent(unref(_sfc_main$K), null, {
                      default: withCtx((_2, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`${ssrInterpolate(_ctx.config.description)}`);
                        } else {
                          return [
                            createTextVNode(toDisplayString(_ctx.config.description), 1)
                          ];
                        }
                      }),
                      _: 2
                    }, _parent3, _scopeId2));
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(ssrRenderComponent(unref(_sfc_main$G), null, null, _parent3, _scopeId2));
                } else {
                  return [
                    !((_c = _ctx.config) == null ? void 0 : _c.hideLabel) ? (openBlock(), createBlock(_sfc_main$A, {
                      key: 0,
                      required: _ctx.required
                    }, {
                      default: withCtx(() => {
                        var _a3;
                        var _a2;
                        return [
                          createTextVNode(toDisplayString(((_a2 = _ctx.config) == null ? void 0 : _a2.label) || unref(beautifyObjectName)((_a3 = _ctx.label) != null ? _a3 : _ctx.fieldName)), 1)
                        ];
                      }),
                      _: 1
                    }, 8, ["required"])) : createCommentVNode("", true),
                    createVNode(unref(_sfc_main$L), null, {
                      default: withCtx(() => [
                        renderSlot(_ctx.$slots, "default", slotProps, () => [
                          createVNode("div", null, [
                            createVNode(unref(_sfc_main$k), null, {
                              default: withCtx(() => {
                                var _a3;
                                var _a2, _b2;
                                return [
                                  createVNode(unref(_sfc_main$i), {
                                    "as-child": "",
                                    disabled: (_a3 = unref(maybeBooleanishToBoolean)((_b2 = (_a2 = _ctx.config) == null ? void 0 : _a2.inputProps) == null ? void 0 : _b2.disabled)) != null ? _a3 : _ctx.disabled
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(unref(_sfc_main$M), {
                                        variant: "outline",
                                        class: unref(cn)(
                                          "w-full justify-start text-left font-normal",
                                          !slotProps.componentField.modelValue && "text-muted-foreground"
                                        )
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(unref(CalendarIcon), { class: "mr-2 h-4 w-4" }),
                                          createTextVNode(" " + toDisplayString(slotProps.componentField.modelValue ? unref(df).format(slotProps.componentField.modelValue.toDate(unref(getLocalTimeZone)())) : "Pick a date"), 1)
                                        ]),
                                        _: 2
                                      }, 1032, ["class"])
                                    ]),
                                    _: 2
                                  }, 1032, ["disabled"]),
                                  createVNode(unref(_sfc_main$j), { class: "w-auto p-0" }, {
                                    default: withCtx(() => [
                                      createVNode(unref(_sfc_main$w), mergeProps({ "initial-focus": "" }, slotProps.componentField), null, 16)
                                    ]),
                                    _: 2
                                  }, 1024)
                                ];
                              }),
                              _: 2
                            }, 1024)
                          ])
                        ])
                      ]),
                      _: 2
                    }, 1024),
                    ((_d = _ctx.config) == null ? void 0 : _d.description) ? (openBlock(), createBlock(unref(_sfc_main$K), { key: 1 }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(_ctx.config.description), 1)
                      ]),
                      _: 1
                    })) : createCommentVNode("", true),
                    createVNode(unref(_sfc_main$G))
                  ];
                }
              }),
              _: 2
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(_sfc_main$J), null, {
                default: withCtx(() => {
                  var _a, _b;
                  return [
                    !((_a = _ctx.config) == null ? void 0 : _a.hideLabel) ? (openBlock(), createBlock(_sfc_main$A, {
                      key: 0,
                      required: _ctx.required
                    }, {
                      default: withCtx(() => {
                        var _a3;
                        var _a2;
                        return [
                          createTextVNode(toDisplayString(((_a2 = _ctx.config) == null ? void 0 : _a2.label) || unref(beautifyObjectName)((_a3 = _ctx.label) != null ? _a3 : _ctx.fieldName)), 1)
                        ];
                      }),
                      _: 1
                    }, 8, ["required"])) : createCommentVNode("", true),
                    createVNode(unref(_sfc_main$L), null, {
                      default: withCtx(() => [
                        renderSlot(_ctx.$slots, "default", slotProps, () => [
                          createVNode("div", null, [
                            createVNode(unref(_sfc_main$k), null, {
                              default: withCtx(() => {
                                var _a3;
                                var _a2, _b2;
                                return [
                                  createVNode(unref(_sfc_main$i), {
                                    "as-child": "",
                                    disabled: (_a3 = unref(maybeBooleanishToBoolean)((_b2 = (_a2 = _ctx.config) == null ? void 0 : _a2.inputProps) == null ? void 0 : _b2.disabled)) != null ? _a3 : _ctx.disabled
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(unref(_sfc_main$M), {
                                        variant: "outline",
                                        class: unref(cn)(
                                          "w-full justify-start text-left font-normal",
                                          !slotProps.componentField.modelValue && "text-muted-foreground"
                                        )
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(unref(CalendarIcon), { class: "mr-2 h-4 w-4" }),
                                          createTextVNode(" " + toDisplayString(slotProps.componentField.modelValue ? unref(df).format(slotProps.componentField.modelValue.toDate(unref(getLocalTimeZone)())) : "Pick a date"), 1)
                                        ]),
                                        _: 2
                                      }, 1032, ["class"])
                                    ]),
                                    _: 2
                                  }, 1032, ["disabled"]),
                                  createVNode(unref(_sfc_main$j), { class: "w-auto p-0" }, {
                                    default: withCtx(() => [
                                      createVNode(unref(_sfc_main$w), mergeProps({ "initial-focus": "" }, slotProps.componentField), null, 16)
                                    ]),
                                    _: 2
                                  }, 1024)
                                ];
                              }),
                              _: 2
                            }, 1024)
                          ])
                        ])
                      ]),
                      _: 2
                    }, 1024),
                    ((_b = _ctx.config) == null ? void 0 : _b.description) ? (openBlock(), createBlock(unref(_sfc_main$K), { key: 1 }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(_ctx.config.description), 1)
                      ]),
                      _: 1
                    })) : createCommentVNode("", true),
                    createVNode(unref(_sfc_main$G))
                  ];
                }),
                _: 2
              }, 1024)
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
});
const _sfc_setup$h = _sfc_main$h.setup;
_sfc_main$h.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/auto-form/AutoFormFieldDate.vue");
  return _sfc_setup$h ? _sfc_setup$h(props, ctx) : void 0;
};
const _sfc_main$g = /* @__PURE__ */ defineComponent({
  __name: "RadioGroup",
  __ssrInlineRender: true,
  props: {
    modelValue: {},
    defaultValue: {},
    disabled: { type: Boolean },
    name: {},
    required: { type: Boolean },
    orientation: {},
    dir: {},
    loop: { type: Boolean },
    asChild: { type: Boolean },
    as: { type: [String, Object, Function] },
    class: {}
  },
  emits: ["update:modelValue"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const delegatedProps = computed(() => {
      const { class: _, ...delegated } = props;
      return delegated;
    });
    const forwarded = useForwardPropsEmits(delegatedProps, emits);
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(RadioGroupRoot), mergeProps({
        class: unref(cn)("grid gap-2", props.class)
      }, unref(forwarded), _attrs), {
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
const _sfc_setup$g = _sfc_main$g.setup;
_sfc_main$g.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/radio-group/RadioGroup.vue");
  return _sfc_setup$g ? _sfc_setup$g(props, ctx) : void 0;
};
const _sfc_main$f = /* @__PURE__ */ defineComponent({
  __name: "RadioGroupItem",
  __ssrInlineRender: true,
  props: {
    id: {},
    value: {},
    disabled: { type: Boolean },
    required: { type: Boolean },
    name: {},
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
      _push(ssrRenderComponent(unref(RadioGroupItem), mergeProps(unref(forwardedProps), {
        class: unref(cn)(
          "aspect-square h-4 w-4 rounded-full border border-primary text-primary shadow focus:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          props.class
        )
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(RadioGroupIndicator), { class: "flex items-center justify-center" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(CheckIcon), { class: "h-3.5 w-3.5 fill-primary" }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(CheckIcon), { class: "h-3.5 w-3.5 fill-primary" })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(RadioGroupIndicator), { class: "flex items-center justify-center" }, {
                default: withCtx(() => [
                  createVNode(unref(CheckIcon), { class: "h-3.5 w-3.5 fill-primary" })
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
});
const _sfc_setup$f = _sfc_main$f.setup;
_sfc_main$f.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/radio-group/RadioGroupItem.vue");
  return _sfc_setup$f ? _sfc_setup$f(props, ctx) : void 0;
};
const _sfc_main$e = /* @__PURE__ */ defineComponent({
  __name: "Select",
  __ssrInlineRender: true,
  props: {
    open: { type: Boolean },
    defaultOpen: { type: Boolean },
    defaultValue: {},
    modelValue: {},
    dir: {},
    name: {},
    autocomplete: {},
    disabled: { type: Boolean },
    required: { type: Boolean }
  },
  emits: ["update:modelValue", "update:open"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const forwarded = useForwardPropsEmits(props, emits);
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(SelectRoot), mergeProps(unref(forwarded), _attrs), {
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/select/Select.vue");
  return _sfc_setup$e ? _sfc_setup$e(props, ctx) : void 0;
};
const _sfc_main$d = /* @__PURE__ */ defineComponent({
  ...{
    inheritAttrs: false
  },
  __name: "SelectContent",
  __ssrInlineRender: true,
  props: {
    forceMount: { type: Boolean },
    position: { default: "popper" },
    bodyLock: { type: Boolean },
    side: {},
    sideOffset: {},
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
  emits: ["closeAutoFocus", "escapeKeyDown", "pointerDownOutside"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const delegatedProps = computed(() => {
      const { class: _, ...delegated } = props;
      return delegated;
    });
    const forwarded = useForwardPropsEmits(delegatedProps, emits);
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(SelectPortal), _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(SelectContent), mergeProps({ ...unref(forwarded), ..._ctx.$attrs }, {
              class: unref(cn)(
                "relative z-50 max-h-96 min-w-32 overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
                _ctx.position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
                props.class
              )
            }), {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(_sfc_main$a), null, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(SelectViewport), {
                    class: unref(cn)("p-1", _ctx.position === "popper" && "h-[--radix-select-trigger-height] w-full min-w-[--radix-select-trigger-width]")
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        ssrRenderSlot(_ctx.$slots, "default", {}, null, _push4, _parent4, _scopeId3);
                      } else {
                        return [
                          renderSlot(_ctx.$slots, "default")
                        ];
                      }
                    }),
                    _: 3
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(_sfc_main$b), null, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(_sfc_main$a)),
                    createVNode(unref(SelectViewport), {
                      class: unref(cn)("p-1", _ctx.position === "popper" && "h-[--radix-select-trigger-height] w-full min-w-[--radix-select-trigger-width]")
                    }, {
                      default: withCtx(() => [
                        renderSlot(_ctx.$slots, "default")
                      ]),
                      _: 3
                    }, 8, ["class"]),
                    createVNode(unref(_sfc_main$b))
                  ];
                }
              }),
              _: 3
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(SelectContent), mergeProps({ ...unref(forwarded), ..._ctx.$attrs }, {
                class: unref(cn)(
                  "relative z-50 max-h-96 min-w-32 overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
                  _ctx.position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
                  props.class
                )
              }), {
                default: withCtx(() => [
                  createVNode(unref(_sfc_main$a)),
                  createVNode(unref(SelectViewport), {
                    class: unref(cn)("p-1", _ctx.position === "popper" && "h-[--radix-select-trigger-height] w-full min-w-[--radix-select-trigger-width]")
                  }, {
                    default: withCtx(() => [
                      renderSlot(_ctx.$slots, "default")
                    ]),
                    _: 3
                  }, 8, ["class"]),
                  createVNode(unref(_sfc_main$b))
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
const _sfc_setup$d = _sfc_main$d.setup;
_sfc_main$d.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/select/SelectContent.vue");
  return _sfc_setup$d ? _sfc_setup$d(props, ctx) : void 0;
};
const _sfc_main$c = /* @__PURE__ */ defineComponent({
  __name: "SelectItem",
  __ssrInlineRender: true,
  props: {
    value: {},
    disabled: { type: Boolean },
    textValue: {},
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
      _push(ssrRenderComponent(unref(SelectItem), mergeProps(unref(forwardedProps), {
        class: unref(cn)(
          "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
          props.class
        )
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span class="absolute right-2 flex h-3.5 w-3.5 items-center justify-center"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(SelectItemIndicator), null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(CheckIcon), { class: "h-4 w-4" }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(CheckIcon), { class: "h-4 w-4" })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</span>`);
            _push2(ssrRenderComponent(unref(SelectItemText), null, {
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
              createVNode("span", { class: "absolute right-2 flex h-3.5 w-3.5 items-center justify-center" }, [
                createVNode(unref(SelectItemIndicator), null, {
                  default: withCtx(() => [
                    createVNode(unref(CheckIcon), { class: "h-4 w-4" })
                  ]),
                  _: 1
                })
              ]),
              createVNode(unref(SelectItemText), null, {
                default: withCtx(() => [
                  renderSlot(_ctx.$slots, "default")
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
});
const _sfc_setup$c = _sfc_main$c.setup;
_sfc_main$c.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/select/SelectItem.vue");
  return _sfc_setup$c ? _sfc_setup$c(props, ctx) : void 0;
};
const _sfc_main$b = /* @__PURE__ */ defineComponent({
  __name: "SelectScrollDownButton",
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
      _push(ssrRenderComponent(unref(SelectScrollDownButton), mergeProps(unref(forwardedProps), {
        class: unref(cn)("flex cursor-default items-center justify-center py-1", props.class)
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            ssrRenderSlot(_ctx.$slots, "default", {}, () => {
              _push2(ssrRenderComponent(unref(ChevronDownIcon), null, null, _parent2, _scopeId));
            }, _push2, _parent2, _scopeId);
          } else {
            return [
              renderSlot(_ctx.$slots, "default", {}, () => [
                createVNode(unref(ChevronDownIcon))
              ])
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
});
const _sfc_setup$b = _sfc_main$b.setup;
_sfc_main$b.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/select/SelectScrollDownButton.vue");
  return _sfc_setup$b ? _sfc_setup$b(props, ctx) : void 0;
};
const _sfc_main$a = /* @__PURE__ */ defineComponent({
  __name: "SelectScrollUpButton",
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
      _push(ssrRenderComponent(unref(SelectScrollUpButton), mergeProps(unref(forwardedProps), {
        class: unref(cn)("flex cursor-default items-center justify-center py-1", props.class)
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            ssrRenderSlot(_ctx.$slots, "default", {}, () => {
              _push2(ssrRenderComponent(unref(ChevronUpIcon), null, null, _parent2, _scopeId));
            }, _push2, _parent2, _scopeId);
          } else {
            return [
              renderSlot(_ctx.$slots, "default", {}, () => [
                createVNode(unref(ChevronUpIcon))
              ])
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
});
const _sfc_setup$a = _sfc_main$a.setup;
_sfc_main$a.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/select/SelectScrollUpButton.vue");
  return _sfc_setup$a ? _sfc_setup$a(props, ctx) : void 0;
};
const _sfc_main$9 = /* @__PURE__ */ defineComponent({
  __name: "SelectTrigger",
  __ssrInlineRender: true,
  props: {
    disabled: { type: Boolean },
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
      _push(ssrRenderComponent(unref(SelectTrigger), mergeProps(unref(forwardedProps), {
        class: unref(cn)(
          "flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background data-[placeholder]:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:truncate text-start",
          props.class
        )
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent2, _scopeId);
            _push2(ssrRenderComponent(unref(SelectIcon), { "as-child": "" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(CaretSortIcon), { class: "w-4 h-4 opacity-50 shrink-0" }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(CaretSortIcon), { class: "w-4 h-4 opacity-50 shrink-0" })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              renderSlot(_ctx.$slots, "default"),
              createVNode(unref(SelectIcon), { "as-child": "" }, {
                default: withCtx(() => [
                  createVNode(unref(CaretSortIcon), { class: "w-4 h-4 opacity-50 shrink-0" })
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
});
const _sfc_setup$9 = _sfc_main$9.setup;
_sfc_main$9.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/select/SelectTrigger.vue");
  return _sfc_setup$9 ? _sfc_setup$9(props, ctx) : void 0;
};
const _sfc_main$8 = /* @__PURE__ */ defineComponent({
  __name: "SelectValue",
  __ssrInlineRender: true,
  props: {
    placeholder: {},
    asChild: { type: Boolean },
    as: { type: [String, Object, Function] }
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(SelectValue), mergeProps(props, _attrs), {
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/select/SelectValue.vue");
  return _sfc_setup$8 ? _sfc_setup$8(props, ctx) : void 0;
};
const _sfc_main$7 = /* @__PURE__ */ defineComponent({
  __name: "AutoFormFieldEnum",
  __ssrInlineRender: true,
  props: {
    fieldName: {},
    label: {},
    required: { type: Boolean },
    config: {},
    disabled: { type: Boolean },
    options: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(Field), mergeProps({ name: _ctx.fieldName }, _attrs), {
        default: withCtx((slotProps, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(_sfc_main$J), null, {
              default: withCtx((_, _push3, _parent3, _scopeId2) => {
                var _a, _b, _c, _d;
                if (_push3) {
                  if (!((_a = _ctx.config) == null ? void 0 : _a.hideLabel)) {
                    _push3(ssrRenderComponent(_sfc_main$A, { required: _ctx.required }, {
                      default: withCtx((_2, _push4, _parent4, _scopeId3) => {
                        var _a3, _b3;
                        var _a2, _b2;
                        if (_push4) {
                          _push4(`${ssrInterpolate(((_a2 = _ctx.config) == null ? void 0 : _a2.label) || unref(beautifyObjectName)((_a3 = _ctx.label) != null ? _a3 : _ctx.fieldName))}`);
                        } else {
                          return [
                            createTextVNode(toDisplayString(((_b2 = _ctx.config) == null ? void 0 : _b2.label) || unref(beautifyObjectName)((_b3 = _ctx.label) != null ? _b3 : _ctx.fieldName)), 1)
                          ];
                        }
                      }),
                      _: 2
                    }, _parent3, _scopeId2));
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(ssrRenderComponent(unref(_sfc_main$L), null, {
                    default: withCtx((_2, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        ssrRenderSlot(_ctx.$slots, "default", slotProps, () => {
                          var _a3, _b3;
                          var _a2, _b2, _c2, _d2, _e;
                          if (((_a2 = _ctx.config) == null ? void 0 : _a2.component) === "radio") {
                            _push4(ssrRenderComponent(unref(_sfc_main$g), mergeProps({
                              disabled: (_a3 = unref(maybeBooleanishToBoolean)((_c2 = (_b2 = _ctx.config) == null ? void 0 : _b2.inputProps) == null ? void 0 : _c2.disabled)) != null ? _a3 : _ctx.disabled,
                              orientation: "vertical"
                            }, { ...slotProps.componentField }), {
                              default: withCtx((_3, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  _push5(`<!--[-->`);
                                  ssrRenderList(_ctx.options, (option, index) => {
                                    _push5(`<div class="mb-2 flex items-center gap-3 space-y-0"${_scopeId4}>`);
                                    _push5(ssrRenderComponent(unref(_sfc_main$f), {
                                      id: `${option}-${index}`,
                                      value: option
                                    }, null, _parent5, _scopeId4));
                                    _push5(ssrRenderComponent(unref(_sfc_main$I), {
                                      for: `${option}-${index}`
                                    }, {
                                      default: withCtx((_4, _push6, _parent6, _scopeId5) => {
                                        if (_push6) {
                                          _push6(`${ssrInterpolate(unref(beautifyObjectName)(option))}`);
                                        } else {
                                          return [
                                            createTextVNode(toDisplayString(unref(beautifyObjectName)(option)), 1)
                                          ];
                                        }
                                      }),
                                      _: 2
                                    }, _parent5, _scopeId4));
                                    _push5(`</div>`);
                                  });
                                  _push5(`<!--]-->`);
                                } else {
                                  return [
                                    (openBlock(true), createBlock(Fragment, null, renderList(_ctx.options, (option, index) => {
                                      return openBlock(), createBlock("div", {
                                        key: option,
                                        class: "mb-2 flex items-center gap-3 space-y-0"
                                      }, [
                                        createVNode(unref(_sfc_main$f), {
                                          id: `${option}-${index}`,
                                          value: option
                                        }, null, 8, ["id", "value"]),
                                        createVNode(unref(_sfc_main$I), {
                                          for: `${option}-${index}`
                                        }, {
                                          default: withCtx(() => [
                                            createTextVNode(toDisplayString(unref(beautifyObjectName)(option)), 1)
                                          ]),
                                          _: 2
                                        }, 1032, ["for"])
                                      ]);
                                    }), 128))
                                  ];
                                }
                              }),
                              _: 2
                            }, _parent4, _scopeId3));
                          } else {
                            _push4(ssrRenderComponent(unref(_sfc_main$e), mergeProps({
                              disabled: (_b3 = unref(maybeBooleanishToBoolean)((_e = (_d2 = _ctx.config) == null ? void 0 : _d2.inputProps) == null ? void 0 : _e.disabled)) != null ? _b3 : _ctx.disabled
                            }, { ...slotProps.componentField }), {
                              default: withCtx((_3, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  _push5(ssrRenderComponent(unref(_sfc_main$9), { class: "w-full" }, {
                                    default: withCtx((_4, _push6, _parent6, _scopeId5) => {
                                      var _a32, _b32, _c3, _d3;
                                      if (_push6) {
                                        _push6(ssrRenderComponent(unref(_sfc_main$8), {
                                          placeholder: (_b32 = (_a32 = _ctx.config) == null ? void 0 : _a32.inputProps) == null ? void 0 : _b32.placeholder
                                        }, null, _parent6, _scopeId5));
                                      } else {
                                        return [
                                          createVNode(unref(_sfc_main$8), {
                                            placeholder: (_d3 = (_c3 = _ctx.config) == null ? void 0 : _c3.inputProps) == null ? void 0 : _d3.placeholder
                                          }, null, 8, ["placeholder"])
                                        ];
                                      }
                                    }),
                                    _: 2
                                  }, _parent5, _scopeId4));
                                  _push5(ssrRenderComponent(unref(_sfc_main$d), null, {
                                    default: withCtx((_4, _push6, _parent6, _scopeId5) => {
                                      if (_push6) {
                                        _push6(`<!--[-->`);
                                        ssrRenderList(_ctx.options, (option) => {
                                          _push6(ssrRenderComponent(unref(_sfc_main$c), {
                                            key: option,
                                            value: option
                                          }, {
                                            default: withCtx((_5, _push7, _parent7, _scopeId6) => {
                                              if (_push7) {
                                                _push7(`${ssrInterpolate(unref(beautifyObjectName)(option))}`);
                                              } else {
                                                return [
                                                  createTextVNode(toDisplayString(unref(beautifyObjectName)(option)), 1)
                                                ];
                                              }
                                            }),
                                            _: 2
                                          }, _parent6, _scopeId5));
                                        });
                                        _push6(`<!--]-->`);
                                      } else {
                                        return [
                                          (openBlock(true), createBlock(Fragment, null, renderList(_ctx.options, (option) => {
                                            return openBlock(), createBlock(unref(_sfc_main$c), {
                                              key: option,
                                              value: option
                                            }, {
                                              default: withCtx(() => [
                                                createTextVNode(toDisplayString(unref(beautifyObjectName)(option)), 1)
                                              ]),
                                              _: 2
                                            }, 1032, ["value"]);
                                          }), 128))
                                        ];
                                      }
                                    }),
                                    _: 2
                                  }, _parent5, _scopeId4));
                                } else {
                                  return [
                                    createVNode(unref(_sfc_main$9), { class: "w-full" }, {
                                      default: withCtx(() => {
                                        var _a32, _b32;
                                        return [
                                          createVNode(unref(_sfc_main$8), {
                                            placeholder: (_b32 = (_a32 = _ctx.config) == null ? void 0 : _a32.inputProps) == null ? void 0 : _b32.placeholder
                                          }, null, 8, ["placeholder"])
                                        ];
                                      }),
                                      _: 1
                                    }),
                                    createVNode(unref(_sfc_main$d), null, {
                                      default: withCtx(() => [
                                        (openBlock(true), createBlock(Fragment, null, renderList(_ctx.options, (option) => {
                                          return openBlock(), createBlock(unref(_sfc_main$c), {
                                            key: option,
                                            value: option
                                          }, {
                                            default: withCtx(() => [
                                              createTextVNode(toDisplayString(unref(beautifyObjectName)(option)), 1)
                                            ]),
                                            _: 2
                                          }, 1032, ["value"]);
                                        }), 128))
                                      ]),
                                      _: 1
                                    })
                                  ];
                                }
                              }),
                              _: 2
                            }, _parent4, _scopeId3));
                          }
                        }, _push4, _parent4, _scopeId3);
                      } else {
                        return [
                          renderSlot(_ctx.$slots, "default", slotProps, () => {
                            var _a3, _b3;
                            var _a2, _b2, _c2, _d2, _e;
                            return [
                              ((_a2 = _ctx.config) == null ? void 0 : _a2.component) === "radio" ? (openBlock(), createBlock(unref(_sfc_main$g), mergeProps({
                                key: 0,
                                disabled: (_a3 = unref(maybeBooleanishToBoolean)((_c2 = (_b2 = _ctx.config) == null ? void 0 : _b2.inputProps) == null ? void 0 : _c2.disabled)) != null ? _a3 : _ctx.disabled,
                                orientation: "vertical"
                              }, { ...slotProps.componentField }), {
                                default: withCtx(() => [
                                  (openBlock(true), createBlock(Fragment, null, renderList(_ctx.options, (option, index) => {
                                    return openBlock(), createBlock("div", {
                                      key: option,
                                      class: "mb-2 flex items-center gap-3 space-y-0"
                                    }, [
                                      createVNode(unref(_sfc_main$f), {
                                        id: `${option}-${index}`,
                                        value: option
                                      }, null, 8, ["id", "value"]),
                                      createVNode(unref(_sfc_main$I), {
                                        for: `${option}-${index}`
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode(toDisplayString(unref(beautifyObjectName)(option)), 1)
                                        ]),
                                        _: 2
                                      }, 1032, ["for"])
                                    ]);
                                  }), 128))
                                ]),
                                _: 2
                              }, 1040, ["disabled"])) : (openBlock(), createBlock(unref(_sfc_main$e), mergeProps({
                                key: 1,
                                disabled: (_b3 = unref(maybeBooleanishToBoolean)((_e = (_d2 = _ctx.config) == null ? void 0 : _d2.inputProps) == null ? void 0 : _e.disabled)) != null ? _b3 : _ctx.disabled
                              }, { ...slotProps.componentField }), {
                                default: withCtx(() => [
                                  createVNode(unref(_sfc_main$9), { class: "w-full" }, {
                                    default: withCtx(() => {
                                      var _a32, _b32;
                                      return [
                                        createVNode(unref(_sfc_main$8), {
                                          placeholder: (_b32 = (_a32 = _ctx.config) == null ? void 0 : _a32.inputProps) == null ? void 0 : _b32.placeholder
                                        }, null, 8, ["placeholder"])
                                      ];
                                    }),
                                    _: 1
                                  }),
                                  createVNode(unref(_sfc_main$d), null, {
                                    default: withCtx(() => [
                                      (openBlock(true), createBlock(Fragment, null, renderList(_ctx.options, (option) => {
                                        return openBlock(), createBlock(unref(_sfc_main$c), {
                                          key: option,
                                          value: option
                                        }, {
                                          default: withCtx(() => [
                                            createTextVNode(toDisplayString(unref(beautifyObjectName)(option)), 1)
                                          ]),
                                          _: 2
                                        }, 1032, ["value"]);
                                      }), 128))
                                    ]),
                                    _: 1
                                  })
                                ]),
                                _: 2
                              }, 1040, ["disabled"]))
                            ];
                          })
                        ];
                      }
                    }),
                    _: 2
                  }, _parent3, _scopeId2));
                  if ((_b = _ctx.config) == null ? void 0 : _b.description) {
                    _push3(ssrRenderComponent(unref(_sfc_main$K), null, {
                      default: withCtx((_2, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`${ssrInterpolate(_ctx.config.description)}`);
                        } else {
                          return [
                            createTextVNode(toDisplayString(_ctx.config.description), 1)
                          ];
                        }
                      }),
                      _: 2
                    }, _parent3, _scopeId2));
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(ssrRenderComponent(unref(_sfc_main$G), null, null, _parent3, _scopeId2));
                } else {
                  return [
                    !((_c = _ctx.config) == null ? void 0 : _c.hideLabel) ? (openBlock(), createBlock(_sfc_main$A, {
                      key: 0,
                      required: _ctx.required
                    }, {
                      default: withCtx(() => {
                        var _a3;
                        var _a2;
                        return [
                          createTextVNode(toDisplayString(((_a2 = _ctx.config) == null ? void 0 : _a2.label) || unref(beautifyObjectName)((_a3 = _ctx.label) != null ? _a3 : _ctx.fieldName)), 1)
                        ];
                      }),
                      _: 1
                    }, 8, ["required"])) : createCommentVNode("", true),
                    createVNode(unref(_sfc_main$L), null, {
                      default: withCtx(() => [
                        renderSlot(_ctx.$slots, "default", slotProps, () => {
                          var _a3, _b3;
                          var _a2, _b2, _c2, _d2, _e;
                          return [
                            ((_a2 = _ctx.config) == null ? void 0 : _a2.component) === "radio" ? (openBlock(), createBlock(unref(_sfc_main$g), mergeProps({
                              key: 0,
                              disabled: (_a3 = unref(maybeBooleanishToBoolean)((_c2 = (_b2 = _ctx.config) == null ? void 0 : _b2.inputProps) == null ? void 0 : _c2.disabled)) != null ? _a3 : _ctx.disabled,
                              orientation: "vertical"
                            }, { ...slotProps.componentField }), {
                              default: withCtx(() => [
                                (openBlock(true), createBlock(Fragment, null, renderList(_ctx.options, (option, index) => {
                                  return openBlock(), createBlock("div", {
                                    key: option,
                                    class: "mb-2 flex items-center gap-3 space-y-0"
                                  }, [
                                    createVNode(unref(_sfc_main$f), {
                                      id: `${option}-${index}`,
                                      value: option
                                    }, null, 8, ["id", "value"]),
                                    createVNode(unref(_sfc_main$I), {
                                      for: `${option}-${index}`
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode(toDisplayString(unref(beautifyObjectName)(option)), 1)
                                      ]),
                                      _: 2
                                    }, 1032, ["for"])
                                  ]);
                                }), 128))
                              ]),
                              _: 2
                            }, 1040, ["disabled"])) : (openBlock(), createBlock(unref(_sfc_main$e), mergeProps({
                              key: 1,
                              disabled: (_b3 = unref(maybeBooleanishToBoolean)((_e = (_d2 = _ctx.config) == null ? void 0 : _d2.inputProps) == null ? void 0 : _e.disabled)) != null ? _b3 : _ctx.disabled
                            }, { ...slotProps.componentField }), {
                              default: withCtx(() => [
                                createVNode(unref(_sfc_main$9), { class: "w-full" }, {
                                  default: withCtx(() => {
                                    var _a32, _b32;
                                    return [
                                      createVNode(unref(_sfc_main$8), {
                                        placeholder: (_b32 = (_a32 = _ctx.config) == null ? void 0 : _a32.inputProps) == null ? void 0 : _b32.placeholder
                                      }, null, 8, ["placeholder"])
                                    ];
                                  }),
                                  _: 1
                                }),
                                createVNode(unref(_sfc_main$d), null, {
                                  default: withCtx(() => [
                                    (openBlock(true), createBlock(Fragment, null, renderList(_ctx.options, (option) => {
                                      return openBlock(), createBlock(unref(_sfc_main$c), {
                                        key: option,
                                        value: option
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode(toDisplayString(unref(beautifyObjectName)(option)), 1)
                                        ]),
                                        _: 2
                                      }, 1032, ["value"]);
                                    }), 128))
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 2
                            }, 1040, ["disabled"]))
                          ];
                        })
                      ]),
                      _: 2
                    }, 1024),
                    ((_d = _ctx.config) == null ? void 0 : _d.description) ? (openBlock(), createBlock(unref(_sfc_main$K), { key: 1 }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(_ctx.config.description), 1)
                      ]),
                      _: 1
                    })) : createCommentVNode("", true),
                    createVNode(unref(_sfc_main$G))
                  ];
                }
              }),
              _: 2
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(_sfc_main$J), null, {
                default: withCtx(() => {
                  var _a, _b;
                  return [
                    !((_a = _ctx.config) == null ? void 0 : _a.hideLabel) ? (openBlock(), createBlock(_sfc_main$A, {
                      key: 0,
                      required: _ctx.required
                    }, {
                      default: withCtx(() => {
                        var _a3;
                        var _a2;
                        return [
                          createTextVNode(toDisplayString(((_a2 = _ctx.config) == null ? void 0 : _a2.label) || unref(beautifyObjectName)((_a3 = _ctx.label) != null ? _a3 : _ctx.fieldName)), 1)
                        ];
                      }),
                      _: 1
                    }, 8, ["required"])) : createCommentVNode("", true),
                    createVNode(unref(_sfc_main$L), null, {
                      default: withCtx(() => [
                        renderSlot(_ctx.$slots, "default", slotProps, () => {
                          var _a3, _b3;
                          var _a2, _b2, _c, _d, _e;
                          return [
                            ((_a2 = _ctx.config) == null ? void 0 : _a2.component) === "radio" ? (openBlock(), createBlock(unref(_sfc_main$g), mergeProps({
                              key: 0,
                              disabled: (_a3 = unref(maybeBooleanishToBoolean)((_c = (_b2 = _ctx.config) == null ? void 0 : _b2.inputProps) == null ? void 0 : _c.disabled)) != null ? _a3 : _ctx.disabled,
                              orientation: "vertical"
                            }, { ...slotProps.componentField }), {
                              default: withCtx(() => [
                                (openBlock(true), createBlock(Fragment, null, renderList(_ctx.options, (option, index) => {
                                  return openBlock(), createBlock("div", {
                                    key: option,
                                    class: "mb-2 flex items-center gap-3 space-y-0"
                                  }, [
                                    createVNode(unref(_sfc_main$f), {
                                      id: `${option}-${index}`,
                                      value: option
                                    }, null, 8, ["id", "value"]),
                                    createVNode(unref(_sfc_main$I), {
                                      for: `${option}-${index}`
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode(toDisplayString(unref(beautifyObjectName)(option)), 1)
                                      ]),
                                      _: 2
                                    }, 1032, ["for"])
                                  ]);
                                }), 128))
                              ]),
                              _: 2
                            }, 1040, ["disabled"])) : (openBlock(), createBlock(unref(_sfc_main$e), mergeProps({
                              key: 1,
                              disabled: (_b3 = unref(maybeBooleanishToBoolean)((_e = (_d = _ctx.config) == null ? void 0 : _d.inputProps) == null ? void 0 : _e.disabled)) != null ? _b3 : _ctx.disabled
                            }, { ...slotProps.componentField }), {
                              default: withCtx(() => [
                                createVNode(unref(_sfc_main$9), { class: "w-full" }, {
                                  default: withCtx(() => {
                                    var _a32, _b32;
                                    return [
                                      createVNode(unref(_sfc_main$8), {
                                        placeholder: (_b32 = (_a32 = _ctx.config) == null ? void 0 : _a32.inputProps) == null ? void 0 : _b32.placeholder
                                      }, null, 8, ["placeholder"])
                                    ];
                                  }),
                                  _: 1
                                }),
                                createVNode(unref(_sfc_main$d), null, {
                                  default: withCtx(() => [
                                    (openBlock(true), createBlock(Fragment, null, renderList(_ctx.options, (option) => {
                                      return openBlock(), createBlock(unref(_sfc_main$c), {
                                        key: option,
                                        value: option
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode(toDisplayString(unref(beautifyObjectName)(option)), 1)
                                        ]),
                                        _: 2
                                      }, 1032, ["value"]);
                                    }), 128))
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 2
                            }, 1040, ["disabled"]))
                          ];
                        })
                      ]),
                      _: 2
                    }, 1024),
                    ((_b = _ctx.config) == null ? void 0 : _b.description) ? (openBlock(), createBlock(unref(_sfc_main$K), { key: 1 }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(_ctx.config.description), 1)
                      ]),
                      _: 1
                    })) : createCommentVNode("", true),
                    createVNode(unref(_sfc_main$G))
                  ];
                }),
                _: 2
              }, 1024)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/auto-form/AutoFormFieldEnum.vue");
  return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
const _sfc_main$6 = /* @__PURE__ */ defineComponent({
  __name: "AutoFormFieldFile",
  __ssrInlineRender: true,
  props: {
    fieldName: {},
    label: {},
    required: { type: Boolean },
    config: {},
    disabled: { type: Boolean }
  },
  setup(__props) {
    const inputFile = ref();
    async function parseFileAsString(file) {
      return new Promise((resolve, reject) => {
        if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve(reader.result);
          };
          reader.onerror = (err) => {
            reject(err);
          };
          reader.readAsDataURL(file);
        }
      });
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(Field), mergeProps({ name: _ctx.fieldName }, _attrs), {
        default: withCtx((slotProps, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(_sfc_main$J), _ctx.$attrs, {
              default: withCtx((_, _push3, _parent3, _scopeId2) => {
                var _a, _b, _c, _d;
                if (_push3) {
                  if (!((_a = _ctx.config) == null ? void 0 : _a.hideLabel)) {
                    _push3(ssrRenderComponent(_sfc_main$A, { required: _ctx.required }, {
                      default: withCtx((_2, _push4, _parent4, _scopeId3) => {
                        var _a3, _b3;
                        var _a2, _b2;
                        if (_push4) {
                          _push4(`${ssrInterpolate(((_a2 = _ctx.config) == null ? void 0 : _a2.label) || unref(beautifyObjectName)((_a3 = _ctx.label) != null ? _a3 : _ctx.fieldName))}`);
                        } else {
                          return [
                            createTextVNode(toDisplayString(((_b2 = _ctx.config) == null ? void 0 : _b2.label) || unref(beautifyObjectName)((_b3 = _ctx.label) != null ? _b3 : _ctx.fieldName)), 1)
                          ];
                        }
                      }),
                      _: 2
                    }, _parent3, _scopeId2));
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(ssrRenderComponent(unref(_sfc_main$L), null, {
                    default: withCtx((_2, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        ssrRenderSlot(_ctx.$slots, "default", slotProps, () => {
                          var _a3;
                          var _a2, _b2, _c2, _d2;
                          if (!inputFile.value) {
                            _push4(ssrRenderComponent(unref(_sfc_main$N), mergeProps({ type: "file" }, { ...(_a2 = _ctx.config) == null ? void 0 : _a2.inputProps }, {
                              disabled: (_a3 = (_c2 = (_b2 = _ctx.config) == null ? void 0 : _b2.inputProps) == null ? void 0 : _c2.disabled) != null ? _a3 : _ctx.disabled,
                              onChange: async (ev) => {
                                var _a32;
                                const file = (_a32 = ev.target.files) == null ? void 0 : _a32[0];
                                inputFile.value = file;
                                const parsed = await parseFileAsString(file);
                                slotProps.componentField.onInput(parsed);
                              }
                            }), null, _parent4, _scopeId3));
                          } else {
                            _push4(`<div class="flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent pl-3 pr-1 py-1 text-sm shadow-sm transition-colors"${_scopeId3}><p${_scopeId3}>${ssrInterpolate((_d2 = inputFile.value) == null ? void 0 : _d2.name)}</p>`);
                            _push4(ssrRenderComponent(unref(_sfc_main$M), {
                              size: "icon",
                              variant: "ghost",
                              class: "h-[26px] w-[26px]",
                              "aria-label": "Remove file",
                              type: "button",
                              onClick: () => {
                                inputFile.value = void 0;
                                slotProps.componentField.onInput(void 0);
                              }
                            }, {
                              default: withCtx((_3, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  _push5(ssrRenderComponent(unref(TrashIcon$1), null, null, _parent5, _scopeId4));
                                } else {
                                  return [
                                    createVNode(unref(TrashIcon$1))
                                  ];
                                }
                              }),
                              _: 2
                            }, _parent4, _scopeId3));
                            _push4(`</div>`);
                          }
                        }, _push4, _parent4, _scopeId3);
                      } else {
                        return [
                          renderSlot(_ctx.$slots, "default", slotProps, () => {
                            var _a3;
                            var _a2, _b2, _c2, _d2;
                            return [
                              !inputFile.value ? (openBlock(), createBlock(unref(_sfc_main$N), mergeProps({
                                key: 0,
                                type: "file"
                              }, { ...(_a2 = _ctx.config) == null ? void 0 : _a2.inputProps }, {
                                disabled: (_a3 = (_c2 = (_b2 = _ctx.config) == null ? void 0 : _b2.inputProps) == null ? void 0 : _c2.disabled) != null ? _a3 : _ctx.disabled,
                                onChange: async (ev) => {
                                  var _a32;
                                  const file = (_a32 = ev.target.files) == null ? void 0 : _a32[0];
                                  inputFile.value = file;
                                  const parsed = await parseFileAsString(file);
                                  slotProps.componentField.onInput(parsed);
                                }
                              }), null, 16, ["disabled", "onChange"])) : (openBlock(), createBlock("div", {
                                key: 1,
                                class: "flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent pl-3 pr-1 py-1 text-sm shadow-sm transition-colors"
                              }, [
                                createVNode("p", null, toDisplayString((_d2 = inputFile.value) == null ? void 0 : _d2.name), 1),
                                createVNode(unref(_sfc_main$M), {
                                  size: "icon",
                                  variant: "ghost",
                                  class: "h-[26px] w-[26px]",
                                  "aria-label": "Remove file",
                                  type: "button",
                                  onClick: () => {
                                    inputFile.value = void 0;
                                    slotProps.componentField.onInput(void 0);
                                  }
                                }, {
                                  default: withCtx(() => [
                                    createVNode(unref(TrashIcon$1))
                                  ]),
                                  _: 2
                                }, 1032, ["onClick"])
                              ]))
                            ];
                          })
                        ];
                      }
                    }),
                    _: 2
                  }, _parent3, _scopeId2));
                  if ((_b = _ctx.config) == null ? void 0 : _b.description) {
                    _push3(ssrRenderComponent(unref(_sfc_main$K), null, {
                      default: withCtx((_2, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`${ssrInterpolate(_ctx.config.description)}`);
                        } else {
                          return [
                            createTextVNode(toDisplayString(_ctx.config.description), 1)
                          ];
                        }
                      }),
                      _: 2
                    }, _parent3, _scopeId2));
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(ssrRenderComponent(unref(_sfc_main$G), null, null, _parent3, _scopeId2));
                } else {
                  return [
                    !((_c = _ctx.config) == null ? void 0 : _c.hideLabel) ? (openBlock(), createBlock(_sfc_main$A, {
                      key: 0,
                      required: _ctx.required
                    }, {
                      default: withCtx(() => {
                        var _a3;
                        var _a2;
                        return [
                          createTextVNode(toDisplayString(((_a2 = _ctx.config) == null ? void 0 : _a2.label) || unref(beautifyObjectName)((_a3 = _ctx.label) != null ? _a3 : _ctx.fieldName)), 1)
                        ];
                      }),
                      _: 1
                    }, 8, ["required"])) : createCommentVNode("", true),
                    createVNode(unref(_sfc_main$L), null, {
                      default: withCtx(() => [
                        renderSlot(_ctx.$slots, "default", slotProps, () => {
                          var _a3;
                          var _a2, _b2, _c2, _d2;
                          return [
                            !inputFile.value ? (openBlock(), createBlock(unref(_sfc_main$N), mergeProps({
                              key: 0,
                              type: "file"
                            }, { ...(_a2 = _ctx.config) == null ? void 0 : _a2.inputProps }, {
                              disabled: (_a3 = (_c2 = (_b2 = _ctx.config) == null ? void 0 : _b2.inputProps) == null ? void 0 : _c2.disabled) != null ? _a3 : _ctx.disabled,
                              onChange: async (ev) => {
                                var _a32;
                                const file = (_a32 = ev.target.files) == null ? void 0 : _a32[0];
                                inputFile.value = file;
                                const parsed = await parseFileAsString(file);
                                slotProps.componentField.onInput(parsed);
                              }
                            }), null, 16, ["disabled", "onChange"])) : (openBlock(), createBlock("div", {
                              key: 1,
                              class: "flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent pl-3 pr-1 py-1 text-sm shadow-sm transition-colors"
                            }, [
                              createVNode("p", null, toDisplayString((_d2 = inputFile.value) == null ? void 0 : _d2.name), 1),
                              createVNode(unref(_sfc_main$M), {
                                size: "icon",
                                variant: "ghost",
                                class: "h-[26px] w-[26px]",
                                "aria-label": "Remove file",
                                type: "button",
                                onClick: () => {
                                  inputFile.value = void 0;
                                  slotProps.componentField.onInput(void 0);
                                }
                              }, {
                                default: withCtx(() => [
                                  createVNode(unref(TrashIcon$1))
                                ]),
                                _: 2
                              }, 1032, ["onClick"])
                            ]))
                          ];
                        })
                      ]),
                      _: 2
                    }, 1024),
                    ((_d = _ctx.config) == null ? void 0 : _d.description) ? (openBlock(), createBlock(unref(_sfc_main$K), { key: 1 }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(_ctx.config.description), 1)
                      ]),
                      _: 1
                    })) : createCommentVNode("", true),
                    createVNode(unref(_sfc_main$G))
                  ];
                }
              }),
              _: 2
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(_sfc_main$J), _ctx.$attrs, {
                default: withCtx(() => {
                  var _a, _b;
                  return [
                    !((_a = _ctx.config) == null ? void 0 : _a.hideLabel) ? (openBlock(), createBlock(_sfc_main$A, {
                      key: 0,
                      required: _ctx.required
                    }, {
                      default: withCtx(() => {
                        var _a3;
                        var _a2;
                        return [
                          createTextVNode(toDisplayString(((_a2 = _ctx.config) == null ? void 0 : _a2.label) || unref(beautifyObjectName)((_a3 = _ctx.label) != null ? _a3 : _ctx.fieldName)), 1)
                        ];
                      }),
                      _: 1
                    }, 8, ["required"])) : createCommentVNode("", true),
                    createVNode(unref(_sfc_main$L), null, {
                      default: withCtx(() => [
                        renderSlot(_ctx.$slots, "default", slotProps, () => {
                          var _a3;
                          var _a2, _b2, _c, _d;
                          return [
                            !inputFile.value ? (openBlock(), createBlock(unref(_sfc_main$N), mergeProps({
                              key: 0,
                              type: "file"
                            }, { ...(_a2 = _ctx.config) == null ? void 0 : _a2.inputProps }, {
                              disabled: (_a3 = (_c = (_b2 = _ctx.config) == null ? void 0 : _b2.inputProps) == null ? void 0 : _c.disabled) != null ? _a3 : _ctx.disabled,
                              onChange: async (ev) => {
                                var _a32;
                                const file = (_a32 = ev.target.files) == null ? void 0 : _a32[0];
                                inputFile.value = file;
                                const parsed = await parseFileAsString(file);
                                slotProps.componentField.onInput(parsed);
                              }
                            }), null, 16, ["disabled", "onChange"])) : (openBlock(), createBlock("div", {
                              key: 1,
                              class: "flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent pl-3 pr-1 py-1 text-sm shadow-sm transition-colors"
                            }, [
                              createVNode("p", null, toDisplayString((_d = inputFile.value) == null ? void 0 : _d.name), 1),
                              createVNode(unref(_sfc_main$M), {
                                size: "icon",
                                variant: "ghost",
                                class: "h-[26px] w-[26px]",
                                "aria-label": "Remove file",
                                type: "button",
                                onClick: () => {
                                  inputFile.value = void 0;
                                  slotProps.componentField.onInput(void 0);
                                }
                              }, {
                                default: withCtx(() => [
                                  createVNode(unref(TrashIcon$1))
                                ]),
                                _: 2
                              }, 1032, ["onClick"])
                            ]))
                          ];
                        })
                      ]),
                      _: 2
                    }, 1024),
                    ((_b = _ctx.config) == null ? void 0 : _b.description) ? (openBlock(), createBlock(unref(_sfc_main$K), { key: 1 }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(_ctx.config.description), 1)
                      ]),
                      _: 1
                    })) : createCommentVNode("", true),
                    createVNode(unref(_sfc_main$G))
                  ];
                }),
                _: 2
              }, 1040)
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
});
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/auto-form/AutoFormFieldFile.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const _sfc_main$5 = /* @__PURE__ */ defineComponent({
  __name: "Textarea",
  __ssrInlineRender: true,
  props: {
    class: {},
    defaultValue: {},
    modelValue: {}
  },
  emits: ["update:modelValue"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const modelValue = useVModel(props, "modelValue", emits, {
      passive: true,
      defaultValue: props.defaultValue
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<textarea${ssrRenderAttrs(mergeProps({
        class: unref(cn)("flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50", props.class)
      }, _attrs), "textarea")}>${ssrInterpolate(unref(modelValue))}</textarea>`);
    };
  }
});
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/textarea/Textarea.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const _sfc_main$4 = /* @__PURE__ */ defineComponent({
  __name: "AutoFormFieldInput",
  __ssrInlineRender: true,
  props: {
    fieldName: {},
    label: {},
    required: { type: Boolean },
    config: {},
    disabled: { type: Boolean }
  },
  setup(__props) {
    const props = __props;
    const inputComponent = computed(() => {
      var _a;
      return ((_a = props.config) == null ? void 0 : _a.component) === "textarea" ? _sfc_main$5 : _sfc_main$N;
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(Field), mergeProps({ name: _ctx.fieldName }, _attrs), {
        default: withCtx((slotProps, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(_sfc_main$J), _ctx.$attrs, {
              default: withCtx((_, _push3, _parent3, _scopeId2) => {
                var _a, _b, _c, _d;
                if (_push3) {
                  if (!((_a = _ctx.config) == null ? void 0 : _a.hideLabel)) {
                    _push3(ssrRenderComponent(_sfc_main$A, { required: _ctx.required }, {
                      default: withCtx((_2, _push4, _parent4, _scopeId3) => {
                        var _a3, _b3;
                        var _a2, _b2;
                        if (_push4) {
                          _push4(`${ssrInterpolate(((_a2 = _ctx.config) == null ? void 0 : _a2.label) || unref(beautifyObjectName)((_a3 = _ctx.label) != null ? _a3 : _ctx.fieldName))}`);
                        } else {
                          return [
                            createTextVNode(toDisplayString(((_b2 = _ctx.config) == null ? void 0 : _b2.label) || unref(beautifyObjectName)((_b3 = _ctx.label) != null ? _b3 : _ctx.fieldName)), 1)
                          ];
                        }
                      }),
                      _: 2
                    }, _parent3, _scopeId2));
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(ssrRenderComponent(unref(_sfc_main$L), null, {
                    default: withCtx((_2, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        ssrRenderSlot(_ctx.$slots, "default", slotProps, () => {
                          var _a3;
                          var _a2, _b2, _c2;
                          ssrRenderVNode(_push4, createVNode(resolveDynamicComponent(inputComponent.value), mergeProps({ type: "text" }, { ...slotProps.componentField, ...(_a2 = _ctx.config) == null ? void 0 : _a2.inputProps }, {
                            disabled: (_a3 = (_c2 = (_b2 = _ctx.config) == null ? void 0 : _b2.inputProps) == null ? void 0 : _c2.disabled) != null ? _a3 : _ctx.disabled
                          }), null), _parent4, _scopeId3);
                        }, _push4, _parent4, _scopeId3);
                      } else {
                        return [
                          renderSlot(_ctx.$slots, "default", slotProps, () => {
                            var _a3;
                            var _a2, _b2, _c2;
                            return [
                              (openBlock(), createBlock(resolveDynamicComponent(inputComponent.value), mergeProps({ type: "text" }, { ...slotProps.componentField, ...(_a2 = _ctx.config) == null ? void 0 : _a2.inputProps }, {
                                disabled: (_a3 = (_c2 = (_b2 = _ctx.config) == null ? void 0 : _b2.inputProps) == null ? void 0 : _c2.disabled) != null ? _a3 : _ctx.disabled
                              }), null, 16, ["disabled"]))
                            ];
                          })
                        ];
                      }
                    }),
                    _: 2
                  }, _parent3, _scopeId2));
                  if ((_b = _ctx.config) == null ? void 0 : _b.description) {
                    _push3(ssrRenderComponent(unref(_sfc_main$K), null, {
                      default: withCtx((_2, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`${ssrInterpolate(_ctx.config.description)}`);
                        } else {
                          return [
                            createTextVNode(toDisplayString(_ctx.config.description), 1)
                          ];
                        }
                      }),
                      _: 2
                    }, _parent3, _scopeId2));
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(ssrRenderComponent(unref(_sfc_main$G), null, null, _parent3, _scopeId2));
                } else {
                  return [
                    !((_c = _ctx.config) == null ? void 0 : _c.hideLabel) ? (openBlock(), createBlock(_sfc_main$A, {
                      key: 0,
                      required: _ctx.required
                    }, {
                      default: withCtx(() => {
                        var _a3;
                        var _a2;
                        return [
                          createTextVNode(toDisplayString(((_a2 = _ctx.config) == null ? void 0 : _a2.label) || unref(beautifyObjectName)((_a3 = _ctx.label) != null ? _a3 : _ctx.fieldName)), 1)
                        ];
                      }),
                      _: 1
                    }, 8, ["required"])) : createCommentVNode("", true),
                    createVNode(unref(_sfc_main$L), null, {
                      default: withCtx(() => [
                        renderSlot(_ctx.$slots, "default", slotProps, () => {
                          var _a3;
                          var _a2, _b2, _c2;
                          return [
                            (openBlock(), createBlock(resolveDynamicComponent(inputComponent.value), mergeProps({ type: "text" }, { ...slotProps.componentField, ...(_a2 = _ctx.config) == null ? void 0 : _a2.inputProps }, {
                              disabled: (_a3 = (_c2 = (_b2 = _ctx.config) == null ? void 0 : _b2.inputProps) == null ? void 0 : _c2.disabled) != null ? _a3 : _ctx.disabled
                            }), null, 16, ["disabled"]))
                          ];
                        })
                      ]),
                      _: 2
                    }, 1024),
                    ((_d = _ctx.config) == null ? void 0 : _d.description) ? (openBlock(), createBlock(unref(_sfc_main$K), { key: 1 }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(_ctx.config.description), 1)
                      ]),
                      _: 1
                    })) : createCommentVNode("", true),
                    createVNode(unref(_sfc_main$G))
                  ];
                }
              }),
              _: 2
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(_sfc_main$J), _ctx.$attrs, {
                default: withCtx(() => {
                  var _a, _b;
                  return [
                    !((_a = _ctx.config) == null ? void 0 : _a.hideLabel) ? (openBlock(), createBlock(_sfc_main$A, {
                      key: 0,
                      required: _ctx.required
                    }, {
                      default: withCtx(() => {
                        var _a3;
                        var _a2;
                        return [
                          createTextVNode(toDisplayString(((_a2 = _ctx.config) == null ? void 0 : _a2.label) || unref(beautifyObjectName)((_a3 = _ctx.label) != null ? _a3 : _ctx.fieldName)), 1)
                        ];
                      }),
                      _: 1
                    }, 8, ["required"])) : createCommentVNode("", true),
                    createVNode(unref(_sfc_main$L), null, {
                      default: withCtx(() => [
                        renderSlot(_ctx.$slots, "default", slotProps, () => {
                          var _a3;
                          var _a2, _b2, _c;
                          return [
                            (openBlock(), createBlock(resolveDynamicComponent(inputComponent.value), mergeProps({ type: "text" }, { ...slotProps.componentField, ...(_a2 = _ctx.config) == null ? void 0 : _a2.inputProps }, {
                              disabled: (_a3 = (_c = (_b2 = _ctx.config) == null ? void 0 : _b2.inputProps) == null ? void 0 : _c.disabled) != null ? _a3 : _ctx.disabled
                            }), null, 16, ["disabled"]))
                          ];
                        })
                      ]),
                      _: 2
                    }, 1024),
                    ((_b = _ctx.config) == null ? void 0 : _b.description) ? (openBlock(), createBlock(unref(_sfc_main$K), { key: 1 }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(_ctx.config.description), 1)
                      ]),
                      _: 1
                    })) : createCommentVNode("", true),
                    createVNode(unref(_sfc_main$G))
                  ];
                }),
                _: 2
              }, 1040)
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
});
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/auto-form/AutoFormFieldInput.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  ...{
    inheritAttrs: false
  },
  __name: "AutoFormFieldNumber",
  __ssrInlineRender: true,
  props: {
    fieldName: {},
    label: {},
    required: { type: Boolean },
    config: {},
    disabled: { type: Boolean }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(Field), mergeProps({ name: _ctx.fieldName }, _attrs), {
        default: withCtx((slotProps, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(_sfc_main$J), null, {
              default: withCtx((_, _push3, _parent3, _scopeId2) => {
                var _a, _b, _c, _d;
                if (_push3) {
                  if (!((_a = _ctx.config) == null ? void 0 : _a.hideLabel)) {
                    _push3(ssrRenderComponent(_sfc_main$A, { required: _ctx.required }, {
                      default: withCtx((_2, _push4, _parent4, _scopeId3) => {
                        var _a3, _b3;
                        var _a2, _b2;
                        if (_push4) {
                          _push4(`${ssrInterpolate(((_a2 = _ctx.config) == null ? void 0 : _a2.label) || unref(beautifyObjectName)((_a3 = _ctx.label) != null ? _a3 : _ctx.fieldName))}`);
                        } else {
                          return [
                            createTextVNode(toDisplayString(((_b2 = _ctx.config) == null ? void 0 : _b2.label) || unref(beautifyObjectName)((_b3 = _ctx.label) != null ? _b3 : _ctx.fieldName)), 1)
                          ];
                        }
                      }),
                      _: 2
                    }, _parent3, _scopeId2));
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(ssrRenderComponent(unref(_sfc_main$L), null, {
                    default: withCtx((_2, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        ssrRenderSlot(_ctx.$slots, "default", slotProps, () => {
                          var _a3;
                          var _a2, _b2, _c2;
                          _push4(ssrRenderComponent(unref(_sfc_main$N), mergeProps({ type: "number" }, { ...slotProps.componentField, ...(_a2 = _ctx.config) == null ? void 0 : _a2.inputProps }, {
                            disabled: (_a3 = (_c2 = (_b2 = _ctx.config) == null ? void 0 : _b2.inputProps) == null ? void 0 : _c2.disabled) != null ? _a3 : _ctx.disabled
                          }), null, _parent4, _scopeId3));
                        }, _push4, _parent4, _scopeId3);
                      } else {
                        return [
                          renderSlot(_ctx.$slots, "default", slotProps, () => {
                            var _a3;
                            var _a2, _b2, _c2;
                            return [
                              createVNode(unref(_sfc_main$N), mergeProps({ type: "number" }, { ...slotProps.componentField, ...(_a2 = _ctx.config) == null ? void 0 : _a2.inputProps }, {
                                disabled: (_a3 = (_c2 = (_b2 = _ctx.config) == null ? void 0 : _b2.inputProps) == null ? void 0 : _c2.disabled) != null ? _a3 : _ctx.disabled
                              }), null, 16, ["disabled"])
                            ];
                          })
                        ];
                      }
                    }),
                    _: 2
                  }, _parent3, _scopeId2));
                  if ((_b = _ctx.config) == null ? void 0 : _b.description) {
                    _push3(ssrRenderComponent(unref(_sfc_main$K), null, {
                      default: withCtx((_2, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`${ssrInterpolate(_ctx.config.description)}`);
                        } else {
                          return [
                            createTextVNode(toDisplayString(_ctx.config.description), 1)
                          ];
                        }
                      }),
                      _: 2
                    }, _parent3, _scopeId2));
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(ssrRenderComponent(unref(_sfc_main$G), null, null, _parent3, _scopeId2));
                } else {
                  return [
                    !((_c = _ctx.config) == null ? void 0 : _c.hideLabel) ? (openBlock(), createBlock(_sfc_main$A, {
                      key: 0,
                      required: _ctx.required
                    }, {
                      default: withCtx(() => {
                        var _a3;
                        var _a2;
                        return [
                          createTextVNode(toDisplayString(((_a2 = _ctx.config) == null ? void 0 : _a2.label) || unref(beautifyObjectName)((_a3 = _ctx.label) != null ? _a3 : _ctx.fieldName)), 1)
                        ];
                      }),
                      _: 1
                    }, 8, ["required"])) : createCommentVNode("", true),
                    createVNode(unref(_sfc_main$L), null, {
                      default: withCtx(() => [
                        renderSlot(_ctx.$slots, "default", slotProps, () => {
                          var _a3;
                          var _a2, _b2, _c2;
                          return [
                            createVNode(unref(_sfc_main$N), mergeProps({ type: "number" }, { ...slotProps.componentField, ...(_a2 = _ctx.config) == null ? void 0 : _a2.inputProps }, {
                              disabled: (_a3 = (_c2 = (_b2 = _ctx.config) == null ? void 0 : _b2.inputProps) == null ? void 0 : _c2.disabled) != null ? _a3 : _ctx.disabled
                            }), null, 16, ["disabled"])
                          ];
                        })
                      ]),
                      _: 2
                    }, 1024),
                    ((_d = _ctx.config) == null ? void 0 : _d.description) ? (openBlock(), createBlock(unref(_sfc_main$K), { key: 1 }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(_ctx.config.description), 1)
                      ]),
                      _: 1
                    })) : createCommentVNode("", true),
                    createVNode(unref(_sfc_main$G))
                  ];
                }
              }),
              _: 2
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(_sfc_main$J), null, {
                default: withCtx(() => {
                  var _a, _b;
                  return [
                    !((_a = _ctx.config) == null ? void 0 : _a.hideLabel) ? (openBlock(), createBlock(_sfc_main$A, {
                      key: 0,
                      required: _ctx.required
                    }, {
                      default: withCtx(() => {
                        var _a3;
                        var _a2;
                        return [
                          createTextVNode(toDisplayString(((_a2 = _ctx.config) == null ? void 0 : _a2.label) || unref(beautifyObjectName)((_a3 = _ctx.label) != null ? _a3 : _ctx.fieldName)), 1)
                        ];
                      }),
                      _: 1
                    }, 8, ["required"])) : createCommentVNode("", true),
                    createVNode(unref(_sfc_main$L), null, {
                      default: withCtx(() => [
                        renderSlot(_ctx.$slots, "default", slotProps, () => {
                          var _a3;
                          var _a2, _b2, _c;
                          return [
                            createVNode(unref(_sfc_main$N), mergeProps({ type: "number" }, { ...slotProps.componentField, ...(_a2 = _ctx.config) == null ? void 0 : _a2.inputProps }, {
                              disabled: (_a3 = (_c = (_b2 = _ctx.config) == null ? void 0 : _b2.inputProps) == null ? void 0 : _c.disabled) != null ? _a3 : _ctx.disabled
                            }), null, 16, ["disabled"])
                          ];
                        })
                      ]),
                      _: 2
                    }, 1024),
                    ((_b = _ctx.config) == null ? void 0 : _b.description) ? (openBlock(), createBlock(unref(_sfc_main$K), { key: 1 }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(_ctx.config.description), 1)
                      ]),
                      _: 1
                    })) : createCommentVNode("", true),
                    createVNode(unref(_sfc_main$G))
                  ];
                }),
                _: 2
              }, 1024)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/auto-form/AutoFormFieldNumber.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "AutoFormFieldObject",
  __ssrInlineRender: true,
  props: {
    fieldName: {},
    required: { type: Boolean },
    config: {},
    schema: {},
    disabled: { type: Boolean }
  },
  setup(__props) {
    const props = __props;
    const shapes = computed(() => {
      var _a;
      const val = {};
      if (!props.schema)
        return;
      const shape = (_a = getBaseSchema(props.schema)) == null ? void 0 : _a.shape;
      if (!shape)
        return;
      Object.keys(shape).forEach((name) => {
        const item = shape[name];
        const baseItem = getBaseSchema(item);
        let options = baseItem && "values" in baseItem._def ? baseItem._def.values : void 0;
        if (!Array.isArray(options) && typeof options === "object")
          options = Object.values(options);
        val[name] = {
          type: getBaseType(item),
          default: getDefaultValueInZodStack(item),
          options,
          required: !["ZodOptional", "ZodNullable"].includes(item._def.typeName),
          schema: item
        };
      });
      return val;
    });
    const fieldContext = useField(props.fieldName);
    provide(FieldContextKey, fieldContext);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(_attrs)}>`);
      ssrRenderSlot(_ctx.$slots, "default", props, () => {
        _push(ssrRenderComponent(unref(_sfc_main$F), {
          type: "single",
          "as-child": "",
          class: "w-full",
          collapsible: "",
          disabled: _ctx.disabled
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(_sfc_main$J), null, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(unref(_sfc_main$D), {
                      value: _ctx.fieldName,
                      class: "border-none"
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(unref(_sfc_main$C), null, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(ssrRenderComponent(_sfc_main$A, {
                                  class: "text-base",
                                  required: _ctx.required
                                }, {
                                  default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                    var _a, _b;
                                    if (_push6) {
                                      _push6(`${ssrInterpolate(((_a = _ctx.schema) == null ? void 0 : _a.description) || unref(beautifyObjectName)(_ctx.fieldName))}`);
                                    } else {
                                      return [
                                        createTextVNode(toDisplayString(((_b = _ctx.schema) == null ? void 0 : _b.description) || unref(beautifyObjectName)(_ctx.fieldName)), 1)
                                      ];
                                    }
                                  }),
                                  _: 1
                                }, _parent5, _scopeId4));
                              } else {
                                return [
                                  createVNode(_sfc_main$A, {
                                    class: "text-base",
                                    required: _ctx.required
                                  }, {
                                    default: withCtx(() => {
                                      var _a;
                                      return [
                                        createTextVNode(toDisplayString(((_a = _ctx.schema) == null ? void 0 : _a.description) || unref(beautifyObjectName)(_ctx.fieldName)), 1)
                                      ];
                                    }),
                                    _: 1
                                  }, 8, ["required"])
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                          _push4(ssrRenderComponent(unref(_sfc_main$E), { class: "p-1 space-y-5" }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`<!--[-->`);
                                ssrRenderList(shapes.value, (shape, key) => {
                                  var _a;
                                  _push5(ssrRenderComponent(_sfc_main$1, {
                                    config: (_a = _ctx.config) == null ? void 0 : _a[key],
                                    "field-name": `${_ctx.fieldName}.${key.toString()}`,
                                    label: key.toString(),
                                    shape
                                  }, null, _parent5, _scopeId4));
                                });
                                _push5(`<!--]-->`);
                              } else {
                                return [
                                  (openBlock(true), createBlock(Fragment, null, renderList(shapes.value, (shape, key) => {
                                    var _a;
                                    return openBlock(), createBlock(_sfc_main$1, {
                                      key,
                                      config: (_a = _ctx.config) == null ? void 0 : _a[key],
                                      "field-name": `${_ctx.fieldName}.${key.toString()}`,
                                      label: key.toString(),
                                      shape
                                    }, null, 8, ["config", "field-name", "label", "shape"]);
                                  }), 128))
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(unref(_sfc_main$C), null, {
                              default: withCtx(() => [
                                createVNode(_sfc_main$A, {
                                  class: "text-base",
                                  required: _ctx.required
                                }, {
                                  default: withCtx(() => {
                                    var _a;
                                    return [
                                      createTextVNode(toDisplayString(((_a = _ctx.schema) == null ? void 0 : _a.description) || unref(beautifyObjectName)(_ctx.fieldName)), 1)
                                    ];
                                  }),
                                  _: 1
                                }, 8, ["required"])
                              ]),
                              _: 1
                            }),
                            createVNode(unref(_sfc_main$E), { class: "p-1 space-y-5" }, {
                              default: withCtx(() => [
                                (openBlock(true), createBlock(Fragment, null, renderList(shapes.value, (shape, key) => {
                                  var _a;
                                  return openBlock(), createBlock(_sfc_main$1, {
                                    key,
                                    config: (_a = _ctx.config) == null ? void 0 : _a[key],
                                    "field-name": `${_ctx.fieldName}.${key.toString()}`,
                                    label: key.toString(),
                                    shape
                                  }, null, 8, ["config", "field-name", "label", "shape"]);
                                }), 128))
                              ]),
                              _: 2
                            }, 1024)
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(unref(_sfc_main$D), {
                        value: _ctx.fieldName,
                        class: "border-none"
                      }, {
                        default: withCtx(() => [
                          createVNode(unref(_sfc_main$C), null, {
                            default: withCtx(() => [
                              createVNode(_sfc_main$A, {
                                class: "text-base",
                                required: _ctx.required
                              }, {
                                default: withCtx(() => {
                                  var _a;
                                  return [
                                    createTextVNode(toDisplayString(((_a = _ctx.schema) == null ? void 0 : _a.description) || unref(beautifyObjectName)(_ctx.fieldName)), 1)
                                  ];
                                }),
                                _: 1
                              }, 8, ["required"])
                            ]),
                            _: 1
                          }),
                          createVNode(unref(_sfc_main$E), { class: "p-1 space-y-5" }, {
                            default: withCtx(() => [
                              (openBlock(true), createBlock(Fragment, null, renderList(shapes.value, (shape, key) => {
                                var _a;
                                return openBlock(), createBlock(_sfc_main$1, {
                                  key,
                                  config: (_a = _ctx.config) == null ? void 0 : _a[key],
                                  "field-name": `${_ctx.fieldName}.${key.toString()}`,
                                  label: key.toString(),
                                  shape
                                }, null, 8, ["config", "field-name", "label", "shape"]);
                              }), 128))
                            ]),
                            _: 2
                          }, 1024)
                        ]),
                        _: 2
                      }, 1032, ["value"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              return [
                createVNode(unref(_sfc_main$J), null, {
                  default: withCtx(() => [
                    createVNode(unref(_sfc_main$D), {
                      value: _ctx.fieldName,
                      class: "border-none"
                    }, {
                      default: withCtx(() => [
                        createVNode(unref(_sfc_main$C), null, {
                          default: withCtx(() => [
                            createVNode(_sfc_main$A, {
                              class: "text-base",
                              required: _ctx.required
                            }, {
                              default: withCtx(() => {
                                var _a;
                                return [
                                  createTextVNode(toDisplayString(((_a = _ctx.schema) == null ? void 0 : _a.description) || unref(beautifyObjectName)(_ctx.fieldName)), 1)
                                ];
                              }),
                              _: 1
                            }, 8, ["required"])
                          ]),
                          _: 1
                        }),
                        createVNode(unref(_sfc_main$E), { class: "p-1 space-y-5" }, {
                          default: withCtx(() => [
                            (openBlock(true), createBlock(Fragment, null, renderList(shapes.value, (shape, key) => {
                              var _a;
                              return openBlock(), createBlock(_sfc_main$1, {
                                key,
                                config: (_a = _ctx.config) == null ? void 0 : _a[key],
                                "field-name": `${_ctx.fieldName}.${key.toString()}`,
                                label: key.toString(),
                                shape
                              }, null, 8, ["config", "field-name", "label", "shape"]);
                            }), 128))
                          ]),
                          _: 2
                        }, 1024)
                      ]),
                      _: 2
                    }, 1032, ["value"])
                  ]),
                  _: 2
                }, 1024)
              ];
            }
          }),
          _: 1
        }, _parent));
      }, _push, _parent);
      _push(`</section>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/auto-form/AutoFormFieldObject.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const INPUT_COMPONENTS = {
  date: _sfc_main$h,
  select: _sfc_main$7,
  radio: _sfc_main$7,
  checkbox: _sfc_main$x,
  switch: _sfc_main$x,
  textarea: _sfc_main$4,
  number: _sfc_main$3,
  string: _sfc_main$4,
  file: _sfc_main$6,
  array: _sfc_main$z,
  object: _sfc_main$2
};
const DEFAULT_ZOD_HANDLERS = {
  ZodString: "string",
  ZodBoolean: "checkbox",
  ZodDate: "date",
  ZodEnum: "select",
  ZodNativeEnum: "select",
  ZodNumber: "number",
  ZodArray: "array",
  ZodObject: "object"
};
var DependencyType = /* @__PURE__ */ ((DependencyType2) => {
  DependencyType2[DependencyType2["DISABLES"] = 0] = "DISABLES";
  DependencyType2[DependencyType2["REQUIRES"] = 1] = "REQUIRES";
  DependencyType2[DependencyType2["HIDES"] = 2] = "HIDES";
  DependencyType2[DependencyType2["SETS_OPTIONS"] = 3] = "SETS_OPTIONS";
  return DependencyType2;
})(DependencyType || {});
const [injectDependencies, provideDependencies] = createContext("AutoFormDependencies");
function useDependencies(fieldName) {
  const form = useFormValues();
  const currentFieldName = fieldName.replace(/\[\d+\]/g, "");
  const currentFieldValue = useFieldValue(fieldName);
  if (!form)
    throw new Error("useDependencies should be used within <AutoForm>");
  const dependencies = injectDependencies();
  const isDisabled = ref(false);
  const isHidden = ref(false);
  const isRequired = ref(false);
  const overrideOptions = ref();
  const currentFieldDependencies = computed(() => {
    var _a;
    return (_a = dependencies.value) == null ? void 0 : _a.filter(
      (dependency) => dependency.targetField === currentFieldName
    );
  });
  function getSourceValue(dep) {
    var _a;
    const source = dep.sourceField;
    const index = (_a = getIndexIfArray(fieldName)) != null ? _a : -1;
    const [sourceLast, ...sourceInitial] = source.split(".").toReversed();
    const [_targetLast, ...targetInitial] = dep.targetField.split(".").toReversed();
    if (index >= 0 && sourceInitial.join(",") === targetInitial.join(",")) {
      const [_currentLast, ...currentInitial] = fieldName.split(".").toReversed();
      return getFromPath(form.value, currentInitial.join(".") + sourceLast);
    }
    return getFromPath(form.value, source);
  }
  const sourceFieldValues = computed(() => {
    var _a;
    return (_a = currentFieldDependencies.value) == null ? void 0 : _a.map((dep) => getSourceValue(dep));
  });
  const resetConditionState = () => {
    isDisabled.value = false;
    isHidden.value = false;
    isRequired.value = false;
    overrideOptions.value = void 0;
  };
  watch([sourceFieldValues, dependencies], () => {
    var _a;
    resetConditionState();
    (_a = currentFieldDependencies.value) == null ? void 0 : _a.forEach((dep) => {
      const sourceValue = getSourceValue(dep);
      const conditionMet = dep.when(sourceValue, currentFieldValue.value);
      switch (dep.type) {
        case DependencyType.DISABLES:
          if (conditionMet)
            isDisabled.value = true;
          break;
        case DependencyType.REQUIRES:
          if (conditionMet)
            isRequired.value = true;
          break;
        case DependencyType.HIDES:
          if (conditionMet)
            isHidden.value = true;
          break;
        case DependencyType.SETS_OPTIONS:
          if (conditionMet)
            overrideOptions.value = dep.options;
          break;
      }
    });
  }, { immediate: true, deep: true });
  return {
    isDisabled,
    isHidden,
    isRequired,
    overrideOptions
  };
}
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "AutoFormField",
  __ssrInlineRender: true,
  props: {
    fieldName: {},
    shape: {},
    config: {}
  },
  setup(__props) {
    const props = __props;
    function isValidConfig(config) {
      return !!(config == null ? void 0 : config.component);
    }
    const delegatedProps = computed(() => {
      var _a, _b;
      if (["ZodObject", "ZodArray"].includes((_a = props.shape) == null ? void 0 : _a.type))
        return { schema: (_b = props.shape) == null ? void 0 : _b.schema };
      return void 0;
    });
    const { isDisabled, isHidden, isRequired, overrideOptions } = useDependencies(props.fieldName);
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      if (!unref(isHidden)) {
        ssrRenderVNode(_push, createVNode(resolveDynamicComponent(isValidConfig(_ctx.config) ? typeof _ctx.config.component === "string" ? unref(INPUT_COMPONENTS)[_ctx.config.component] : _ctx.config.component : unref(INPUT_COMPONENTS)[unref(DEFAULT_ZOD_HANDLERS)[_ctx.shape.type]]), mergeProps({
          "field-name": _ctx.fieldName,
          label: (_a = _ctx.shape.schema) == null ? void 0 : _a.description,
          required: unref(isRequired) || _ctx.shape.required,
          options: unref(overrideOptions) || _ctx.shape.options,
          disabled: unref(isDisabled),
          config: _ctx.config
        }, delegatedProps.value, _attrs), {
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
        }), _parent);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/auto-form/AutoFormField.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "AutoForm",
  __ssrInlineRender: true,
  props: {
    schema: {},
    form: {},
    fieldConfig: {},
    dependencies: {}
  },
  emits: ["submit"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const { dependencies } = toRefs(props);
    provideDependencies(dependencies);
    const shapes = computed(() => {
      const val = {};
      const baseSchema = getObjectFormSchema(props.schema);
      const shape = baseSchema.shape;
      Object.keys(shape).forEach((name) => {
        const item = shape[name];
        const baseItem = getBaseSchema(item);
        let options = baseItem && "values" in baseItem._def ? baseItem._def.values : void 0;
        if (!Array.isArray(options) && typeof options === "object")
          options = Object.values(options);
        val[name] = {
          type: getBaseType(item),
          default: getDefaultValueInZodStack(item),
          options,
          required: !["ZodOptional", "ZodNullable"].includes(item._def.typeName),
          schema: baseItem
        };
      });
      return val;
    });
    const fields = computed(() => {
      var _a;
      const val = {};
      for (const key in shapes.value) {
        const shape = shapes.value[key];
        val[key] = {
          shape,
          config: (_a = props.fieldConfig) == null ? void 0 : _a[key],
          fieldName: key
        };
      }
      return val;
    });
    const formComponent = computed(() => props.form ? "form" : Form);
    const formComponentProps = computed(() => {
      if (props.form) {
        return {
          onSubmit: props.form.handleSubmit((val) => emits("submit", val))
        };
      } else {
        const formSchema = toTypedSchema(props.schema);
        return {
          keepValues: true,
          validationSchema: formSchema,
          onSubmit: (val) => emits("submit", val)
        };
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderVNode(_push, createVNode(resolveDynamicComponent(formComponent.value), mergeProps(formComponentProps.value, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            ssrRenderSlot(_ctx.$slots, "customAutoForm", { fields: fields.value }, () => {
              _push2(`<!--[-->`);
              ssrRenderList(shapes.value, (shape, key) => {
                var _a;
                ssrRenderSlot(_ctx.$slots, key.toString(), {
                  shape,
                  fieldName: key.toString(),
                  config: (_a = _ctx.fieldConfig) == null ? void 0 : _a[key]
                }, () => {
                  var _a2;
                  _push2(ssrRenderComponent(_sfc_main$1, {
                    config: (_a2 = _ctx.fieldConfig) == null ? void 0 : _a2[key],
                    "field-name": key.toString(),
                    shape
                  }, null, _parent2, _scopeId));
                }, _push2, _parent2, _scopeId);
              });
              _push2(`<!--]-->`);
            }, _push2, _parent2, _scopeId);
            ssrRenderSlot(_ctx.$slots, "default", { shapes: shapes.value }, null, _push2, _parent2, _scopeId);
          } else {
            return [
              renderSlot(_ctx.$slots, "customAutoForm", { fields: fields.value }, () => [
                (openBlock(true), createBlock(Fragment, null, renderList(shapes.value, (shape, key) => {
                  var _a;
                  return renderSlot(_ctx.$slots, key.toString(), {
                    key,
                    shape,
                    fieldName: key.toString(),
                    config: (_a = _ctx.fieldConfig) == null ? void 0 : _a[key]
                  }, () => {
                    var _a2;
                    return [
                      createVNode(_sfc_main$1, {
                        config: (_a2 = _ctx.fieldConfig) == null ? void 0 : _a2[key],
                        "field-name": key.toString(),
                        shape
                      }, null, 8, ["config", "field-name", "shape"])
                    ];
                  });
                }), 128))
              ]),
              renderSlot(_ctx.$slots, "default", { shapes: shapes.value })
            ];
          }
        }),
        _: 3
      }), _parent);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/auto-form/AutoForm.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { DependencyType as D, _sfc_main as _, _sfc_main$B as a, _sfc_main$e as b, _sfc_main$9 as c, _sfc_main$8 as d, _sfc_main$d as e, _sfc_main$c as f };
//# sourceMappingURL=AutoForm-C_owl8I3.mjs.map
