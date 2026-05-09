// Original: src/tools/BashTool/UI.tsx
function BackgroundHint(t0) {
  let $3 = import_compiler_runtime107.c(9), t1;
  if ($3[0] !== t0)
    t1 = t0 === void 0 ? {} : t0, $3[0] = t0, $3[1] = t1;
  else
    t1 = $3[1];
  let {
    onBackground
  } = t1, store = useAppStateStore(), setAppState = useSetAppState(), t2;
  if ($3[2] !== onBackground || $3[3] !== setAppState || $3[4] !== store)
    t2 = () => {
      backgroundAll(() => store.getState(), setAppState), onBackground?.();
    }, $3[2] = onBackground, $3[3] = setAppState, $3[4] = store, $3[5] = t2;
  else
    t2 = $3[5];
  let handleBackground = t2, t3;
  if ($3[6] === Symbol.for("react.memo_cache_sentinel"))
    t3 = {
      context: "Task"
    }, $3[6] = t3;
  else
    t3 = $3[6];
  useKeybinding("task:background", handleBackground, t3);
  let baseShortcut = useShortcutDisplay("task:background", "Task", "ctrl+b"), shortcut = env3.terminal === "tmux" && baseShortcut === "ctrl+b" ? "ctrl+b ctrl+b (twice)" : baseShortcut;
  if (isEnvTruthy(process.env.CLAUDE_CODE_DISABLE_BACKGROUND_TASKS))
    return null;
  let t4;
  if ($3[7] !== shortcut)
    t4 = /* @__PURE__ */ jsx_dev_runtime122.jsxDEV(ThemedBox_default, {
      paddingLeft: 5,
      children: /* @__PURE__ */ jsx_dev_runtime122.jsxDEV(ThemedText, {
        dimColor: !0,
        children: /* @__PURE__ */ jsx_dev_runtime122.jsxDEV(KeyboardShortcutHint, {
          shortcut,
          action: "run in background",
          parens: !0
        }, void 0, !1, void 0, this)
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[7] = shortcut, $3[8] = t4;
  else
    t4 = $3[8];
  return t4;
}
function renderToolUseMessage7(input, {
  verbose,
  theme: _theme
}) {
  let {
    command: command12
  } = input;
  if (!command12)
    return null;
  let sedInfo = parseSedEditCommand(command12);
  if (sedInfo)
    return verbose ? sedInfo.filePath : getDisplayPath(sedInfo.filePath);
  if (!verbose) {
    let lines2 = command12.split(`
`);
    if (isFullscreenEnvEnabled()) {
      let label = extractBashCommentLabel(command12);
      if (label)
        return label.length > MAX_COMMAND_DISPLAY_CHARS ? label.slice(0, MAX_COMMAND_DISPLAY_CHARS) + "\u2026" : label;
    }
    let needsLineTruncation = lines2.length > MAX_COMMAND_DISPLAY_LINES, needsCharTruncation = command12.length > MAX_COMMAND_DISPLAY_CHARS;
    if (needsLineTruncation || needsCharTruncation) {
      let truncated = command12;
      if (needsLineTruncation)
        truncated = lines2.slice(0, MAX_COMMAND_DISPLAY_LINES).join(`
`);
      if (truncated.length > MAX_COMMAND_DISPLAY_CHARS)
        truncated = truncated.slice(0, MAX_COMMAND_DISPLAY_CHARS);
      return /* @__PURE__ */ jsx_dev_runtime122.jsxDEV(ThemedText, {
        children: [
          truncated.trim(),
          "\u2026"
        ]
      }, void 0, !0, void 0, this);
    }
  }
  return command12;
}
function renderToolUseProgressMessage5(progressMessagesForMessage, {
  verbose,
  tools: _tools,
  terminalSize: _terminalSize,
  inProgressToolCallCount: _inProgressToolCallCount
}) {
  let lastProgress = progressMessagesForMessage.at(-1);
  if (!lastProgress || !lastProgress.data)
    return /* @__PURE__ */ jsx_dev_runtime122.jsxDEV(MessageResponse, {
      height: 1,
      children: /* @__PURE__ */ jsx_dev_runtime122.jsxDEV(ThemedText, {
        dimColor: !0,
        children: "Running\u2026"
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this);
  let data = lastProgress.data;
  return /* @__PURE__ */ jsx_dev_runtime122.jsxDEV(ShellProgressMessage, {
    fullOutput: data.fullOutput,
    output: data.output,
    elapsedTimeSeconds: data.elapsedTimeSeconds,
    totalLines: data.totalLines,
    totalBytes: data.totalBytes,
    timeoutMs: data.timeoutMs,
    taskId: data.taskId,
    verbose
  }, void 0, !1, void 0, this);
}
function renderToolUseQueuedMessage2() {
  return /* @__PURE__ */ jsx_dev_runtime122.jsxDEV(MessageResponse, {
    height: 1,
    children: /* @__PURE__ */ jsx_dev_runtime122.jsxDEV(ThemedText, {
      dimColor: !0,
      children: "Waiting\u2026"
    }, void 0, !1, void 0, this)
  }, void 0, !1, void 0, this);
}
function renderToolResultMessage6(content, progressMessagesForMessage, {
  verbose,
  theme: _theme,
  tools: _tools,
  style: _style
}) {
  let timeoutMs = progressMessagesForMessage.at(-1)?.data?.timeoutMs;
  return /* @__PURE__ */ jsx_dev_runtime122.jsxDEV(BashToolResultMessage, {
    content,
    verbose,
    timeoutMs
  }, void 0, !1, void 0, this);
}
function renderToolUseErrorMessage3(result, {
  verbose,
  progressMessagesForMessage: _progressMessagesForMessage,
  tools: _tools
}) {
  return /* @__PURE__ */ jsx_dev_runtime122.jsxDEV(FallbackToolUseErrorMessage, {
    result,
    verbose
  }, void 0, !1, void 0, this);
}
var import_compiler_runtime107, jsx_dev_runtime122, MAX_COMMAND_DISPLAY_LINES = 2, MAX_COMMAND_DISPLAY_CHARS = 160;
var init_UI6 = __esm(() => {
  init_KeyboardShortcutHint();
  init_FallbackToolUseErrorMessage();
  init_MessageResponse();
  init_ShellProgressMessage();
  init_ink2();
  init_useKeybinding();
  init_useShortcutDisplay();
  init_AppState();
  init_LocalShellTask();
  init_env();
  init_envUtils();
  init_file();
  init_fullscreen();
  init_BashToolResultMessage();
  init_sedEditParser();
  import_compiler_runtime107 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime122 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
