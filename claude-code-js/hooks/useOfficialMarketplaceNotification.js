// Original: src/hooks/useOfficialMarketplaceNotification.tsx
function useOfficialMarketplaceNotification() {
  useStartupNotification(_temp206);
}
async function _temp206() {
  let result = await checkAndInstallOfficialMarketplace(), notifs = [];
  if (result.configSaveFailed)
    logForDebugging("Showing marketplace config save failure notification"), notifs.push({
      key: "marketplace-config-save-failed",
      jsx: /* @__PURE__ */ jsx_dev_runtime441.jsxDEV(ThemedText, {
        color: "error",
        children: "Failed to save marketplace retry info \xB7 Check ~/.claude.json permissions"
      }, void 0, !1, void 0, this),
      priority: "immediate",
      timeoutMs: 1e4
    });
  if (result.installed)
    logForDebugging("Showing marketplace installation success notification"), notifs.push({
      key: "marketplace-installed",
      jsx: /* @__PURE__ */ jsx_dev_runtime441.jsxDEV(ThemedText, {
        color: "success",
        children: "\u2713 Anthropic marketplace installed \xB7 /plugin to see available plugins"
      }, void 0, !1, void 0, this),
      priority: "immediate",
      timeoutMs: 7000
    });
  else if (result.skipped && result.reason === "unknown")
    logForDebugging("Showing marketplace installation failure notification"), notifs.push({
      key: "marketplace-install-failed",
      jsx: /* @__PURE__ */ jsx_dev_runtime441.jsxDEV(ThemedText, {
        color: "warning",
        children: "Failed to install Anthropic marketplace \xB7 Will retry on next startup"
      }, void 0, !1, void 0, this),
      priority: "immediate",
      timeoutMs: 8000
    });
  return notifs;
}
var jsx_dev_runtime441;
var init_useOfficialMarketplaceNotification = __esm(() => {
  init_ink2();
  init_debug();
  init_officialMarketplaceStartupCheck();
  init_useStartupNotification();
  jsx_dev_runtime441 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
