import { _ as _sfc_main$4 } from './MainHeading-bajQKQtP.mjs';
import { _ as _sfc_main$5, c as cn } from './index-CBgozba7.mjs';
import { mergeProps, withCtx, createTextVNode, unref, createVNode, computed, toValue, getCurrentInstance, onServerPrefetch, ref, resolveDynamicComponent, createBlock, openBlock, shallowRef, toRef, nextTick, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrRenderClass, ssrInterpolate, ssrRenderSlot, ssrRenderVNode } from 'vue/server-renderer';
import { CheckIcon, ClipboardIcon, ClipboardPasteIcon } from 'lucide-vue-next';
import { a as useLocalRef, b as useApi, c as useSlotAsText } from './hooks--hR63Zme.mjs';
import { debounce } from 'perfect-debounce';
import { b as useNuxtApp, c as asyncDataDefaults, d as createError } from './server.mjs';
import 'clsx';
import 'tailwind-merge';
import 'radix-vue';
import 'class-variance-authority';
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
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';
import 'vue-router';
import 'vue-sonner';

const _sfc_main$3 = {
  __name: "Sidebar",
  __ssrInlineRender: true,
  props: ["class", "steps", "statuses", "active_step", "onUpdate"],
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<ol${ssrRenderAttrs(mergeProps({
        class: ("cn" in _ctx ? _ctx.cn : unref(cn))(["mb-6 md:mr-6 pb-6 md:pr-6 border-b md:border-b-0 md:border-r border-gray-400/50 space-y-3", props == null ? void 0 : props.class])
      }, _attrs))}><!--[-->`);
      ssrRenderList(props == null ? void 0 : props.steps, (stepVal, stepKey, stepIdx) => {
        var _a;
        _push(`<li class="${ssrRenderClass(("cn" in _ctx ? _ctx.cn : unref(cn))(["hstack cursor-pointer transition-all space-x-4 p-3 rounded-md border border-transparent text-gray-600", { "bg-gray-500/10 border-zinc-800/20": (props == null ? void 0 : props.active_step) === stepIdx }]))}">`);
        if (((_a = props == null ? void 0 : props.statuses) == null ? void 0 : _a[stepKey]) === true) {
          _push(`<div class="malign grow-0 shrink-0 leading-normal size-7 border border-green-700 rounded-full text-white bg-green-700">`);
          _push(ssrRenderComponent(unref(CheckIcon), { class: "size-4" }, null, _parent));
          _push(`</div>`);
        } else {
          _push(`<div class="malign grow-0 shrink-0 leading-normal size-7 border-2 border-gray-400 rounded-full text-sm font-mono font-semibold">${ssrInterpolate(stepIdx + 1)}</div>`);
        }
        _push(`<span class="text-lg font-semibold">${ssrInterpolate(stepVal)}</span></li>`);
      });
      _push(`<!--]--></ol>`);
    };
  }
};
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Guide/Sidebar.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const _sfc_main$2 = {
  __name: "Content",
  __ssrInlineRender: true,
  props: ["step_key", "steps", "active_step"],
  setup(__props) {
    const step_idx = computed(() => Object.keys(__props.steps).indexOf(__props.step_key));
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      if (__props.active_step === unref(step_idx)) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex flex-col space-y-4 text-md [&_p]:text-justify [&_p]:text-gray-700" }, _attrs))}><span class="text-2xl font-bold mb-3 pb-3 border-b">${ssrInterpolate((_a = __props.steps) == null ? void 0 : _a[__props.step_key])}</span>`);
        ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
};
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Guide/Content.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = {
  __name: "CopyText",
  __ssrInlineRender: true,
  props: ["textToCopy"],
  setup(__props) {
    const props = __props;
    const slotText = useSlotAsText();
    const buttonIcon = ref(ClipboardIcon);
    const textToCopy = ref((props == null ? void 0 : props.textToCopy) || slotText);
    const copyToClipboard = () => {
      (void 0).clipboard.writeText(textToCopy.value).then(() => {
        buttonIcon.value = ClipboardPasteIcon;
        setTimeout(() => buttonIcon.value = ClipboardIcon, 1e3);
      }).catch((err) => console.error("Failed to copy text: ", err));
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Button = _sfc_main$5;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex items-center justify-between rounded-lg shadow-inner border border-gray-300 px-4 py-2 font-mono text-sm bg-gray-50" }, _attrs))}>${ssrInterpolate(unref(textToCopy))} `);
      _push(ssrRenderComponent(_component_Button, {
        variant: "outline",
        onClick: copyToClipboard,
        class: "rounded px-3 py-1 ml-2 -mr-2"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            ssrRenderVNode(_push2, createVNode(resolveDynamicComponent(unref(buttonIcon)), { class: "size-4" }, null), _parent2, _scopeId);
          } else {
            return [
              (openBlock(), createBlock(resolveDynamicComponent(unref(buttonIcon)), { class: "size-4" }))
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/CopyText.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const isDefer = (dedupe) => dedupe === "defer" || dedupe === false;
function useAsyncData(...args) {
  var _a2, _b, _c, _d, _e, _f, _g;
  var _a;
  const autoKey = typeof args[args.length - 1] === "string" ? args.pop() : void 0;
  if (_isAutoKeyNeeded(args[0], args[1])) {
    args.unshift(autoKey);
  }
  let [_key, _handler, options = {}] = args;
  const key = computed(() => toValue(_key));
  if (typeof key.value !== "string") {
    throw new TypeError("[nuxt] [useAsyncData] key must be a string.");
  }
  if (typeof _handler !== "function") {
    throw new TypeError("[nuxt] [useAsyncData] handler must be a function.");
  }
  const nuxtApp = useNuxtApp();
  (_a2 = options.server) != null ? _a2 : options.server = true;
  (_b = options.default) != null ? _b : options.default = getDefault;
  (_c = options.getCachedData) != null ? _c : options.getCachedData = getDefaultCachedData;
  (_d = options.lazy) != null ? _d : options.lazy = false;
  (_e = options.immediate) != null ? _e : options.immediate = true;
  (_f = options.deep) != null ? _f : options.deep = asyncDataDefaults.deep;
  (_g = options.dedupe) != null ? _g : options.dedupe = "cancel";
  options._functionName || "useAsyncData";
  nuxtApp._asyncData[key.value];
  const initialFetchOptions = { cause: "initial", dedupe: options.dedupe };
  if (!((_a = nuxtApp._asyncData[key.value]) == null ? void 0 : _a._init)) {
    initialFetchOptions.cachedData = options.getCachedData(key.value, nuxtApp, { cause: "initial" });
    nuxtApp._asyncData[key.value] = createAsyncData(nuxtApp, key.value, _handler, options, initialFetchOptions.cachedData);
  }
  const asyncData = nuxtApp._asyncData[key.value];
  asyncData._deps++;
  const initialFetch = () => nuxtApp._asyncData[key.value].execute(initialFetchOptions);
  const fetchOnServer = options.server !== false && nuxtApp.payload.serverRendered;
  if (fetchOnServer && options.immediate) {
    const promise = initialFetch();
    if (getCurrentInstance()) {
      onServerPrefetch(() => promise);
    } else {
      nuxtApp.hook("app:created", async () => {
        await promise;
      });
    }
  }
  const asyncReturn = {
    data: writableComputedRef(() => {
      var _a22;
      return (_a22 = nuxtApp._asyncData[key.value]) == null ? void 0 : _a22.data;
    }),
    pending: writableComputedRef(() => {
      var _a22;
      return (_a22 = nuxtApp._asyncData[key.value]) == null ? void 0 : _a22.pending;
    }),
    status: writableComputedRef(() => {
      var _a22;
      return (_a22 = nuxtApp._asyncData[key.value]) == null ? void 0 : _a22.status;
    }),
    error: writableComputedRef(() => {
      var _a22;
      return (_a22 = nuxtApp._asyncData[key.value]) == null ? void 0 : _a22.error;
    }),
    refresh: (...args2) => nuxtApp._asyncData[key.value].execute(...args2),
    execute: (...args2) => nuxtApp._asyncData[key.value].execute(...args2),
    clear: () => clearNuxtDataByKey(nuxtApp, key.value)
  };
  const asyncDataPromise = Promise.resolve(nuxtApp._asyncDataPromises[key.value]).then(() => asyncReturn);
  Object.assign(asyncDataPromise, asyncReturn);
  return asyncDataPromise;
}
function writableComputedRef(getter) {
  return computed({
    get() {
      var _a;
      return (_a = getter()) == null ? void 0 : _a.value;
    },
    set(value) {
      const ref2 = getter();
      if (ref2) {
        ref2.value = value;
      }
    }
  });
}
function _isAutoKeyNeeded(keyOrFetcher, fetcher) {
  if (typeof keyOrFetcher === "string") {
    return false;
  }
  if (typeof keyOrFetcher === "object" && keyOrFetcher !== null) {
    return false;
  }
  if (typeof keyOrFetcher === "function" && typeof fetcher === "function") {
    return false;
  }
  return true;
}
function clearNuxtDataByKey(nuxtApp, key) {
  if (key in nuxtApp.payload.data) {
    nuxtApp.payload.data[key] = void 0;
  }
  if (key in nuxtApp.payload._errors) {
    nuxtApp.payload._errors[key] = asyncDataDefaults.errorValue;
  }
  if (nuxtApp._asyncData[key]) {
    nuxtApp._asyncData[key].data.value = void 0;
    nuxtApp._asyncData[key].error.value = asyncDataDefaults.errorValue;
    {
      nuxtApp._asyncData[key].pending.value = false;
    }
    nuxtApp._asyncData[key].status.value = "idle";
  }
  if (key in nuxtApp._asyncDataPromises) {
    if (nuxtApp._asyncDataPromises[key]) {
      nuxtApp._asyncDataPromises[key].cancelled = true;
    }
    nuxtApp._asyncDataPromises[key] = void 0;
  }
}
function pick(obj, keys) {
  const newObj = {};
  for (const key of keys) {
    newObj[key] = obj[key];
  }
  return newObj;
}
function createAsyncData(nuxtApp, key, _handler, options, initialCachedData) {
  var _a2;
  var _a;
  (_a2 = (_a = nuxtApp.payload._errors)[key]) != null ? _a2 : _a[key] = asyncDataDefaults.errorValue;
  const hasCustomGetCachedData = options.getCachedData !== getDefaultCachedData;
  const handler = _handler ;
  const _ref = options.deep ? ref : shallowRef;
  const hasCachedData = initialCachedData != null;
  const unsubRefreshAsyncData = nuxtApp.hook("app:data:refresh", async (keys) => {
    if (!keys || keys.includes(key)) {
      await asyncData.execute({ cause: "refresh:hook" });
    }
  });
  const asyncData = {
    data: _ref(hasCachedData ? initialCachedData : options.default()),
    pending: shallowRef(!hasCachedData),
    error: toRef(nuxtApp.payload._errors, key),
    status: shallowRef("idle"),
    execute: (opts = {}) => {
      var _a3, _b2;
      if (nuxtApp._asyncDataPromises[key]) {
        if (isDefer((_a3 = opts.dedupe) != null ? _a3 : options.dedupe)) {
          return nuxtApp._asyncDataPromises[key];
        }
        nuxtApp._asyncDataPromises[key].cancelled = true;
      }
      if (opts.cause === "initial" || nuxtApp.isHydrating) {
        const cachedData = "cachedData" in opts ? opts.cachedData : options.getCachedData(key, nuxtApp, { cause: (_b2 = opts.cause) != null ? _b2 : "refresh:manual" });
        if (cachedData != null) {
          nuxtApp.payload.data[key] = asyncData.data.value = cachedData;
          asyncData.error.value = asyncDataDefaults.errorValue;
          asyncData.status.value = "success";
          return Promise.resolve(cachedData);
        }
      }
      {
        asyncData.pending.value = true;
      }
      asyncData.status.value = "pending";
      const promise = new Promise(
        (resolve, reject) => {
          try {
            resolve(handler(nuxtApp));
          } catch (err) {
            reject(err);
          }
        }
      ).then(async (_result) => {
        if (promise.cancelled) {
          return nuxtApp._asyncDataPromises[key];
        }
        let result = _result;
        if (options.transform) {
          result = await options.transform(_result);
        }
        if (options.pick) {
          result = pick(result, options.pick);
        }
        nuxtApp.payload.data[key] = result;
        asyncData.data.value = result;
        asyncData.error.value = asyncDataDefaults.errorValue;
        asyncData.status.value = "success";
      }).catch((error) => {
        if (promise.cancelled) {
          return nuxtApp._asyncDataPromises[key];
        }
        asyncData.error.value = createError(error);
        asyncData.data.value = unref(options.default());
        asyncData.status.value = "error";
      }).finally(() => {
        if (promise.cancelled) {
          return;
        }
        {
          asyncData.pending.value = false;
        }
        delete nuxtApp._asyncDataPromises[key];
      });
      nuxtApp._asyncDataPromises[key] = promise;
      return nuxtApp._asyncDataPromises[key];
    },
    _execute: debounce((...args) => asyncData.execute(...args), 0, { leading: true }),
    _default: options.default,
    _deps: 0,
    _init: true,
    _hash: void 0,
    _off: () => {
      var _a22;
      unsubRefreshAsyncData();
      if ((_a22 = nuxtApp._asyncData[key]) == null ? void 0 : _a22._init) {
        nuxtApp._asyncData[key]._init = false;
      }
      if (!hasCustomGetCachedData) {
        nextTick(() => {
          var _a3;
          if (!((_a3 = nuxtApp._asyncData[key]) == null ? void 0 : _a3._init)) {
            clearNuxtDataByKey(nuxtApp, key);
            asyncData.execute = () => Promise.resolve();
            asyncData.data.value = asyncDataDefaults.value;
          }
        });
      }
    }
  };
  return asyncData;
}
const getDefault = () => asyncDataDefaults.value;
const getDefaultCachedData = (key, nuxtApp, ctx) => {
  if (nuxtApp.isHydrating) {
    return nuxtApp.payload.data[key];
  }
  if (ctx.cause !== "refresh:manual" && ctx.cause !== "refresh:hook") {
    return nuxtApp.static.data[key];
  }
};
const _sfc_main = {
  __name: "guide",
  __ssrInlineRender: true,
  setup(__props) {
    const { data, status, error, refresh, clear } = useAsyncData("prerequisite", () => useApi(`/api/verify`));
    const stepLabels = {
      //
      install_nginx: "Install Nginx",
      setup_nginx: "Setup Nginx Configuration",
      install_pm2: "Install PM2",
      install_php: "Install PHP and modules"
    };
    const activeStep = useLocalRef("guide-active-index", 0);
    function changeStep(idx) {
      const maxIdx = Object.keys(stepLabels).length - 1;
      activeStep.value = Math.max(0, Math.min(idx, maxIdx));
    }
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      const _component_MainHeading = _sfc_main$4;
      const _component_Button = _sfc_main$5;
      const _component_GuideSidebar = _sfc_main$3;
      const _component_GuideContent = _sfc_main$2;
      const _component_CopyText = _sfc_main$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "w-full max-w-screen-ld mx-auto space-y-4" }, _attrs))}><div class="hstack relative">`);
      _push(ssrRenderComponent(_component_MainHeading, { title: "Welcome folks!" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Here&#39;s the steps, to make your server ready for the deployments!`);
          } else {
            return [
              createTextVNode("Here's the steps, to make your server ready for the deployments!")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_Button, {
        variant: "outline",
        class: "absolute right-0 top-0 border-gray-300 shadow-xs hover:bg-transparent hover:border-gray-400",
        onClick: unref(refresh)
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Verify`);
          } else {
            return [
              createTextVNode("Verify")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="w-full grid md:grid-cols-[320px_1fr] lg:grid-cols-[400px_1fr]">`);
      _push(ssrRenderComponent(_component_GuideSidebar, {
        active_step: unref(activeStep),
        steps: stepLabels,
        statuses: (_a = unref(data)) == null ? void 0 : _a.prerequisite,
        onUpdate: changeStep
      }, null, _parent));
      _push(ssrRenderComponent(_component_GuideContent, {
        active_step: unref(activeStep),
        steps: stepLabels,
        step_key: "install_nginx"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<p${_scopeId}> Since this is our first interaction with the apt packaging system in this session, we will update our local package index so that we have access to the most recent package listings. Afterwards, we can install <code${_scopeId}>nginx</code></p>`);
            _push2(ssrRenderComponent(_component_CopyText, { textToCopy: "sudo apt update" }, null, _parent2, _scopeId));
            _push2(`<p${_scopeId}>Now, lets install nginx</p>`);
            _push2(ssrRenderComponent(_component_CopyText, { textToCopy: "sudo apt install nginx" }, null, _parent2, _scopeId));
            _push2(`<p${_scopeId}>Checking web server status</p>`);
            _push2(ssrRenderComponent(_component_CopyText, { textToCopy: "sudo systemctl status nginx" }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode("p", null, [
                createTextVNode(" Since this is our first interaction with the apt packaging system in this session, we will update our local package index so that we have access to the most recent package listings. Afterwards, we can install "),
                createVNode("code", null, "nginx")
              ]),
              createVNode(_component_CopyText, { textToCopy: "sudo apt update" }),
              createVNode("p", null, "Now, lets install nginx"),
              createVNode(_component_CopyText, { textToCopy: "sudo apt install nginx" }),
              createVNode("p", null, "Checking web server status"),
              createVNode(_component_CopyText, { textToCopy: "sudo systemctl status nginx" })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_GuideContent, {
        active_step: unref(activeStep),
        steps: stepLabels,
        step_key: "setup_nginx"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<p${_scopeId}>Lets make changes to the nginx configuration, execute the below command, to update nginx configurations</p>`);
            _push2(ssrRenderComponent(_component_CopyText, { textToCopy: "npm run tweak-nginx-conf" }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode("p", null, "Lets make changes to the nginx configuration, execute the below command, to update nginx configurations"),
              createVNode(_component_CopyText, { textToCopy: "npm run tweak-nginx-conf" })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_GuideContent, {
        active_step: unref(activeStep),
        steps: stepLabels,
        step_key: "install_pm2"
      }, null, _parent));
      _push(ssrRenderComponent(_component_GuideContent, {
        active_step: unref(activeStep),
        steps: stepLabels,
        step_key: "install_php"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<p${_scopeId}> Since this is our first interaction with the apt packaging system in this session, we will update our local package index so that we have access to the most recent package listings. Afterwards, we can install <code${_scopeId}>nginx</code></p>`);
            _push2(ssrRenderComponent(_component_CopyText, { textToCopy: "sudo apt update" }, null, _parent2, _scopeId));
            _push2(`<p${_scopeId}>Now, lets install php latest version</p>`);
            _push2(ssrRenderComponent(_component_CopyText, { textToCopy: "sudo apt install php" }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode("p", null, [
                createTextVNode(" Since this is our first interaction with the apt packaging system in this session, we will update our local package index so that we have access to the most recent package listings. Afterwards, we can install "),
                createVNode("code", null, "nginx")
              ]),
              createVNode(_component_CopyText, { textToCopy: "sudo apt update" }),
              createVNode("p", null, "Now, lets install php latest version"),
              createVNode(_component_CopyText, { textToCopy: "sudo apt install php" })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/guide.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=guide-dDqc1_7J.mjs.map
