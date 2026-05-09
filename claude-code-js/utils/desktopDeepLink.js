// Original: src/utils/desktopDeepLink.ts
import { readdir as readdir20 } from "fs/promises";
import { join as join111 } from "path";
function isDevMode() {
  return !0;
}
function buildDesktopDeepLink(sessionId) {
  let protocol = isDevMode() ? "claude-dev" : "claude", url3 = new URL(`${protocol}://resume`);
  return url3.searchParams.set("session", sessionId), url3.searchParams.set("cwd", getCwd()), url3.toString();
}
async function isDesktopInstalled() {
  if (isDevMode())
    return !0;
  let platform6 = process.platform;
  if (platform6 === "darwin")
    return pathExists("/Applications/Claude.app");
  else if (platform6 === "linux") {
    let { code, stdout } = await execFileNoThrow("xdg-mime", [
      "query",
      "default",
      "x-scheme-handler/claude"
    ]);
    return code === 0 && stdout.trim().length > 0;
  } else if (platform6 === "win32") {
    let { code } = await execFileNoThrow("reg", [
      "query",
      "HKEY_CLASSES_ROOT\\claude",
      "/ve"
    ]);
    return code === 0;
  }
  return !1;
}
async function getDesktopVersion() {
  let platform6 = process.platform;
  if (platform6 === "darwin") {
    let { code, stdout } = await execFileNoThrow("defaults", [
      "read",
      "/Applications/Claude.app/Contents/Info.plist",
      "CFBundleShortVersionString"
    ]);
    if (code !== 0)
      return null;
    let version5 = stdout.trim();
    return version5.length > 0 ? version5 : null;
  } else if (platform6 === "win32") {
    let localAppData = process.env.LOCALAPPDATA;
    if (!localAppData)
      return null;
    let installDir = join111(localAppData, "AnthropicClaude");
    try {
      let versions2 = (await readdir20(installDir)).filter((e) => e.startsWith("app-")).map((e) => e.slice(4)).filter((v2) => import_semver7.coerce(v2) !== null).sort((a2, b) => {
        let ca2 = import_semver7.coerce(a2), cb = import_semver7.coerce(b);
        return ca2.compare(cb);
      });
      return versions2.length > 0 ? versions2[versions2.length - 1] : null;
    } catch {
      return null;
    }
  }
  return null;
}
async function getDesktopInstallStatus() {
  if (!await isDesktopInstalled())
    return { status: "not-installed" };
  let version5;
  try {
    version5 = await getDesktopVersion();
  } catch {
    return { status: "ready", version: "unknown" };
  }
  if (!version5)
    return { status: "ready", version: "unknown" };
  let coerced = import_semver7.coerce(version5);
  if (!coerced || !gte(coerced.version, MIN_DESKTOP_VERSION))
    return { status: "version-too-old", version: version5 };
  return { status: "ready", version: version5 };
}
async function openDeepLink(deepLinkUrl) {
  let platform6 = process.platform;
  if (logForDebugging(`Opening deep link: ${deepLinkUrl}`), platform6 === "darwin") {
    if (isDevMode()) {
      let { code: code2 } = await execFileNoThrow("osascript", [
        "-e",
        `tell application "Electron" to open location "${deepLinkUrl}"`
      ]);
      return code2 === 0;
    }
    let { code } = await execFileNoThrow("open", [deepLinkUrl]);
    return code === 0;
  } else if (platform6 === "linux") {
    let { code } = await execFileNoThrow("xdg-open", [deepLinkUrl]);
    return code === 0;
  } else if (platform6 === "win32") {
    let { code } = await execFileNoThrow("cmd", [
      "/c",
      "start",
      "",
      deepLinkUrl
    ]);
    return code === 0;
  }
  return !1;
}
async function openCurrentSessionInDesktop() {
  let sessionId = getSessionId();
  if (!await isDesktopInstalled())
    return {
      success: !1,
      error: "Claude Desktop is not installed. Install it from https://claude.ai/download"
    };
  let deepLinkUrl = buildDesktopDeepLink(sessionId);
  if (!await openDeepLink(deepLinkUrl))
    return {
      success: !1,
      error: "Failed to open Claude Desktop. Please try opening it manually.",
      deepLinkUrl
    };
  return { success: !0, deepLinkUrl };
}
var import_semver7, MIN_DESKTOP_VERSION = "1.1.2396";
var init_desktopDeepLink = __esm(() => {
  init_state();
  init_cwd2();
  init_debug();
  init_execFileNoThrow();
  init_file();
  import_semver7 = __toESM(require_semver2(), 1);
});
