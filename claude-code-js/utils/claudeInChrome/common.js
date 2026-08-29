// Original: src/utils/claudeInChrome/common.ts
import { readdirSync as readdirSync5 } from "fs";
import { stat as stat16 } from "fs/promises";
import { homedir as homedir19, platform as platform3, tmpdir as tmpdir5, userInfo as userInfo3 } from "os";
import { join as join49 } from "path";
function getAllBrowserDataPaths() {
  let platform4 = getPlatform(), home = homedir19(), paths2 = [];
  for (let browserId of BROWSER_DETECTION_ORDER) {
    let config10 = CHROMIUM_BROWSERS[browserId], dataPath;
    switch (platform4) {
      case "macos":
        dataPath = config10.macos.dataPath;
        break;
      case "linux":
      case "wsl":
        dataPath = config10.linux.dataPath;
        break;
      case "windows": {
        if (config10.windows.dataPath.length > 0) {
          let appDataBase = config10.windows.useRoaming ? join49(home, "AppData", "Roaming") : join49(home, "AppData", "Local");
          paths2.push({
            browser: browserId,
            path: join49(appDataBase, ...config10.windows.dataPath)
          });
        }
        continue;
      }
    }
    if (dataPath && dataPath.length > 0)
      paths2.push({
        browser: browserId,
        path: join49(home, ...dataPath)
      });
  }
  return paths2;
}
function getAllNativeMessagingHostsDirs() {
  let platform4 = getPlatform(), home = homedir19(), paths2 = [];
  for (let browserId of BROWSER_DETECTION_ORDER) {
    let config10 = CHROMIUM_BROWSERS[browserId];
    switch (platform4) {
      case "macos":
        if (config10.macos.nativeMessagingPath.length > 0)
          paths2.push({
            browser: browserId,
            path: join49(home, ...config10.macos.nativeMessagingPath)
          });
        break;
      case "linux":
      case "wsl":
        if (config10.linux.nativeMessagingPath.length > 0)
          paths2.push({
            browser: browserId,
            path: join49(home, ...config10.linux.nativeMessagingPath)
          });
        break;
      case "windows":
        break;
    }
  }
  return paths2;
}
function getAllWindowsRegistryKeys() {
  let keys2 = [];
  for (let browserId of BROWSER_DETECTION_ORDER) {
    let config10 = CHROMIUM_BROWSERS[browserId];
    if (config10.windows.registryKey)
      keys2.push({
        browser: browserId,
        key: config10.windows.registryKey
      });
  }
  return keys2;
}
async function detectAvailableBrowser() {
  let platform4 = getPlatform();
  for (let browserId of BROWSER_DETECTION_ORDER) {
    let config10 = CHROMIUM_BROWSERS[browserId];
    switch (platform4) {
      case "macos": {
        let appPath = `/Applications/${config10.macos.appName}.app`;
        try {
          if ((await stat16(appPath)).isDirectory())
            return logForDebugging(`[Claude in Chrome] Detected browser: ${config10.name}`), browserId;
        } catch (e) {
          if (!isFsInaccessible(e))
            throw e;
        }
        break;
      }
      case "wsl":
      case "linux": {
        for (let binary of config10.linux.binaries)
          if (await which(binary).catch(() => null))
            return logForDebugging(`[Claude in Chrome] Detected browser: ${config10.name}`), browserId;
        break;
      }
      case "windows": {
        let home = homedir19();
        if (config10.windows.dataPath.length > 0) {
          let appDataBase = config10.windows.useRoaming ? join49(home, "AppData", "Roaming") : join49(home, "AppData", "Local"), dataPath = join49(appDataBase, ...config10.windows.dataPath);
          try {
            if ((await stat16(dataPath)).isDirectory())
              return logForDebugging(`[Claude in Chrome] Detected browser: ${config10.name}`), browserId;
          } catch (e) {
            if (!isFsInaccessible(e))
              throw e;
          }
        }
        break;
      }
    }
  }
  return null;
}
function isClaudeInChromeMCPServer(name3) {
  return normalizeNameForMCP(name3) === CLAUDE_IN_CHROME_MCP_SERVER_NAME;
}
function trackClaudeInChromeTabId(tabId) {
  if (trackedTabIds.size >= MAX_TRACKED_TABS && !trackedTabIds.has(tabId))
    trackedTabIds.clear();
  trackedTabIds.add(tabId);
}
async function openInChrome(url3) {
  let currentPlatform = getPlatform(), browser = await detectAvailableBrowser();
  if (!browser)
    return logForDebugging("[Claude in Chrome] No compatible browser found"), !1;
  let config10 = CHROMIUM_BROWSERS[browser];
  switch (currentPlatform) {
    case "macos": {
      let { code } = await execFileNoThrow("open", [
        "-a",
        config10.macos.appName,
        url3
      ]);
      return code === 0;
    }
    case "windows": {
      let { code } = await execFileNoThrow("rundll32", ["url,OpenURL", url3]);
      return code === 0;
    }
    case "wsl":
    case "linux": {
      for (let binary of config10.linux.binaries) {
        let { code } = await execFileNoThrow(binary, [url3]);
        if (code === 0)
          return !0;
      }
      return !1;
    }
    default:
      return !1;
  }
}
function getSocketDir() {
  return `/tmp/claude-mcp-browser-bridge-${getUsername2()}`;
}
function getSecureSocketPath() {
  if (platform3() === "win32")
    return `\\\\.\\pipe\\${getSocketName()}`;
  return join49(getSocketDir(), `${process.pid}.sock`);
}
function getAllSocketPaths() {
  if (platform3() === "win32")
    return [`\\\\.\\pipe\\${getSocketName()}`];
  let paths2 = [], socketDir = getSocketDir();
  try {
    let files2 = readdirSync5(socketDir);
    for (let file2 of files2)
      if (file2.endsWith(".sock"))
        paths2.push(join49(socketDir, file2));
  } catch {}
  let legacyName = `claude-mcp-browser-bridge-${getUsername2()}`, legacyTmpdir = join49(tmpdir5(), legacyName), legacyTmp = `/tmp/${legacyName}`;
  if (!paths2.includes(legacyTmpdir))
    paths2.push(legacyTmpdir);
  if (legacyTmpdir !== legacyTmp && !paths2.includes(legacyTmp))
    paths2.push(legacyTmp);
  return paths2;
}
function getSocketName() {
  return `claude-mcp-browser-bridge-${getUsername2()}`;
}
function getUsername2() {
  try {
    return userInfo3().username || "default";
  } catch {
    return process.env.USER || process.env.USERNAME || "default";
  }
}
var CLAUDE_IN_CHROME_MCP_SERVER_NAME = "claude-in-chrome", CHROMIUM_BROWSERS, BROWSER_DETECTION_ORDER, MAX_TRACKED_TABS = 200, trackedTabIds;
var init_common3 = __esm(() => {
  init_debug();
  init_errors();
  init_execFileNoThrow();
  init_platform();
  init_which();
  CHROMIUM_BROWSERS = {
    chrome: {
      name: "Google Chrome",
      macos: {
        appName: "Google Chrome",
        dataPath: ["Library", "Application Support", "Google", "Chrome"],
        nativeMessagingPath: [
          "Library",
          "Application Support",
          "Google",
          "Chrome",
          "NativeMessagingHosts"
        ]
      },
      linux: {
        binaries: ["google-chrome", "google-chrome-stable"],
        dataPath: [".config", "google-chrome"],
        nativeMessagingPath: [".config", "google-chrome", "NativeMessagingHosts"]
      },
      windows: {
        dataPath: ["Google", "Chrome", "User Data"],
        registryKey: "HKCU\\Software\\Google\\Chrome\\NativeMessagingHosts"
      }
    },
    brave: {
      name: "Brave",
      macos: {
        appName: "Brave Browser",
        dataPath: [
          "Library",
          "Application Support",
          "BraveSoftware",
          "Brave-Browser"
        ],
        nativeMessagingPath: [
          "Library",
          "Application Support",
          "BraveSoftware",
          "Brave-Browser",
          "NativeMessagingHosts"
        ]
      },
      linux: {
        binaries: ["brave-browser", "brave"],
        dataPath: [".config", "BraveSoftware", "Brave-Browser"],
        nativeMessagingPath: [
          ".config",
          "BraveSoftware",
          "Brave-Browser",
          "NativeMessagingHosts"
        ]
      },
      windows: {
        dataPath: ["BraveSoftware", "Brave-Browser", "User Data"],
        registryKey: "HKCU\\Software\\BraveSoftware\\Brave-Browser\\NativeMessagingHosts"
      }
    },
    arc: {
      name: "Arc",
      macos: {
        appName: "Arc",
        dataPath: ["Library", "Application Support", "Arc", "User Data"],
        nativeMessagingPath: [
          "Library",
          "Application Support",
          "Arc",
          "User Data",
          "NativeMessagingHosts"
        ]
      },
      linux: {
        binaries: [],
        dataPath: [],
        nativeMessagingPath: []
      },
      windows: {
        dataPath: ["Arc", "User Data"],
        registryKey: "HKCU\\Software\\ArcBrowser\\Arc\\NativeMessagingHosts"
      }
    },
    chromium: {
      name: "Chromium",
      macos: {
        appName: "Chromium",
        dataPath: ["Library", "Application Support", "Chromium"],
        nativeMessagingPath: [
          "Library",
          "Application Support",
          "Chromium",
          "NativeMessagingHosts"
        ]
      },
      linux: {
        binaries: ["chromium", "chromium-browser"],
        dataPath: [".config", "chromium"],
        nativeMessagingPath: [".config", "chromium", "NativeMessagingHosts"]
      },
      windows: {
        dataPath: ["Chromium", "User Data"],
        registryKey: "HKCU\\Software\\Chromium\\NativeMessagingHosts"
      }
    },
    edge: {
      name: "Microsoft Edge",
      macos: {
        appName: "Microsoft Edge",
        dataPath: ["Library", "Application Support", "Microsoft Edge"],
        nativeMessagingPath: [
          "Library",
          "Application Support",
          "Microsoft Edge",
          "NativeMessagingHosts"
        ]
      },
      linux: {
        binaries: ["microsoft-edge", "microsoft-edge-stable"],
        dataPath: [".config", "microsoft-edge"],
        nativeMessagingPath: [
          ".config",
          "microsoft-edge",
          "NativeMessagingHosts"
        ]
      },
      windows: {
        dataPath: ["Microsoft", "Edge", "User Data"],
        registryKey: "HKCU\\Software\\Microsoft\\Edge\\NativeMessagingHosts"
      }
    },
    vivaldi: {
      name: "Vivaldi",
      macos: {
        appName: "Vivaldi",
        dataPath: ["Library", "Application Support", "Vivaldi"],
        nativeMessagingPath: [
          "Library",
          "Application Support",
          "Vivaldi",
          "NativeMessagingHosts"
        ]
      },
      linux: {
        binaries: ["vivaldi", "vivaldi-stable"],
        dataPath: [".config", "vivaldi"],
        nativeMessagingPath: [".config", "vivaldi", "NativeMessagingHosts"]
      },
      windows: {
        dataPath: ["Vivaldi", "User Data"],
        registryKey: "HKCU\\Software\\Vivaldi\\NativeMessagingHosts"
      }
    },
    opera: {
      name: "Opera",
      macos: {
        appName: "Opera",
        dataPath: ["Library", "Application Support", "com.operasoftware.Opera"],
        nativeMessagingPath: [
          "Library",
          "Application Support",
          "com.operasoftware.Opera",
          "NativeMessagingHosts"
        ]
      },
      linux: {
        binaries: ["opera"],
        dataPath: [".config", "opera"],
        nativeMessagingPath: [".config", "opera", "NativeMessagingHosts"]
      },
      windows: {
        dataPath: ["Opera Software", "Opera Stable"],
        registryKey: "HKCU\\Software\\Opera Software\\Opera Stable\\NativeMessagingHosts",
        useRoaming: !0
      }
    }
  }, BROWSER_DETECTION_ORDER = [
    "chrome",
    "brave",
    "arc",
    "edge",
    "chromium",
    "vivaldi",
    "opera"
  ];
  trackedTabIds = /* @__PURE__ */ new Set;
});
