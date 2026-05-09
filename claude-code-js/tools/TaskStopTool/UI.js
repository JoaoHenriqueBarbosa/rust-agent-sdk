// Original: src/tools/TaskStopTool/UI.tsx
function renderToolUseMessage15() {
  return "";
}
function truncateCommand(command12) {
  let lines2 = command12.split(`
`), truncated = command12;
  if (lines2.length > MAX_COMMAND_DISPLAY_LINES3)
    truncated = lines2.slice(0, MAX_COMMAND_DISPLAY_LINES3).join(`
`);
  if (stringWidth(truncated) > MAX_COMMAND_DISPLAY_CHARS3)
    truncated = truncateToWidthNoEllipsis(truncated, MAX_COMMAND_DISPLAY_CHARS3);
  return truncated.trim();
}
function renderToolResultMessage14(output, _progressMessagesForMessage, {
  verbose
}) {
  let rawCommand = output.command ?? "", command12 = verbose ? rawCommand : truncateCommand(rawCommand);
  return /* @__PURE__ */ jsx_dev_runtime139.jsxDEV(MessageResponse, {
    children: /* @__PURE__ */ jsx_dev_runtime139.jsxDEV(ThemedText, {
      children: [
        command12,
        command12 !== rawCommand ? "\u2026 \xB7 stopped" : " \xB7 stopped"
      ]
    }, void 0, !0, void 0, this)
  }, void 0, !1, void 0, this);
}
var jsx_dev_runtime139, MAX_COMMAND_DISPLAY_LINES3 = 2, MAX_COMMAND_DISPLAY_CHARS3 = 160;
var init_UI14 = __esm(() => {
  init_MessageResponse();
  init_stringWidth();
  init_ink2();
  init_format();
  jsx_dev_runtime139 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
