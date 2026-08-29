// Original: src/commands/sandbox-toggle/sandbox-toggle.tsx
var exports_sandbox_toggle = {};
__export(exports_sandbox_toggle, {
  call: () => call54
});
import { relative as relative27 } from "path";
async function call54(onDone, _context, args) {
  let themeName = getSettings_DEPRECATED().theme || "light", platform6 = getPlatform();
  if (!SandboxManager2.isSupportedPlatform()) {
    let errorMessage3 = platform6 === "wsl" ? "Error: Sandboxing requires WSL2. WSL1 is not supported." : "Error: Sandboxing is currently only supported on macOS, Linux, and WSL2.", message = color("error", themeName)(errorMessage3);
    return onDone(message), null;
  }
  let depCheck = SandboxManager2.checkDependencies();
  if (!SandboxManager2.isPlatformInEnabledList()) {
    let message = color("error", themeName)(`Error: Sandboxing is disabled for this platform (${platform6}) via the enabledPlatforms setting.`);
    return onDone(message), null;
  }
  if (SandboxManager2.areSandboxSettingsLockedByPolicy()) {
    let message = color("error", themeName)("Error: Sandbox settings are overridden by a higher-priority configuration and cannot be changed locally.");
    return onDone(message), null;
  }
  let trimmedArgs = args?.trim() || "";
  if (!trimmedArgs)
    return /* @__PURE__ */ jsx_dev_runtime344.jsxDEV(SandboxSettings, {
      onComplete: onDone,
      depCheck
    }, void 0, !1, void 0, this);
  if (trimmedArgs) {
    let subcommand = trimmedArgs.split(" ")[0];
    if (subcommand === "exclude") {
      let commandPattern = trimmedArgs.slice(8).trim();
      if (!commandPattern) {
        let message2 = color("error", themeName)('Error: Please provide a command pattern to exclude (e.g., /sandbox exclude "npm run test:*")');
        return onDone(message2), null;
      }
      let cleanPattern = commandPattern.replace(/^["']|["']$/g, "");
      addToExcludedCommands(cleanPattern);
      let localSettingsPath = getSettingsFilePathForSource("localSettings"), relativePath = localSettingsPath ? relative27(getCwdState(), localSettingsPath) : ".claude/settings.local.json", message = color("success", themeName)(`Added "${cleanPattern}" to excluded commands in ${relativePath}`);
      return onDone(message), null;
    } else {
      let message = color("error", themeName)(`Error: Unknown subcommand "${subcommand}". Available subcommand: exclude`);
      return onDone(message), null;
    }
  }
  return null;
}
var jsx_dev_runtime344;
var init_sandbox_toggle = __esm(() => {
  init_state();
  init_SandboxSettings();
  init_ink2();
  init_platform();
  init_sandbox_adapter();
  init_settings2();
  jsx_dev_runtime344 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
