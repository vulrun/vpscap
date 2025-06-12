import { _ as _sfc_main$5 } from './MainHeading-bajQKQtP.mjs';
import { _ as _sfc_main$6 } from './SimpleCard-DjYniZcs.mjs';
import { _ as _sfc_main$7, c as cn } from './index-CBgozba7.mjs';
import { _ as _sfc_main$8 } from './Skeleton-DYetLY0s.mjs';
import { mergeProps, withCtx, createTextVNode, unref, createVNode, resolveDynamicComponent, createBlock, toDisplayString, withModifiers, openBlock, Fragment, renderList, createCommentVNode, computed, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderVNode, ssrRenderList } from 'vue/server-renderer';
import { ShieldCheckIcon, RssIcon, Layers2Icon, RefreshCwIcon } from 'lucide-vue-next';
import { _ as _sfc_main$4$1, a as _sfc_main$9, b as _sfc_main$3$1, c as _sfc_main$2$1, d as _sfc_main$1$1 } from './DialogTrigger-C8LiYfR4.mjs';
import { u as useApiFetch } from './hooks--hR63Zme.mjs';
import 'clsx';
import 'tailwind-merge';
import 'radix-vue';
import 'class-variance-authority';
import '@radix-icons/vue';
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
import './server.mjs';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';
import 'vue-router';
import 'vue-sonner';

