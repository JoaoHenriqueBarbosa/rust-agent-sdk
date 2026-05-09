// Original: src/components/MCPServerDialogCopy.tsx
function MCPServerDialogCopy() {
  let $3 = import_compiler_runtime361.c(1), t0;
  if ($3[0] === Symbol.for("react.memo_cache_sentinel"))
    t0 = /* @__PURE__ */ jsx_dev_runtime460.jsxDEV(ThemedText, {
      children: [
        "MCP servers may execute code or access system resources. All tool calls require approval. Learn more in the",
        " ",
        /* @__PURE__ */ jsx_dev_runtime460.jsxDEV(Link, {
          url: "https://code.claude.com/docs/en/mcp",
          children: "MCP documentation"
        }, void 0, !1, void 0, this),
        "."
      ]
    }, void 0, !0, void 0, this), $3[0] = t0;
  else
    t0 = $3[0];
  return t0;
}
var import_compiler_runtime361, jsx_dev_runtime460;
var init_MCPServerDialogCopy = __esm(() => {
  init_ink2();
  import_compiler_runtime361 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime460 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
