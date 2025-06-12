import { mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs } from 'vue/server-renderer';

const _sfc_main = {
  __name: "sample",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex flex-1 flex-col p-4 gap-4" }, _attrs))}><div class="grid auto-rows-min gap-4 md:grid-cols-3"><div class="aspect-video rounded-xl bg-zinc-200"></div><div class="aspect-video rounded-xl bg-zinc-200"></div><div class="aspect-video rounded-xl bg-zinc-200"></div></div><div class="grid auto-rows-min gap-4 md:grid-cols-2"><div class="aspect-video rounded-xl bg-zinc-200"></div><div class="aspect-video rounded-xl bg-zinc-200"></div></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/sample.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=sample-25UpzAAj.mjs.map
