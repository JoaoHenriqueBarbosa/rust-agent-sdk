// Original: src/utils/settings/mdm/constants.ts
import { userInfo } from "os";
function getMacOSPlistPaths() {
  let username = "";
  try {
    username = userInfo().username;
  } catch {}
  let paths2 = [];
  if (username)
    paths2.push({
      path: `/Library/Managed Preferences/${username}/${MACOS_PREFERENCE_DOMAIN}.plist`,
      label: "per-user managed preferences"
    });
  return paths2.push({
    path: `/Library/Managed Preferences/${MACOS_PREFERENCE_DOMAIN}.plist`,
    label: "device-level managed preferences"
  }), paths2;
}
var MACOS_PREFERENCE_DOMAIN = "com.anthropic.claudecode", WINDOWS_REGISTRY_KEY_PATH_HKLM = "HKLM\\SOFTWARE\\Policies\\ClaudeCode", WINDOWS_REGISTRY_KEY_PATH_HKCU = "HKCU\\SOFTWARE\\Policies\\ClaudeCode", WINDOWS_REGISTRY_VALUE_NAME = "Settings", PLUTIL_PATH = "/usr/bin/plutil", PLUTIL_ARGS_PREFIX, MDM_SUBPROCESS_TIMEOUT_MS = 5000;
var init_constants4 = __esm(() => {
  PLUTIL_ARGS_PREFIX = ["-convert", "json", "-o", "-", "--"];
});
