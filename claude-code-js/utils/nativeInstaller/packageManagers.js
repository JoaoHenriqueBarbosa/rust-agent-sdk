// Original: src/utils/nativeInstaller/packageManagers.ts
import { readFile as readFile17 } from "fs/promises";
function isDistroFamily(osRelease2, families) {
  return families.includes(osRelease2.id) || osRelease2.idLike.some((like) => families.includes(like));
}
function detectMise() {
  let execPath2 = process.execPath || process.argv[0] || "";
  if (/[/\\]mise[/\\]installs[/\\]/i.test(execPath2))
    return logForDebugging(`Detected mise installation: ${execPath2}`), !0;
  return !1;
}
function detectAsdf() {
  let execPath2 = process.execPath || process.argv[0] || "";
  if (/[/\\]\.?asdf[/\\]installs[/\\]/i.test(execPath2))
    return logForDebugging(`Detected asdf installation: ${execPath2}`), !0;
  return !1;
}
function detectHomebrew() {
  let platform5 = getPlatform();
  if (platform5 !== "macos" && platform5 !== "linux" && platform5 !== "wsl")
    return !1;
  let execPath2 = process.execPath || process.argv[0] || "";
  if (execPath2.includes("/Caskroom/"))
    return logForDebugging(`Detected Homebrew cask installation: ${execPath2}`), !0;
  return !1;
}
function detectWinget() {
  if (getPlatform() !== "windows")
    return !1;
  let execPath2 = process.execPath || process.argv[0] || "", wingetPatterns = [
    /Microsoft[/\\]WinGet[/\\]Packages/i,
    /Microsoft[/\\]WinGet[/\\]Links/i
  ];
  for (let pattern of wingetPatterns)
    if (pattern.test(execPath2))
      return logForDebugging(`Detected winget installation: ${execPath2}`), !0;
  return !1;
}
var getOsRelease, detectPacman, detectDeb, detectRpm, detectApk, getPackageManager;
var init_packageManagers = __esm(() => {
  init_memoize();
  init_debug();
  init_execFileNoThrow();
  init_platform();
  getOsRelease = memoize_default(async () => {
    try {
      let content = await readFile17("/etc/os-release", "utf8"), idMatch = content.match(/^ID=["']?(\S+?)["']?\s*$/m), idLikeMatch = content.match(/^ID_LIKE=["']?(.+?)["']?\s*$/m);
      return {
        id: idMatch?.[1] ?? "",
        idLike: idLikeMatch?.[1]?.split(" ") ?? []
      };
    } catch {
      return null;
    }
  });
  detectPacman = memoize_default(async () => {
    if (getPlatform() !== "linux")
      return !1;
    let osRelease2 = await getOsRelease();
    if (osRelease2 && !isDistroFamily(osRelease2, ["arch"]))
      return !1;
    let execPath2 = process.execPath || process.argv[0] || "", result = await execFileNoThrow("pacman", ["-Qo", execPath2], {
      timeout: 5000,
      useCwd: !1
    });
    if (result.code === 0 && result.stdout)
      return logForDebugging(`Detected pacman installation: ${result.stdout.trim()}`), !0;
    return !1;
  }), detectDeb = memoize_default(async () => {
    if (getPlatform() !== "linux")
      return !1;
    let osRelease2 = await getOsRelease();
    if (osRelease2 && !isDistroFamily(osRelease2, ["debian"]))
      return !1;
    let execPath2 = process.execPath || process.argv[0] || "", result = await execFileNoThrow("dpkg", ["-S", execPath2], {
      timeout: 5000,
      useCwd: !1
    });
    if (result.code === 0 && result.stdout)
      return logForDebugging(`Detected deb installation: ${result.stdout.trim()}`), !0;
    return !1;
  }), detectRpm = memoize_default(async () => {
    if (getPlatform() !== "linux")
      return !1;
    let osRelease2 = await getOsRelease();
    if (osRelease2 && !isDistroFamily(osRelease2, ["fedora", "rhel", "suse"]))
      return !1;
    let execPath2 = process.execPath || process.argv[0] || "", result = await execFileNoThrow("rpm", ["-qf", execPath2], {
      timeout: 5000,
      useCwd: !1
    });
    if (result.code === 0 && result.stdout)
      return logForDebugging(`Detected rpm installation: ${result.stdout.trim()}`), !0;
    return !1;
  }), detectApk = memoize_default(async () => {
    if (getPlatform() !== "linux")
      return !1;
    let osRelease2 = await getOsRelease();
    if (osRelease2 && !isDistroFamily(osRelease2, ["alpine"]))
      return !1;
    let execPath2 = process.execPath || process.argv[0] || "", result = await execFileNoThrow("apk", ["info", "--who-owns", execPath2], {
      timeout: 5000,
      useCwd: !1
    });
    if (result.code === 0 && result.stdout)
      return logForDebugging(`Detected apk installation: ${result.stdout.trim()}`), !0;
    return !1;
  }), getPackageManager = memoize_default(async () => {
    if (detectHomebrew())
      return "homebrew";
    if (detectWinget())
      return "winget";
    if (detectMise())
      return "mise";
    if (detectAsdf())
      return "asdf";
    if (await detectPacman())
      return "pacman";
    if (await detectApk())
      return "apk";
    if (await detectDeb())
      return "deb";
    if (await detectRpm())
      return "rpm";
    return "unknown";
  });
});
