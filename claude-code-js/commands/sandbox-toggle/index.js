// Original: src/commands/sandbox-toggle/index.ts
var command17, sandbox_toggle_default;
var init_sandbox_toggle2 = __esm(() => {
  init_figures();
  init_sandbox_adapter();
  command17 = {
    name: "sandbox",
    get description() {
      let currentlyEnabled = SandboxManager2.isSandboxingEnabled(), autoAllow = SandboxManager2.isAutoAllowBashIfSandboxedEnabled(), allowUnsandboxed = SandboxManager2.areUnsandboxedCommandsAllowed(), isLocked = SandboxManager2.areSandboxSettingsLockedByPolicy(), hasDeps = SandboxManager2.checkDependencies().errors.length === 0, icon;
      if (!hasDeps)
        icon = figures_default.warning;
      else
        icon = currentlyEnabled ? figures_default.tick : figures_default.circle;
      let statusText = "sandbox disabled";
      if (currentlyEnabled)
        statusText = autoAllow ? "sandbox enabled (auto-allow)" : "sandbox enabled", statusText += allowUnsandboxed ? ", fallback allowed" : "";
      if (isLocked)
        statusText += " (managed)";
      return `${icon} ${statusText} (\u23CE to configure)`;
    },
    argumentHint: 'exclude "command pattern"',
    get isHidden() {
      return !SandboxManager2.isSupportedPlatform() || !SandboxManager2.isPlatformInEnabledList();
    },
    immediate: !0,
    type: "local-jsx",
    load: () => Promise.resolve().then(() => (init_sandbox_toggle(), exports_sandbox_toggle))
  }, sandbox_toggle_default = command17;
});
