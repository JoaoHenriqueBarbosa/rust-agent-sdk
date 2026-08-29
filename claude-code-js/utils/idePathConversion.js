// Original: src/utils/idePathConversion.ts
import { execFileSync as execFileSync2 } from "child_process";

class WindowsToWSLConverter {
  wslDistroName;
  constructor(wslDistroName) {
    this.wslDistroName = wslDistroName;
  }
  toLocalPath(windowsPath) {
    if (!windowsPath)
      return windowsPath;
    if (this.wslDistroName) {
      let wslUncMatch = windowsPath.match(/^\\\\wsl(?:\.localhost|\$)\\([^\\]+)(.*)$/);
      if (wslUncMatch && wslUncMatch[1] !== this.wslDistroName)
        return windowsPath;
    }
    try {
      return execFileSync2("wslpath", ["-u", windowsPath], {
        encoding: "utf8",
        stdio: ["pipe", "pipe", "ignore"]
      }).trim();
    } catch {
      return windowsPath.replace(/\\/g, "/").replace(/^([A-Z]):/i, (_, letter) => `/mnt/${letter.toLowerCase()}`);
    }
  }
  toIDEPath(wslPath) {
    if (!wslPath)
      return wslPath;
    try {
      return execFileSync2("wslpath", ["-w", wslPath], {
        encoding: "utf8",
        stdio: ["pipe", "pipe", "ignore"]
      }).trim();
    } catch {
      return wslPath;
    }
  }
}
function checkWSLDistroMatch(windowsPath, wslDistroName) {
  let wslUncMatch = windowsPath.match(/^\\\\wsl(?:\.localhost|\$)\\([^\\]+)(.*)$/);
  if (wslUncMatch)
    return wslUncMatch[1] === wslDistroName;
  return !0;
}
var init_idePathConversion = () => {};
