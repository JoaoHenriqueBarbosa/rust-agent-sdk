// Original: src/components/CoordinatorAgentStatus.tsx
function getVisibleAgentTasks(tasks2) {
  return Object.values(tasks2).filter((t2) => isPanelAgentTask(t2) && t2.evictAfter !== 0).sort((a2, b) => a2.startTime - b.startTime);
}
function useCoordinatorTaskCount() {
  let tasks2 = useAppState(_temp194), t0;
  return t0 = 0, t0;
}
function _temp194(s2) {
  return s2.tasks;
}
var import_compiler_runtime321, React133, jsx_dev_runtime415;
var init_CoordinatorAgentStatus = __esm(() => {
  init_figures2();
  init_useTerminalSize();
  init_stringWidth();
  init_ink2();
  init_AppState();
  init_teammateViewHelpers();
  init_LocalAgentTask();
  init_format();
  init_framework();
  init_taskStatusUtils();
  import_compiler_runtime321 = __toESM(require_react_compiler_runtime_development(), 1), React133 = __toESM(require_react_development(), 1), jsx_dev_runtime415 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
