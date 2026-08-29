// Original: src/utils/shell/powershellDetection.ts
import { realpath as realpath7, stat as stat23 } from "fs/promises";
async function probePath(p4) {
  try {
    return (await stat23(p4)).isFile() ? p4 : null;
  } catch {
    return null;
  }
}
async function findPowerShell() {
  let pwshPath = await which("pwsh");
  if (pwshPath) {
    if (getPlatform() === "linux") {
      let resolved = await realpath7(pwshPath).catch(() => pwshPath);
      if (pwshPath.startsWith("/snap/") || resolved.startsWith("/snap/")) {
        let direct = await probePath("/opt/microsoft/powershell/7/pwsh") ?? await probePath("/usr/bin/pwsh");
        if (direct) {
          let directResolved = await realpath7(direct).catch(() => direct);
          if (!direct.startsWith("/snap/") && !directResolved.startsWith("/snap/"))
            return direct;
        }
      }
    }
    return pwshPath;
  }
  let powershellPath = await which("powershell");
  if (powershellPath)
    return powershellPath;
  return null;
}
function getCachedPowerShellPath() {
  if (!cachedPowerShellPath)
    cachedPowerShellPath = findPowerShell();
  return cachedPowerShellPath;
}
async function getPowerShellEdition() {
  let p4 = await getCachedPowerShellPath();
  if (!p4)
    return null;
  return p4.split(/[/\\]/).pop().toLowerCase().replace(/\.exe$/, "") === "pwsh" ? "core" : "desktop";
}
var cachedPowerShellPath = null;
var init_powershellDetection = __esm(() => {
  init_platform();
  init_which();
});
