// Original: src/components/SessionBackgroundHint.tsx
function SessionBackgroundHint(t0) {
  let $3 = import_compiler_runtime340.c(10), {
    onBackgroundSession,
    isLoading
  } = t0, setAppState = useSetAppState(), appStateStore = useAppStateStore(), [showSessionHint, setShowSessionHint] = import_react279.useState(!1), handleDoublePress = useDoublePress(setShowSessionHint, onBackgroundSession, _temp202), t1;
  if ($3[0] !== appStateStore || $3[1] !== handleDoublePress || $3[2] !== isLoading || $3[3] !== setAppState)
    t1 = () => {
      if (isEnvTruthy(process.env.CLAUDE_CODE_DISABLE_BACKGROUND_TASKS))
        return;
      let state4 = appStateStore.getState();
      if (hasForegroundTasks(state4)) {
        if (backgroundAll(() => appStateStore.getState(), setAppState), !getGlobalConfig().hasUsedBackgroundTask)
          saveGlobalConfig(_temp283);
      } else if (isEnvTruthy("false") && isLoading)
        handleDoublePress();
    }, $3[0] = appStateStore, $3[1] = handleDoublePress, $3[2] = isLoading, $3[3] = setAppState, $3[4] = t1;
  else
    t1 = $3[4];
  let handleBackground = t1, hasForeground = useAppState(hasForegroundTasks), t2;
  if ($3[5] === Symbol.for("react.memo_cache_sentinel"))
    t2 = isEnvTruthy("false"), $3[5] = t2;
  else
    t2 = $3[5];
  let t3 = hasForeground || t2 && isLoading, t4;
  if ($3[6] !== t3)
    t4 = {
      context: "Task",
      isActive: t3
    }, $3[6] = t3, $3[7] = t4;
  else
    t4 = $3[7];
  useKeybinding("task:background", handleBackground, t4);
  let baseShortcut = useShortcutDisplay("task:background", "Task", "ctrl+b"), shortcut = env3.terminal === "tmux" && baseShortcut === "ctrl+b" ? "ctrl+b ctrl+b" : baseShortcut;
  if (!isLoading || !showSessionHint)
    return null;
  let t5;
  if ($3[8] !== shortcut)
    t5 = /* @__PURE__ */ jsx_dev_runtime438.jsxDEV(ThemedBox_default, {
      paddingLeft: 2,
      children: /* @__PURE__ */ jsx_dev_runtime438.jsxDEV(ThemedText, {
        dimColor: !0,
        children: /* @__PURE__ */ jsx_dev_runtime438.jsxDEV(KeyboardShortcutHint, {
          shortcut,
          action: "background"
        }, void 0, !1, void 0, this)
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[8] = shortcut, $3[9] = t5;
  else
    t5 = $3[9];
  return t5;
}
function _temp283(c3) {
  return c3.hasUsedBackgroundTask ? c3 : {
    ...c3,
    hasUsedBackgroundTask: !0
  };
}
function _temp202() {}
var import_compiler_runtime340, import_react279, jsx_dev_runtime438;
var init_SessionBackgroundHint = __esm(() => {
  init_useDoublePress();
  init_ink2();
  init_useKeybinding();
  init_useShortcutDisplay();
  init_AppState();
  init_LocalShellTask();
  init_config4();
  init_env();
  init_envUtils();
  init_KeyboardShortcutHint();
  import_compiler_runtime340 = __toESM(require_react_compiler_runtime_development(), 1), import_react279 = __toESM(require_react_development(), 1), jsx_dev_runtime438 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
