// Original: src/tools/ConfigTool/UI.tsx
function renderToolUseMessage23(input) {
  if (!input.setting)
    return null;
  if (input.value === void 0)
    return /* @__PURE__ */ jsx_dev_runtime149.jsxDEV(ThemedText, {
      dimColor: !0,
      children: [
        "Getting ",
        input.setting
      ]
    }, void 0, !0, void 0, this);
  return /* @__PURE__ */ jsx_dev_runtime149.jsxDEV(ThemedText, {
    dimColor: !0,
    children: [
      "Setting ",
      input.setting,
      " to ",
      jsonStringify(input.value)
    ]
  }, void 0, !0, void 0, this);
}
function renderToolResultMessage22(content) {
  if (!content.success)
    return /* @__PURE__ */ jsx_dev_runtime149.jsxDEV(MessageResponse, {
      children: /* @__PURE__ */ jsx_dev_runtime149.jsxDEV(ThemedText, {
        color: "error",
        children: [
          "Failed: ",
          content.error
        ]
      }, void 0, !0, void 0, this)
    }, void 0, !1, void 0, this);
  if (content.operation === "get")
    return /* @__PURE__ */ jsx_dev_runtime149.jsxDEV(MessageResponse, {
      children: /* @__PURE__ */ jsx_dev_runtime149.jsxDEV(ThemedText, {
        children: [
          /* @__PURE__ */ jsx_dev_runtime149.jsxDEV(ThemedText, {
            bold: !0,
            children: content.setting
          }, void 0, !1, void 0, this),
          " = ",
          jsonStringify(content.value)
        ]
      }, void 0, !0, void 0, this)
    }, void 0, !1, void 0, this);
  return /* @__PURE__ */ jsx_dev_runtime149.jsxDEV(MessageResponse, {
    children: /* @__PURE__ */ jsx_dev_runtime149.jsxDEV(ThemedText, {
      children: [
        "Set ",
        /* @__PURE__ */ jsx_dev_runtime149.jsxDEV(ThemedText, {
          bold: !0,
          children: content.setting
        }, void 0, !1, void 0, this),
        " to",
        " ",
        /* @__PURE__ */ jsx_dev_runtime149.jsxDEV(ThemedText, {
          bold: !0,
          children: jsonStringify(content.newValue)
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this)
  }, void 0, !1, void 0, this);
}
function renderToolUseRejectedMessage8() {
  return /* @__PURE__ */ jsx_dev_runtime149.jsxDEV(ThemedText, {
    color: "warning",
    children: "Config change rejected"
  }, void 0, !1, void 0, this);
}
var jsx_dev_runtime149;
var init_UI22 = __esm(() => {
  init_MessageResponse();
  init_ink2();
  init_slowOperations();
  jsx_dev_runtime149 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
