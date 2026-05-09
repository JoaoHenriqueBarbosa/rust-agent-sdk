// Original: src/commands/extra-usage/extra-usage.tsx
var exports_extra_usage = {};
__export(exports_extra_usage, {
  call: () => call3
});
async function call3(onDone, context6) {
  let result = await runExtraUsage();
  if (result.type === "message")
    return onDone(result.value), null;
  return /* @__PURE__ */ jsx_dev_runtime73.jsxDEV(Login, {
    startingMessage: "Starting new login following /extra-usage. Exit with Ctrl-C to use existing account.",
    onDone: (success2) => {
      context6.onChangeAPIKey(), onDone(success2 ? "Login successful" : "Login interrupted");
    }
  }, void 0, !1, void 0, this);
}
var jsx_dev_runtime73;
var init_extra_usage = __esm(() => {
  init_login();
  init_extra_usage_core();
  jsx_dev_runtime73 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
