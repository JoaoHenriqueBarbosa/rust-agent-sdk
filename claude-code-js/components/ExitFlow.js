// Original: src/components/ExitFlow.tsx
function getRandomGoodbyeMessage() {
  return sample_default(GOODBYE_MESSAGES) ?? "Goodbye!";
}
function ExitFlow(t0) {
  let $3 = import_compiler_runtime272.c(5), {
    showWorktree,
    onDone,
    onCancel
  } = t0, t1;
  if ($3[0] !== onDone)
    t1 = async function(resultMessage) {
      onDone(resultMessage ?? getRandomGoodbyeMessage()), await gracefulShutdown(0, "prompt_input_exit");
    }, $3[0] = onDone, $3[1] = t1;
  else
    t1 = $3[1];
  let onExit2 = t1;
  if (showWorktree) {
    let t2;
    if ($3[2] !== onCancel || $3[3] !== onExit2)
      t2 = /* @__PURE__ */ jsx_dev_runtime347.jsxDEV(WorktreeExitDialog, {
        onDone: onExit2,
        onCancel
      }, void 0, !1, void 0, this), $3[2] = onCancel, $3[3] = onExit2, $3[4] = t2;
    else
      t2 = $3[4];
    return t2;
  }
  return null;
}
var import_compiler_runtime272, jsx_dev_runtime347, GOODBYE_MESSAGES;
var init_ExitFlow = __esm(() => {
  init_sample();
  init_gracefulShutdown();
  init_WorktreeExitDialog();
  import_compiler_runtime272 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime347 = __toESM(require_react_jsx_dev_runtime_development(), 1), GOODBYE_MESSAGES = ["Goodbye!", "See ya!", "Bye!", "Catch you later!"];
});
