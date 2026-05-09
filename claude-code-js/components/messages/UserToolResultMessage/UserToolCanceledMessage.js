// Original: src/components/messages/UserToolResultMessage/UserToolCanceledMessage.tsx
function UserToolCanceledMessage() {
  let $3 = import_compiler_runtime96.c(1), t0;
  if ($3[0] === Symbol.for("react.memo_cache_sentinel"))
    t0 = /* @__PURE__ */ jsx_dev_runtime107.jsxDEV(MessageResponse, {
      height: 1,
      children: /* @__PURE__ */ jsx_dev_runtime107.jsxDEV(InterruptedByUser, {}, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[0] = t0;
  else
    t0 = $3[0];
  return t0;
}
var import_compiler_runtime96, jsx_dev_runtime107;
var init_UserToolCanceledMessage = __esm(() => {
  init_InterruptedByUser();
  init_MessageResponse();
  import_compiler_runtime96 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime107 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
