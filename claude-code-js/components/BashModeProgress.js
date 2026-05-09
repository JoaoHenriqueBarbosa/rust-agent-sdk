// Original: src/components/BashModeProgress.tsx
function BashModeProgress(t0) {
  let $3 = import_compiler_runtime337.c(8), {
    input,
    progress,
    verbose
  } = t0, t1 = `<bash-input>${input}</bash-input>`, t2;
  if ($3[0] !== t1)
    t2 = /* @__PURE__ */ jsx_dev_runtime435.jsxDEV(UserBashInputMessage, {
      addMargin: !1,
      param: {
        text: t1,
        type: "text"
      }
    }, void 0, !1, void 0, this), $3[0] = t1, $3[1] = t2;
  else
    t2 = $3[1];
  let t3;
  if ($3[2] !== progress || $3[3] !== verbose)
    t3 = progress ? /* @__PURE__ */ jsx_dev_runtime435.jsxDEV(ShellProgressMessage, {
      fullOutput: progress.fullOutput,
      output: progress.output,
      elapsedTimeSeconds: progress.elapsedTimeSeconds,
      totalLines: progress.totalLines,
      verbose
    }, void 0, !1, void 0, this) : BashTool.renderToolUseProgressMessage?.([], {
      verbose,
      tools: [],
      terminalSize: void 0
    }), $3[2] = progress, $3[3] = verbose, $3[4] = t3;
  else
    t3 = $3[4];
  let t4;
  if ($3[5] !== t2 || $3[6] !== t3)
    t4 = /* @__PURE__ */ jsx_dev_runtime435.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      marginTop: 1,
      children: [
        t2,
        t3
      ]
    }, void 0, !0, void 0, this), $3[5] = t2, $3[6] = t3, $3[7] = t4;
  else
    t4 = $3[7];
  return t4;
}
var import_compiler_runtime337, jsx_dev_runtime435;
var init_BashModeProgress = __esm(() => {
  init_ink2();
  init_BashTool();
  init_UserBashInputMessage();
  init_ShellProgressMessage();
  import_compiler_runtime337 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime435 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
