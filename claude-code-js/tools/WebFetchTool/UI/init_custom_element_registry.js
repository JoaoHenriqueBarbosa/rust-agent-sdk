// var: init_custom_element_registry
var init_custom_element_registry = __esm(() => {
  init_constants10();
  init_symbols();
  init_object2();
  init_shadow_roots();
  Classes = /* @__PURE__ */ new WeakMap, customElements = /* @__PURE__ */ new WeakMap, triggerConnected = createTrigger("connectedCallback", !0), triggerDisconnected = createTrigger("disconnectedCallback", !1);
});
