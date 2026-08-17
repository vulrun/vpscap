import { _ as _sfc_main$1 } from './SimpleCard-Cs2O4egS.mjs';
import { _ as _sfc_main$2 } from './AutoForm-CatAyJWH.mjs';
import { _ as _sfc_main$3 } from './index-DhYCmpoC.mjs';
import { mergeProps, withCtx, unref, createTextVNode, createVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent } from 'vue/server-renderer';
import { toast } from 'vue-sonner';
import { z } from 'zod';
import { $ as $persist, b as useApi } from './hooks-CHj_C_Hn.mjs';
import { e as encodeUserPass } from './Input-DQo3hs7w.mjs';
import { n as navigateTo } from './server.mjs';
import 'vee-validate';
import '@vee-validate/zod';
import 'radix-vue';
import '@radix-icons/vue';
import 'lucide-vue-next';
import '@internationalized/date';
import '@vueuse/core';
import 'clsx';
import 'tailwind-merge';
import 'class-variance-authority';
import '../nitro/nitro.mjs';
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

const _sfc_main = {
  __name: "login",
  __ssrInlineRender: true,
  setup(__props) {
    const LoginSchema = z.object({
      user: z.string().describe("Login Email"),
      pass: z.string().describe("Login Password")
    });
    const loginFieldConfig = {
      user: {
        inputProps: { type: "test" }
      },
      pass: {
        inputProps: { type: "password" }
      }
    };
    async function onSubmit(form) {
      try {
        $persist("WebAppToken", encodeUserPass(form == null ? void 0 : form.user, form == null ? void 0 : form.pass));
        const data = await useApi("/api/verify");
        $persist("WebAppData", data);
        navigateTo("/home");
      } catch (err) {
        toast.error(err == null ? void 0 : err.message, { description: "Login failed, please try again" });
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_SimpleCard = _sfc_main$1;
      const _component_AutoForm = _sfc_main$2;
      const _component_Button = _sfc_main$3;
      _push(`<main${ssrRenderAttrs(mergeProps({ class: "w-full h-screen flex items-center justify-center" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_SimpleCard, { class: "w-full max-w-sm shadow-2xl grid gap-10" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="vstack text-center"${_scopeId}><h1 class="text-xl"${_scopeId}>VPS-CAP</h1><p class="text-sm text-gray-400"${_scopeId}>login into your vps admin</p></div>`);
            _push2(ssrRenderComponent(_component_AutoForm, {
              class: "grid gap-6",
              schema: unref(LoginSchema),
              "field-config": loginFieldConfig,
              onSubmit
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_Button, { class: "w-full h-12 text-md bg-gray-700 hover:bg-gray-800" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`Login`);
                      } else {
                        return [
                          createTextVNode("Login")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_Button, { class: "w-full h-12 text-md bg-gray-700 hover:bg-gray-800" }, {
                      default: withCtx(() => [
                        createTextVNode("Login")
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
              createVNode("div", { class: "vstack text-center" }, [
                createVNode("h1", { class: "text-xl" }, "VPS-CAP"),
                createVNode("p", { class: "text-sm text-gray-400" }, "login into your vps admin")
              ]),
              createVNode(_component_AutoForm, {
                class: "grid gap-6",
                schema: unref(LoginSchema),
                "field-config": loginFieldConfig,
                onSubmit
              }, {
                default: withCtx(() => [
                  createVNode(_component_Button, { class: "w-full h-12 text-md bg-gray-700 hover:bg-gray-800" }, {
                    default: withCtx(() => [
                      createTextVNode("Login")
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }, 8, ["schema"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</main>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/login.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=login-B8GhOAB1.mjs.map
