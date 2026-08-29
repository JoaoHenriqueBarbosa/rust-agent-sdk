// Original: src/commands/diff/diff.tsx
var exports_diff = {};
__export(exports_diff, {
  call: () => call18
});
var jsx_dev_runtime192, call18 = async (onDone, context7) => {
  let {
    DiffDialog: DiffDialog2
  } = await Promise.resolve().then(() => (init_DiffDialog(), exports_DiffDialog));
  return /* @__PURE__ */ jsx_dev_runtime192.jsxDEV(DiffDialog2, {
    messages: context7.messages,
    onDone
  }, void 0, !1, void 0, this);
};
var init_diff3 = __esm(() => {
  jsx_dev_runtime192 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
