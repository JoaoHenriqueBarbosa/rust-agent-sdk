// Original: src/utils/settings/managedPath.ts
import { join as join14 } from "path";
var getManagedFilePath, getManagedSettingsDropInDir;
var init_managedPath = __esm(() => {
  init_memoize();
  init_platform();
  getManagedFilePath = memoize_default(function() {
    switch (getPlatform()) {
      case "macos":
        return "/Library/Application Support/ClaudeCode";
      case "windows":
        return "C:\\Program Files\\ClaudeCode";
      default:
        return "/etc/claude-code";
    }
  }), getManagedSettingsDropInDir = memoize_default(function() {
    return join14(getManagedFilePath(), "managed-settings.d");
  });
});
