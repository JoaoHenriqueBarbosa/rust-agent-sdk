// Original: src/components/PromptInput/utils.ts
function isVimModeEnabled() {
  return getGlobalConfig().editorMode === "vim";
}
function getNewlineInstructions() {
  if (env3.terminal === "Apple_Terminal" && process.platform === "darwin")
    return "shift + \u23CE for newline";
  if (isShiftEnterKeyBindingInstalled())
    return "shift + \u23CE for newline";
  return hasUsedBackslashReturn() ? "\\\u23CE for newline" : "backslash (\\) + return (\u23CE) for newline";
}
function isNonSpacePrintable(input, key3) {
  if (key3.ctrl || key3.meta || key3.escape || key3.return || key3.tab || key3.backspace || key3.delete || key3.upArrow || key3.downArrow || key3.leftArrow || key3.rightArrow || key3.pageUp || key3.pageDown || key3.home || key3.end)
    return !1;
  return input.length > 0 && !/^\s/.test(input) && !input.startsWith("\x1B");
}
var init_utils16 = __esm(() => {
  init_terminalSetup();
  init_config4();
  init_env();
});
