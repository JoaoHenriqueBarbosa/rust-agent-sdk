// Original: src/components/mcp/CapabilitiesSection.tsx
function CapabilitiesSection(t0) {
  let $3 = import_compiler_runtime182.c(9), {
    serverToolsCount,
    serverPromptsCount,
    serverResourcesCount
  } = t0, capabilities;
  if ($3[0] !== serverPromptsCount || $3[1] !== serverResourcesCount || $3[2] !== serverToolsCount) {
    if (capabilities = [], serverToolsCount > 0)
      capabilities.push("tools");
    if (serverResourcesCount > 0)
      capabilities.push("resources");
    if (serverPromptsCount > 0)
      capabilities.push("prompts");
    $3[0] = serverPromptsCount, $3[1] = serverResourcesCount, $3[2] = serverToolsCount, $3[3] = capabilities;
  } else
    capabilities = $3[3];
  let t1;
  if ($3[4] === Symbol.for("react.memo_cache_sentinel"))
    t1 = /* @__PURE__ */ jsx_dev_runtime227.jsxDEV(ThemedText, {
      bold: !0,
      children: "Capabilities: "
    }, void 0, !1, void 0, this), $3[4] = t1;
  else
    t1 = $3[4];
  let t2;
  if ($3[5] !== capabilities)
    t2 = capabilities.length > 0 ? /* @__PURE__ */ jsx_dev_runtime227.jsxDEV(Byline, {
      children: capabilities
    }, void 0, !1, void 0, this) : "none", $3[5] = capabilities, $3[6] = t2;
  else
    t2 = $3[6];
  let t3;
  if ($3[7] !== t2)
    t3 = /* @__PURE__ */ jsx_dev_runtime227.jsxDEV(ThemedBox_default, {
      children: [
        t1,
        /* @__PURE__ */ jsx_dev_runtime227.jsxDEV(ThemedText, {
          color: "text",
          children: t2
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this), $3[7] = t2, $3[8] = t3;
  else
    t3 = $3[8];
  return t3;
}
var import_compiler_runtime182, jsx_dev_runtime227;
var init_CapabilitiesSection = __esm(() => {
  init_ink2();
  init_Byline();
  import_compiler_runtime182 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime227 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
