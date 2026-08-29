// Original: src/replLauncher.tsx
async function launchRepl(root3, appProps, replProps, renderAndRun) {
  let {
    App: App3
  } = await Promise.resolve().then(() => (init_App2(), exports_App)), {
    REPL: REPL2
  } = await Promise.resolve().then(() => (init_REPL(), exports_REPL));
  await renderAndRun(root3, /* @__PURE__ */ jsx_dev_runtime459.jsxDEV(App3, {
    ...appProps,
    children: /* @__PURE__ */ jsx_dev_runtime459.jsxDEV(REPL2, {
      ...replProps
    }, void 0, !1, void 0, this)
  }, void 0, !1, void 0, this));
}
var jsx_dev_runtime459;
var init_replLauncher = __esm(() => {
  jsx_dev_runtime459 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
