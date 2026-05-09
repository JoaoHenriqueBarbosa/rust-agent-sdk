// Original: src/tools/PowerShellTool/UI.tsx
function renderToolUseMessage8(input, {
  verbose,
  theme: _theme
}) {
  let {
    command: command12
  } = input;
  if (!command12)
    return null;
  let displayCommand = command12;
  if (!verbose) {
    let lines2 = displayCommand.split(`
`), needsLineTruncation = lines2.length > MAX_COMMAND_DISPLAY_LINES2, needsCharTruncation = displayCommand.length > MAX_COMMAND_DISPLAY_CHARS2;
    if (needsLineTruncation || needsCharTruncation) {
      let truncated = displayCommand;
      if (needsLineTruncation)
        truncated = lines2.slice(0, MAX_COMMAND_DISPLAY_LINES2).join(`
`);
      if (truncated.length > MAX_COMMAND_DISPLAY_CHARS2)
        truncated = truncated.slice(0, MAX_COMMAND_DISPLAY_CHARS2);
      return /* @__PURE__ */ jsx_dev_runtime123.jsxDEV(ThemedText, {
        children: [
          truncated.trim(),
          "\u2026"
        ]
      }, void 0, !0, void 0, this);
    }
  }
  return displayCommand;
}
function renderToolUseProgressMessage6(progressMessagesForMessage, {
  verbose,
  tools: _tools,
  terminalSize: _terminalSize,
  inProgressToolCallCount: _inProgressToolCallCount
}) {
  let lastProgress = progressMessagesForMessage.at(-1);
  if (!lastProgress || !lastProgress.data)
    return /* @__PURE__ */ jsx_dev_runtime123.jsxDEV(MessageResponse, {
      height: 1,
      children: /* @__PURE__ */ jsx_dev_runtime123.jsxDEV(ThemedText, {
        dimColor: !0,
        children: "Running\u2026"
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this);
  let data = lastProgress.data;
  return /* @__PURE__ */ jsx_dev_runtime123.jsxDEV(ShellProgressMessage, {
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
function renderToolUseQueuedMessage3() {
  return /* @__PURE__ */ jsx_dev_runtime123.jsxDEV(MessageResponse, {
    height: 1,
    children: /* @__PURE__ */ jsx_dev_runtime123.jsxDEV(ThemedText, {
      dimColor: !0,
      children: "Waiting\u2026"
    }, void 0, !1, void 0, this)
  }, void 0, !1, void 0, this);
}
function renderToolResultMessage7(content, progressMessagesForMessage, {
  verbose,
  theme: _theme,
  tools: _tools,
  style: _style
}) {
  let timeoutMs = progressMessagesForMessage.at(-1)?.data?.timeoutMs, {
    stdout,
    stderr,
    interrupted,
    returnCodeInterpretation,
    isImage,
    backgroundTaskId
  } = content;
  if (isImage)
    return /* @__PURE__ */ jsx_dev_runtime123.jsxDEV(MessageResponse, {
      height: 1,
      children: /* @__PURE__ */ jsx_dev_runtime123.jsxDEV(ThemedText, {
        dimColor: !0,
        children: "[Image data detected and sent to Claude]"
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this);
  return /* @__PURE__ */ jsx_dev_runtime123.jsxDEV(ThemedBox_default, {
    flexDirection: "column",
    children: [
      stdout !== "" ? /* @__PURE__ */ jsx_dev_runtime123.jsxDEV(OutputLine, {
        content: stdout,
        verbose
      }, void 0, !1, void 0, this) : null,
      stderr.trim() !== "" ? /* @__PURE__ */ jsx_dev_runtime123.jsxDEV(OutputLine, {
        content: stderr,
        verbose,
        isError: !0
      }, void 0, !1, void 0, this) : null,
      stdout === "" && stderr.trim() === "" ? /* @__PURE__ */ jsx_dev_runtime123.jsxDEV(MessageResponse, {
        height: 1,
        children: /* @__PURE__ */ jsx_dev_runtime123.jsxDEV(ThemedText, {
          dimColor: !0,
          children: backgroundTaskId ? /* @__PURE__ */ jsx_dev_runtime123.jsxDEV(jsx_dev_runtime123.Fragment, {
            children: [
              "Running in the background",
              " ",
              /* @__PURE__ */ jsx_dev_runtime123.jsxDEV(KeyboardShortcutHint, {
                shortcut: "\u2193",
                action: "manage",
                parens: !0
              }, void 0, !1, void 0, this)
            ]
          }, void 0, !0, void 0, this) : interrupted ? "Interrupted" : returnCodeInterpretation || "(No output)"
        }, void 0, !1, void 0, this)
      }, void 0, !1, void 0, this) : null,
      timeoutMs ? /* @__PURE__ */ jsx_dev_runtime123.jsxDEV(MessageResponse, {
        children: /* @__PURE__ */ jsx_dev_runtime123.jsxDEV(ShellTimeDisplay, {
          timeoutMs
        }, void 0, !1, void 0, this)
      }, void 0, !1, void 0, this) : null
    ]
  }, void 0, !0, void 0, this);
}
function renderToolUseErrorMessage4(result, {
  verbose,
  progressMessagesForMessage: _progressMessagesForMessage,
  tools: _tools
}) {
  return /* @__PURE__ */ jsx_dev_runtime123.jsxDEV(FallbackToolUseErrorMessage, {
    result,
    verbose
  }, void 0, !1, void 0, this);
}
var jsx_dev_runtime123, MAX_COMMAND_DISPLAY_LINES2 = 2, MAX_COMMAND_DISPLAY_CHARS2 = 160;
var init_UI7 = __esm(() => {
  init_KeyboardShortcutHint();
  init_FallbackToolUseErrorMessage();
  init_MessageResponse();
  init_OutputLine();
  init_ShellProgressMessage();
  init_ShellTimeDisplay();
  init_ink2();
  jsx_dev_runtime123 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