const _sfc_main$4 = {
  __name: "StatCard",
  __ssrInlineRender: true,
  props: ["title", "icon", "fetch"],
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_SimpleCard = _sfc_main$6;
      const _component_Button = _sfc_main$7;
      const _component_Skeleton = _sfc_main$8;
      _push(ssrRenderComponent(_component_SimpleCard, mergeProps({ class: "relative group" }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          var _a, _b, _c, _d, _e, _f, _g, _h;
          if (_push2) {
            _push2(`<div class="hstack justify-between pb-2"${_scopeId}><span class="text-md font-medium"${_scopeId}>${ssrInterpolate(__props.title)}</span>`);
            _push2(ssrRenderComponent(_component_Button, {
              variant: "ghost",
              class: "hidden group-hover:flex absolute top-0 right-0 m-5 size-8 p-0 border border-gray-300 text-gray-600 [&_svg]:size-4",
              onClick: ($event) => __props.fetch.reload.value()
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(RefreshCwIcon), null, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(RefreshCwIcon))
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            ssrRenderVNode(_push2, createVNode(resolveDynamicComponent(__props.icon), { class: "flex group-hover:hidden size-6 text-gray-600" }, null), _parent2, _scopeId);
            _push2(`</div>`);
            if ((_b = (_a = __props.fetch) == null ? void 0 : _a.isLoading) == null ? void 0 : _b.value) {
              _push2(ssrRenderComponent(_component_Skeleton, { class: "h-4 w-full" }, null, _parent2, _scopeId));
            } else {
              _push2(`<p class="text-sm text-muted-foreground"${_scopeId}>${ssrInterpolate((_d = (_c = __props.fetch) == null ? void 0 : _c.result) == null ? void 0 : _d.value)}</p>`);
            }
          } else {
            return [
              createVNode("div", { class: "hstack justify-between pb-2" }, [
                createVNode("span", { class: "text-md font-medium" }, toDisplayString(__props.title), 1),
                createVNode(_component_Button, {
                  variant: "ghost",
                  class: "hidden group-hover:flex absolute top-0 right-0 m-5 size-8 p-0 border border-gray-300 text-gray-600 [&_svg]:size-4",
                  onClick: withModifiers(($event) => __props.fetch.reload.value(), ["prevent"])
                }, {
                  default: withCtx(() => [
                    createVNode(unref(RefreshCwIcon))
                  ]),
                  _: 1
                }, 8, ["onClick"]),
                (openBlock(), createBlock(resolveDynamicComponent(__props.icon), { class: "flex group-hover:hidden size-6 text-gray-600" }))
              ]),
              ((_f = (_e = __props.fetch) == null ? void 0 : _e.isLoading) == null ? void 0 : _f.value) ? (openBlock(), createBlock(_component_Skeleton, {
                key: 0,
                class: "h-4 w-full"
              })) : (openBlock(), createBlock("p", {
                key: 1,
                class: "text-sm text-muted-foreground"
              }, toDisplayString((_h = (_g = __props.fetch) == null ? void 0 : _g.result) == null ? void 0 : _h.value), 1))
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Home/StatCard.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const _sfc_main$3 = {
  __name: "InfoCard",
  __ssrInlineRender: true,
  props: ["title", "fetch"],
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_SimpleCard = _sfc_main$6;
      const _component_Dialog = _sfc_main$4$1;
      const _component_DialogTrigger = _sfc_main$9;
      const _component_Button = _sfc_main$7;
      const _component_DialogContent = _sfc_main$3$1;
      const _component_DialogHeader = _sfc_main$2$1;
      const _component_DialogTitle = _sfc_main$1$1;
      const _component_Skeleton = _sfc_main$8;
      _push(ssrRenderComponent(_component_SimpleCard, mergeProps({ class: "relative" }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j;
          if (_push2) {
            _push2(`<div class="hstack justify-between pb-4"${_scopeId}><span class="text-md font-medium uppercase"${_scopeId}>${ssrInterpolate(__props.title)}</span><div class="absolute top-0 right-0 m-5 flex gap-2"${_scopeId}>`);
            if (((_c = (_b = (_a = __props.fetch) == null ? void 0 : _a.result) == null ? void 0 : _b.value) == null ? void 0 : _c.length) > 6) {
              _push2(ssrRenderComponent(_component_Dialog, null, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_DialogTrigger, { class: "opacity-75" }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(_component_Button, {
                            variant: "outline",
                            size: "sm",
                            class: "ml-auto text-xs"
                          }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`view all...`);
                              } else {
                                return [
                                  createTextVNode("view all...")
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(_component_Button, {
                              variant: "outline",
                              size: "sm",
                              class: "ml-auto text-xs"
                            }, {
                              default: withCtx(() => [
                                createTextVNode("view all...")
                              ]),
                              _: 1
                            })
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(_component_DialogContent, null, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(_component_DialogHeader, null, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(ssrRenderComponent(_component_DialogTitle, null, {
                                  default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(`${ssrInterpolate(__props.title)}`);
                                    } else {
                                      return [
                                        createTextVNode(toDisplayString(__props.title), 1)
                                      ];
                                    }
                                  }),
                                  _: 1
                                }, _parent5, _scopeId4));
                              } else {
                                return [
                                  createVNode(_component_DialogTitle, null, {
                                    default: withCtx(() => [
                                      createTextVNode(toDisplayString(__props.title), 1)
                                    ]),
                                    _: 1
                                  })
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                          _push4(`<ul class="divide-y divide-gray-50 text-sm"${_scopeId3}><!--[-->`);
                          ssrRenderList(__props.fetch.result.value, (item) => {
                            var _a2;
                            _push4(`<li class="py-1.5 flex items-center justify-between text-sm"${_scopeId3}><span class="shrink-0 text-left opacity-70"${_scopeId3}>${ssrInterpolate(item == null ? void 0 : item.label)}</span><span class="shrink-1 text-right fonts-mono-inconsolata tracking-wide"${_scopeId3}>${(_a2 = item == null ? void 0 : item.value) != null ? _a2 : ""}</span></li>`);
                          });
                          _push4(`<!--]--></ul>`);
                        } else {
                          return [
                            createVNode(_component_DialogHeader, null, {
                              default: withCtx(() => [
                                createVNode(_component_DialogTitle, null, {
                                  default: withCtx(() => [
                                    createTextVNode(toDisplayString(__props.title), 1)
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            }),
                            createVNode("ul", { class: "divide-y divide-gray-50 text-sm" }, [
                              (openBlock(true), createBlock(Fragment, null, renderList(__props.fetch.result.value, (item) => {
                                return openBlock(), createBlock("li", {
                                  class: "py-1.5 flex items-center justify-between text-sm",
                                  key: item == null ? void 0 : item.label
                                }, [
                                  createVNode("span", { class: "shrink-0 text-left opacity-70" }, toDisplayString(item == null ? void 0 : item.label), 1),
                                  createVNode("span", {
                                    class: "shrink-1 text-right fonts-mono-inconsolata tracking-wide",
                                    innerHTML: item == null ? void 0 : item.value
                                  }, null, 8, ["innerHTML"])
                                ]);
                              }), 128))
                            ])
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(_component_DialogTrigger, { class: "opacity-75" }, {
                        default: withCtx(() => [
                          createVNode(_component_Button, {
                            variant: "outline",
                            size: "sm",
                            class: "ml-auto text-xs"
                          }, {
                            default: withCtx(() => [
                              createTextVNode("view all...")
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }),
                      createVNode(_component_DialogContent, null, {
                        default: withCtx(() => [
                          createVNode(_component_DialogHeader, null, {
                            default: withCtx(() => [
                              createVNode(_component_DialogTitle, null, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(__props.title), 1)
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }),
                          createVNode("ul", { class: "divide-y divide-gray-50 text-sm" }, [
                            (openBlock(true), createBlock(Fragment, null, renderList(__props.fetch.result.value, (item) => {
                              return openBlock(), createBlock("li", {
                                class: "py-1.5 flex items-center justify-between text-sm",
                                key: item == null ? void 0 : item.label
                              }, [
                                createVNode("span", { class: "shrink-0 text-left opacity-70" }, toDisplayString(item == null ? void 0 : item.label), 1),
                                createVNode("span", {
                                  class: "shrink-1 text-right fonts-mono-inconsolata tracking-wide",
                                  innerHTML: item == null ? void 0 : item.value
                                }, null, 8, ["innerHTML"])
                              ]);
                            }), 128))
                          ])
                        ]),
                        _: 1
                      })
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(ssrRenderComponent(_component_Button, {
              variant: "ghost",
              class: "size-8 p-0 border border-gray-300 text-gray-600 [&_svg]:size-4",
              onClick: ($event) => __props.fetch.reload.value()
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(RefreshCwIcon), null, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(RefreshCwIcon))
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></div>`);
            if (__props.fetch.isLoading.value) {
              _push2(`<div class="divide-y divide-gray-50 space-y-4"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_Skeleton, { class: "h-4 w-full" }, null, _parent2, _scopeId));
              _push2(ssrRenderComponent(_component_Skeleton, { class: "h-4 w-full" }, null, _parent2, _scopeId));
              _push2(ssrRenderComponent(_component_Skeleton, { class: "h-4 w-full" }, null, _parent2, _scopeId));
              _push2(ssrRenderComponent(_component_Skeleton, { class: "h-4 w-full" }, null, _parent2, _scopeId));
              _push2(`</div>`);
            } else {
              _push2(`<ul class="divide-y divide-gray-50 text-sm"${_scopeId}><!--[-->`);
              ssrRenderList((_e = (_d = __props.fetch) == null ? void 0 : _d.result) == null ? void 0 : _e.value.slice(0, 6), (item) => {
                var _a2;
                _push2(`<li class="py-1.5 flex items-center justify-between"${_scopeId}><span class="shrink-0 text-left opacity-70"${_scopeId}>${ssrInterpolate(item == null ? void 0 : item.label)}</span><span class="shrink-1 text-right font-medium fonts-mono-inconsolata tracking-wide"${_scopeId}>${(_a2 = item == null ? void 0 : item.value) != null ? _a2 : ""}</span></li>`);
              });
              _push2(`<!--]--></ul>`);
            }
          } else {
            return [
              createVNode("div", { class: "hstack justify-between pb-4" }, [
                createVNode("span", { class: "text-md font-medium uppercase" }, toDisplayString(__props.title), 1),
                createVNode("div", { class: "absolute top-0 right-0 m-5 flex gap-2" }, [
                  ((_h = (_g = (_f = __props.fetch) == null ? void 0 : _f.result) == null ? void 0 : _g.value) == null ? void 0 : _h.length) > 6 ? (openBlock(), createBlock(_component_Dialog, { key: 0 }, {
                    default: withCtx(() => [
                      createVNode(_component_DialogTrigger, { class: "opacity-75" }, {
                        default: withCtx(() => [
                          createVNode(_component_Button, {
                            variant: "outline",
                            size: "sm",
                            class: "ml-auto text-xs"
                          }, {
                            default: withCtx(() => [
                              createTextVNode("view all...")
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }),
                      createVNode(_component_DialogContent, null, {
                        default: withCtx(() => [
                          createVNode(_component_DialogHeader, null, {
                            default: withCtx(() => [
                              createVNode(_component_DialogTitle, null, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(__props.title), 1)
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }),
                          createVNode("ul", { class: "divide-y divide-gray-50 text-sm" }, [
                            (openBlock(true), createBlock(Fragment, null, renderList(__props.fetch.result.value, (item) => {
                              return openBlock(), createBlock("li", {
                                class: "py-1.5 flex items-center justify-between text-sm",
                                key: item == null ? void 0 : item.label
                              }, [
                                createVNode("span", { class: "shrink-0 text-left opacity-70" }, toDisplayString(item == null ? void 0 : item.label), 1),
                                createVNode("span", {
                                  class: "shrink-1 text-right fonts-mono-inconsolata tracking-wide",
                                  innerHTML: item == null ? void 0 : item.value
                                }, null, 8, ["innerHTML"])
                              ]);
                            }), 128))
                          ])
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  })) : createCommentVNode("", true),
                  createVNode(_component_Button, {
                    variant: "ghost",
                    class: "size-8 p-0 border border-gray-300 text-gray-600 [&_svg]:size-4",
                    onClick: withModifiers(($event) => __props.fetch.reload.value(), ["prevent"])
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(RefreshCwIcon))
                    ]),
                    _: 1
                  }, 8, ["onClick"])
                ])
              ]),
              __props.fetch.isLoading.value ? (openBlock(), createBlock("div", {
                key: 0,
                class: "divide-y divide-gray-50 space-y-4"
              }, [
                createVNode(_component_Skeleton, { class: "h-4 w-full" }),
                createVNode(_component_Skeleton, { class: "h-4 w-full" }),
                createVNode(_component_Skeleton, { class: "h-4 w-full" }),
                createVNode(_component_Skeleton, { class: "h-4 w-full" })
              ])) : (openBlock(), createBlock("ul", {
                key: 1,
                class: "divide-y divide-gray-50 text-sm"
              }, [
                (openBlock(true), createBlock(Fragment, null, renderList((_j = (_i = __props.fetch) == null ? void 0 : _i.result) == null ? void 0 : _j.value.slice(0, 6), (item) => {
                  return openBlock(), createBlock("li", {
                    class: "py-1.5 flex items-center justify-between",
                    key: item == null ? void 0 : item.label
                  }, [
                    createVNode("span", { class: "shrink-0 text-left opacity-70" }, toDisplayString(item == null ? void 0 : item.label), 1),
                    createVNode("span", {
                      class: "shrink-1 text-right font-medium fonts-mono-inconsolata tracking-wide",
                      innerHTML: item == null ? void 0 : item.value
                    }, null, 8, ["innerHTML"])
                  ]);
                }), 128))
              ]))
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
};
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Home/InfoCard.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const _sfc_main$2 = {
  __name: "JsonTable",
  __ssrInlineRender: true,
  props: ["tableData", "class"],
  setup(__props) {
    const headers = computed(() => {
      const cleanData = [].concat(__props.tableData).filter(Boolean);
      return cleanData.length > 0 ? Object.keys(cleanData == null ? void 0 : cleanData[0]) : [];
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: ("cn" in _ctx ? _ctx.cn : unref(cn))("overflow-x-auto py-4", __props.class)
      }, _attrs))}><table class="min-w-full bg-white border border-gray-200/50"><thead><tr class="text-left bg-gray-200/75"><!--[-->`);
      ssrRenderList(unref(headers), (header, index) => {
        _push(`<th class="px-4 py-2 text-sm font-semibold text-gray-900">${ssrInterpolate(header)}</th>`);
      });
      _push(`<!--]--></tr></thead><tbody><!--[-->`);
      ssrRenderList(__props.tableData, (row, index) => {
        _push(`<tr class="border-b border-gray-200/50"><!--[-->`);
        ssrRenderList(Object.keys(row), (column, colIndex) => {
          _push(`<td class="px-4 py-2">${ssrInterpolate(row[column])}</td>`);
        });
        _push(`<!--]--></tr>`);
      });
      _push(`<!--]--></tbody></table></div>`);
    };
  }
};
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/JsonTable.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = {
  __name: "DescCard",
  __ssrInlineRender: true,
  props: ["title", "fetch"],
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_SimpleCard = _sfc_main$6;
      const _component_Button = _sfc_main$7;
      const _component_Skeleton = _sfc_main$8;
      const _component_JsonTable = _sfc_main$2;
      _push(ssrRenderComponent(_component_SimpleCard, mergeProps({ class: "relative" }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p;
          if (_push2) {
            _push2(`<div class="hstack justify-between pb-4"${_scopeId}><span class="text-md font-medium uppercase"${_scopeId}>${ssrInterpolate(__props.title)}</span>`);
            _push2(ssrRenderComponent(_component_Button, {
              variant: "ghost",
              class: "absolute top-0 right-0 m-5 size-8 p-0 border border-gray-300 text-gray-600 [&_svg]:size-4",
              onClick: ($event) => {
                var _a2, _b2;
                return (_b2 = (_a2 = __props.fetch) == null ? void 0 : _a2.reload) == null ? void 0 : _b2.value();
              }
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(RefreshCwIcon), null, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(RefreshCwIcon))
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div>`);
            if ((_b = (_a = __props.fetch) == null ? void 0 : _a.isLoading) == null ? void 0 : _b.value) {
              _push2(ssrRenderComponent(_component_Skeleton, { class: "w-full h-40" }, null, _parent2, _scopeId));
            } else if ((_d = (_c = __props.fetch) == null ? void 0 : _c.result) == null ? void 0 : _d.value.length) {
              _push2(ssrRenderComponent(_component_JsonTable, {
                class: "text-xs font-mono",
                tableData: (_f = (_e = __props.fetch) == null ? void 0 : _e.result) == null ? void 0 : _f.value
              }, null, _parent2, _scopeId));
            } else {
              _push2(`<p class="text-sm text-muted-foreground"${_scopeId}>${ssrInterpolate(JSON.stringify((_h = (_g = __props.fetch) == null ? void 0 : _g.result) == null ? void 0 : _h.value))}</p>`);
            }
          } else {
            return [
              createVNode("div", { class: "hstack justify-between pb-4" }, [
                createVNode("span", { class: "text-md font-medium uppercase" }, toDisplayString(__props.title), 1),
                createVNode(_component_Button, {
                  variant: "ghost",
                  class: "absolute top-0 right-0 m-5 size-8 p-0 border border-gray-300 text-gray-600 [&_svg]:size-4",
                  onClick: withModifiers(($event) => {
                    var _a2, _b2;
                    return (_b2 = (_a2 = __props.fetch) == null ? void 0 : _a2.reload) == null ? void 0 : _b2.value();
                  }, ["prevent"])
                }, {
                  default: withCtx(() => [
                    createVNode(unref(RefreshCwIcon))
                  ]),
                  _: 1
                }, 8, ["onClick"])
              ]),
              ((_j = (_i = __props.fetch) == null ? void 0 : _i.isLoading) == null ? void 0 : _j.value) ? (openBlock(), createBlock(_component_Skeleton, {
                key: 0,
                class: "w-full h-40"
              })) : ((_l = (_k = __props.fetch) == null ? void 0 : _k.result) == null ? void 0 : _l.value.length) ? (openBlock(), createBlock(_component_JsonTable, {
                key: 1,
                class: "text-xs font-mono",
                tableData: (_n = (_m = __props.fetch) == null ? void 0 : _m.result) == null ? void 0 : _n.value
              }, null, 8, ["tableData"])) : (openBlock(), createBlock("p", {
                key: 2,
                class: "text-sm text-muted-foreground"
              }, toDisplayString(JSON.stringify((_p = (_o = __props.fetch) == null ? void 0 : _o.result) == null ? void 0 : _p.value)), 1))
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Home/DescCard.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = {
  __name: "home",
  __ssrInlineRender: true,
  setup(__props) {
    const pm2Stats = useApiFetch(`/api/fetch/pm2Stats`);
    const sslStats = useApiFetch(`/api/fetch/sslStats`);
    const webStats = useApiFetch(`/api/fetch/webStats`);
    const serverInfo = useApiFetch(`/api/fetch/serverInfo`);
    const systemInfo = useApiFetch(`/api/fetch/systemInfo`);
    const physicalMem = useApiFetch(`/api/fetch/physicalMem`);
    const diskFileSys = useApiFetch(`/api/fetch/diskFileSys`);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_MainHeading = _sfc_main$5;
      const _component_HomeStatCard = _sfc_main$4;
      const _component_HomeInfoCard = _sfc_main$3;
      const _component_HomeDescCard = _sfc_main$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex flex-col flex-1 gap-4" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_MainHeading, { title: "Welcome folks!" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Your cute server information embeded here!`);
          } else {
            return [
              createTextVNode("Your cute server information embeded here!")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="grid auto-rows-min gap-4 lg:grid-cols-3">`);
      _push(ssrRenderComponent(_component_HomeStatCard, {
        title: "SSL Certificates",
        icon: unref(ShieldCheckIcon),
        fetch: unref(sslStats)
      }, null, _parent));
      _push(ssrRenderComponent(_component_HomeStatCard, {
        title: "Web Sites",
        icon: unref(RssIcon),
        fetch: unref(webStats)
      }, null, _parent));
      _push(ssrRenderComponent(_component_HomeStatCard, {
        title: "PM2 Services",
        icon: unref(Layers2Icon),
        fetch: unref(pm2Stats)
      }, null, _parent));
      _push(`</div><div class="grid auto-rows-min gap-4 md:grid-cols-2">`);
      _push(ssrRenderComponent(_component_HomeInfoCard, {
        title: "Server Overview",
        fetch: unref(serverInfo)
      }, null, _parent));
      _push(ssrRenderComponent(_component_HomeInfoCard, {
        title: "System Overview",
        fetch: unref(systemInfo)
      }, null, _parent));
      _push(`</div>`);
      _push(ssrRenderComponent(_component_HomeDescCard, {
        title: "Physical Memory",
        fetch: unref(physicalMem)
      }, null, _parent));
      _push(ssrRenderComponent(_component_HomeDescCard, {
        title: "Disk File System",
        fetch: unref(diskFileSys)
      }, null, _parent));
      _push(`</div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/home.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=home-BLbK9VH0.mjs.map
