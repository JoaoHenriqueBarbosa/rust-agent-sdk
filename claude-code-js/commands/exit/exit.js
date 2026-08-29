// Original: src/commands/exit/exit.tsx
var exports_exit = {};
__export(exports_exit, {
  call: () => call58
});
function getRandomGoodbyeMessage2() {
  return sample_default(GOODBYE_MESSAGES2) ?? "Goodbye!";
}
async function call58(onDone) {
  let showWorktree = getCurrentWorktreeSession() !== null;
  if (showWorktree)
    return /* @__PURE__ */ jsx_dev_runtime348.jsxDEV(ExitFlow, {
      showWorktree,
      onDone,
      onCancel: () => onDone()
    }, void 0, !1, void 0, this);
  return onDone(getRandomGoodbyeMessage2()), await gracefulShutdown(0, "prompt_input_exit"), null;
}
var jsx_dev_runtime348, GOODBYE_MESSAGES2;
var init_exit = __esm(() => {
  init_sample();
  init_ExitFlow();
  init_concurrentSessions();
  init_gracefulShutdown();
  init_worktree();
  jsx_dev_runtime348 = __toESM(require_react_jsx_dev_runtime_development(), 1), GOODBYE_MESSAGES2 = ["Goodbye!", "See ya!", "Bye!", "Catch you later!"];
});
