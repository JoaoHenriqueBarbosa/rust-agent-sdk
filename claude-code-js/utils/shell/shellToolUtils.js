// Original: src/utils/shell/shellToolUtils.ts
function isPowerShellToolEnabled() {
  if (getPlatform() !== "windows")
    return !1;
  return isEnvTruthy(process.env.CLAUDE_CODE_USE_POWERSHELL_TOOL);
}
var SHELL_TOOL_NAMES;
var init_shellToolUtils = __esm(() => {
  init_envUtils();
  init_platform();
  SHELL_TOOL_NAMES = [BASH_TOOL_NAME, POWERSHELL_TOOL_NAME];
});
