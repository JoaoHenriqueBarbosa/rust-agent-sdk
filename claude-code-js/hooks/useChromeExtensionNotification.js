// Original: src/hooks/useChromeExtensionNotification.tsx
function getChromeFlag() {
  if (process.argv.includes("--chrome"))
    return !0;
  if (process.argv.includes("--no-chrome"))
    return !1;
  return;
}
function useChromeExtensionNotification() {
  useStartupNotification(_temp205);
}
async function _temp205() {
  let chromeFlag = getChromeFlag();
  if (!shouldEnableClaudeInChrome(chromeFlag))
    return null;
  if (!isClaudeAISubscriber())
    return {
      key: "chrome-requires-subscription",
      jsx: /* @__PURE__ */ jsx_dev_runtime440.jsxDEV(ThemedText, {
        color: "error",
        children: "Claude in Chrome requires a claude.ai subscription"
      }, void 0, !1, void 0, this),
      priority: "immediate",
      timeoutMs: 5000
    };
  if (!await isChromeExtensionInstalled() && !isRunningOnHomespace())
    return {
      key: "chrome-extension-not-detected",
      jsx: /* @__PURE__ */ jsx_dev_runtime440.jsxDEV(ThemedText, {
        color: "warning",
        children: "Chrome extension not detected \xB7 https://claude.ai/chrome to install"
      }, void 0, !1, void 0, this),
      priority: "immediate",
      timeoutMs: 3000
    };
  if (chromeFlag === void 0)
    return {
      key: "claude-in-chrome-default-enabled",
      text: "Claude in Chrome enabled \xB7 /chrome",
      priority: "low"
    };
  return null;
}
var jsx_dev_runtime440;
var init_useChromeExtensionNotification = __esm(() => {
  init_ink2();
  init_auth14();
  init_setup2();
  init_envUtils();
  init_useStartupNotification();
  jsx_dev_runtime440 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
