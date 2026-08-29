// Original: src/utils/platform.ts
import { readdir, readFile } from "fs/promises";
import { release as osRelease } from "os";
var SUPPORTED_PLATFORMS, getPlatform, getWslVersion, getLinuxDistroInfo;
var init_platform = __esm(() => {
  init_memoize();
  init_fsOperations();
  init_log3();
  SUPPORTED_PLATFORMS = ["macos", "wsl"], getPlatform = memoize_default(() => {
    try {
      if (process.platform === "darwin")
        return "macos";
      if (process.platform === "win32")
        return "windows";
      if (process.platform === "linux") {
        try {
          let procVersion = getFsImplementation().readFileSync("/proc/version", { encoding: "utf8" });
          if (procVersion.toLowerCase().includes("microsoft") || procVersion.toLowerCase().includes("wsl"))
            return "wsl";
        } catch (error41) {
          logError2(error41);
        }
        return "linux";
      }
      return "unknown";
    } catch (error41) {
      return logError2(error41), "unknown";
    }
  }), getWslVersion = memoize_default(() => {
    if (process.platform !== "linux")
      return;
    try {
      let procVersion = getFsImplementation().readFileSync("/proc/version", {
        encoding: "utf8"
      }), wslVersionMatch = procVersion.match(/WSL(\d+)/i);
      if (wslVersionMatch && wslVersionMatch[1])
        return wslVersionMatch[1];
      if (procVersion.toLowerCase().includes("microsoft"))
        return "1";
      return;
    } catch (error41) {
      logError2(error41);
      return;
    }
  }), getLinuxDistroInfo = memoize_default(async () => {
    if (process.platform !== "linux")
      return;
    let result = {
      linuxKernel: osRelease()
    };
    try {
      let content = await readFile("/etc/os-release", "utf8");
      for (let line of content.split(`
`)) {
        let match = line.match(/^(ID|VERSION_ID)=(.*)$/);
        if (match && match[1] && match[2]) {
          let value = match[2].replace(/^"|"$/g, "");
          if (match[1] === "ID")
            result.linuxDistroId = value;
          else
            result.linuxDistroVersion = value;
        }
      }
    } catch {}
    return result;
  });
});
