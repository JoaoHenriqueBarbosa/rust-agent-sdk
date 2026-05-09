// function: _temp527
function _temp527(u_1, i5) {
  return /* @__PURE__ */ jsx_dev_runtime378.jsxDEV(ThemedBox_default, {
    flexDirection: "column",
    marginLeft: 2,
    children: [
      /* @__PURE__ */ jsx_dev_runtime378.jsxDEV(ThemedText, {
        color: "warning",
        children: permissionRuleValueToString(u_1.rule.ruleValue)
      }, void 0, !1, void 0, this),
      /* @__PURE__ */ jsx_dev_runtime378.jsxDEV(ThemedText, {
        dimColor: !0,
        children: [
          "  ",
          u_1.reason
        ]
      }, void 0, !0, void 0, this),
      /* @__PURE__ */ jsx_dev_runtime378.jsxDEV(ThemedText, {
        dimColor: !0,
        children: [
          "  ",
          "Fix: ",
          u_1.fix
        ]
      }, void 0, !0, void 0, this)
    ]
  }, i5, !0, void 0, this);
}
