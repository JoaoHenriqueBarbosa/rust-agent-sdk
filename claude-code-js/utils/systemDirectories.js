// Original: src/utils/systemDirectories.ts
import { homedir as homedir17 } from "os";
import { join as join41 } from "path";
function getSystemDirectories(options) {
  let platform3 = options?.platform ?? getPlatform(), homeDir = options?.homedir ?? homedir17(), env5 = options?.env ?? process.env, defaults2 = {
    HOME: homeDir,
    DESKTOP: join41(homeDir, "Desktop"),
    DOCUMENTS: join41(homeDir, "Documents"),
    DOWNLOADS: join41(homeDir, "Downloads")
  };
  switch (platform3) {
    case "windows": {
      let userProfile = env5.USERPROFILE || homeDir;
      return {
        HOME: homeDir,
        DESKTOP: join41(userProfile, "Desktop"),
        DOCUMENTS: join41(userProfile, "Documents"),
        DOWNLOADS: join41(userProfile, "Downloads")
      };
    }
    case "linux":
    case "wsl":
      return {
        HOME: homeDir,
        DESKTOP: env5.XDG_DESKTOP_DIR || defaults2.DESKTOP,
        DOCUMENTS: env5.XDG_DOCUMENTS_DIR || defaults2.DOCUMENTS,
        DOWNLOADS: env5.XDG_DOWNLOAD_DIR || defaults2.DOWNLOADS
      };
    case "macos":
    default: {
      if (platform3 === "unknown")
        logForDebugging("Unknown platform detected, using default paths");
      return defaults2;
    }
  }
}
var init_systemDirectories = __esm(() => {
  init_debug();
  init_platform();
});
