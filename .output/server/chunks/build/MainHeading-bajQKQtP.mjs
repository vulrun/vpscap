import { mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate } from 'vue/server-renderer';
import { c as useSlotAsText } from './hooks--hR63Zme.mjs';

const _sfc_main = {
  __name: "MainHeading",
  __ssrInlineRender: true,
  props: ["title", "brief"],
  setup(__props) {
    const props = __props;
    const slotText = useSlotAsText();
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "vstack relative mb-8" }, _attrs))}><h2 class="text-2xl font-semibold tracking-normal">${ssrInterpolate(props == null ? void 0 : props.title)}</h2><p class="text-muted-foreground">${ssrInterpolate(unref(slotText) || (props == null ? void 0 : props.brief))}</p></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/MainHeading.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as _ };
//# sourceMappingURL=MainHeading-bajQKQtP.mjs.map
