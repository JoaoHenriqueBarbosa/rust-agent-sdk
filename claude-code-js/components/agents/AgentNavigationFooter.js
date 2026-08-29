// Original: src/components/agents/AgentNavigationFooter.tsx
function AgentNavigationFooter(t0) {
  let $3 = import_compiler_runtime251.c(2), {
    instructions: t1
  } = t0, instructions = t1 === void 0 ? "Press \u2191\u2193 to navigate \xB7 Enter to select \xB7 Esc to go back" : t1, exitState = useExitOnCtrlCDWithKeybindings(), t2 = exitState.pending ? `Press ${exitState.keyName} again to exit` : instructions, t3;
  if ($3[0] !== t2)
    t3 = /* @__PURE__ */ jsx_dev_runtime319.jsxDEV(ThemedBox_default, {
      marginLeft: 2,
      children: /* @__PURE__ */ jsx_dev_runtime319.jsxDEV(ThemedText, {
        dimColor: !0,
        children: t2
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[0] = t2, $3[1] = t3;
  else
    t3 = $3[1];
  return t3;
}
var import_compiler_runtime251, jsx_dev_runtime319;
var init_AgentNavigationFooter = __esm(() => {
  init_useExitOnCtrlCDWithKeybindings();
  init_ink2();
  import_compiler_runtime251 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime319 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
