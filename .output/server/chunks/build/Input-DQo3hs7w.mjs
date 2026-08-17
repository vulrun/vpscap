import { defineComponent, mergeProps, unref, computed, withCtx, renderSlot, createVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrGetDynamicModelProps, ssrRenderComponent, ssrRenderSlot } from 'vue/server-renderer';
import { c as cn } from './index-DhYCmpoC.mjs';
import { useForwardPropsEmits, RadioGroupRoot, useForwardProps, RadioGroupItem, RadioGroupIndicator, SwitchRoot, SwitchThumb } from 'radix-vue';
import { useVModel } from '@vueuse/core';

function delay(ms2) {
  return new Promise((resolve) => setTimeout(resolve, ms2));
}
function createAvatarInitials(name) {
  const words = `${name || ""}`.trim().split(" ").slice(0, 2);
  const initials = words.map((word) => word.charAt(0)).join("");
  return initials.toUpperCase();
}
function encodeUserPass(user, pass) {
  if (!user) throw new Error("User is needed");
  if (!pass) throw new Error("Pass is needed");
  return hexEncode(JSON.stringify({ user, pass }));
}
function hexEncode(inputData) {
  const inputStr = String(inputData != null ? inputData : "").replace(/\r|\n/g, "");
  if (!inputStr) return "";
  const byteArray = Array.prototype.map.call(inputStr, (c) => c.charCodeAt(0).toString(16).padStart(2, "0"));
  return byteArray.join("");
}
function cleanArray() {
  return [].concat(...arguments).filter(Boolean);
}
function markdownToHtmlLite(text) {
  let html = text;
  html = html.replace(/__(.*?)__/g, "<u>$1</u>");
  html = html.replace(/~~(.*?)~~/g, "<del>$1</del>");
  html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*(.*?)\*/g, "<em>$1</em>");
  html = html.replace(/_(.*?)_/g, "<em>$1</em>");
  html = html.replace(/`([^`]+)`/g, "<code>$1</code>");
  return html;
}
function sanitizeDomains(val) {
  if (!val) return [];
  val = String(val || "").replace(/[^a-z0-9\-\.]/gi, " ").replace(/\s+/g, " ").split(" ");
  const validDomainRegex = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/i;
  val = Array.from(new Set(val)).filter((site) => validDomainRegex.test(site));
  val.sort();
  return cleanArray(val);
}
function buildSmtpUrl({ host, port, user, pass, ssl = false }) {
  if (!host) return;
  const smtpPort = port ? `:${port}` : "";
  const protocol = ssl ? "smtps" : "smtp";
  let authPart = "";
  if (user) {
    if (pass) {
      authPart = `${encodeURIComponent(user)}:${encodeURIComponent(pass)}@`;
    } else {
      authPart = `${encodeURIComponent(user)}@`;
    }
  } else if (pass) {
    return;
  }
  return `${protocol}://${authPart}${host}${smtpPort}`;
}
function parseSmtpUrl(url) {
  try {
    if (url === "") return null;
    const u = new URL(url);
    return {
      host: u.hostname,
      port: u.port,
      user: decodeURIComponent(u.username),
      pass: decodeURIComponent(u.password),
      ssl: u.protocol.startsWith("smtps")
    };
  } catch (err) {
    return void 0;
  }
}
function validateSmtpUrl(url) {
  try {
    if (!url) throw new Error("URL is required.");
    const match = String(url).match(/^(?:(smtps?):\/\/)?(?:([^:@]+)?(?::([^@]+))?\@)?([^:\/]+)(?:\:(\d+))?$/);
    if (!match) throw new Error("Invalid SMTP URL format. It should be like smtps://user:password@hostname:port");
    const [, protocol, username, password, host, port] = match;
    if (!protocol) {
      throw new Error("Protocol is required. Use 'smtp' or 'smtps'.");
    }
    if (!["smtp", "smtps"].includes(protocol.replace("://", ""))) {
      throw new Error("Invalid protocol. Use 'smtp' or 'smtps'.");
    }
    if (!host) throw new Error("Host is required.");
    const portNum = Number(port);
    if (isNaN(portNum) || portNum < 1 || portNum > 65535) {
      throw new Error("Invalid port. It should be a number between 1 and 65535.");
    }
    if (!username && password) {
      throw new Error("Username is required when a password is provided.");
    }
    return { valid: true, message: "SMTP URL is valid." };
  } catch (err) {
    return { valid: false, message: err == null ? void 0 : err.message };
  }
}
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
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
    as: {},
    class: { type: [Boolean, null, String, Object, Array] }
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
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/switch/Switch.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
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
    as: {},
    class: { type: [Boolean, null, String, Object, Array] }
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
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/radio-group/RadioGroup.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "RadioGroupItem",
  __ssrInlineRender: true,
  props: {
    id: {},
    value: {},
    disabled: { type: Boolean },
    required: { type: Boolean },
    name: {},
    asChild: { type: Boolean },
    as: {},
    class: { type: [Boolean, null, String, Object, Array] }
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
            _push2(ssrRenderComponent(unref(RadioGroupIndicator), { class: "flex items-center justify-center w-full h-full relative after:content-[''] after:block after:w-2.5 after:h-2.5 after:rounded-[50%] after:bg-stone-700 dark:after:bg-stone-100" }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(RadioGroupIndicator), { class: "flex items-center justify-center w-full h-full relative after:content-[''] after:block after:w-2.5 after:h-2.5 after:rounded-[50%] after:bg-stone-700 dark:after:bg-stone-100" })
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/radio-group/RadioGroupItem.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Input",
  __ssrInlineRender: true,
  props: {
    defaultValue: {},
    modelValue: {},
    class: { type: [Boolean, null, String, Object, Array] }
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
      let _temp0;
      _push(`<input${ssrRenderAttrs((_temp0 = mergeProps({
        class: unref(cn)("flex h-9 w-full rounded-sm border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50", props.class)
      }, _attrs), mergeProps(_temp0, ssrGetDynamicModelProps(_temp0, unref(modelValue)))))}>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/input/Input.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as _, _sfc_main$3 as a, _sfc_main$2 as b, _sfc_main$1 as c, delay as d, encodeUserPass as e, createAvatarInitials as f, buildSmtpUrl as g, markdownToHtmlLite as m, parseSmtpUrl as p, sanitizeDomains as s, validateSmtpUrl as v };
//# sourceMappingURL=Input-DQo3hs7w.mjs.map
