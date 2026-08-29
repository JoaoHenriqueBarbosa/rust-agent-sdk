// Original: src/utils/claudeInChrome/setup.ts
import { chmod as chmod9, mkdir as mkdir32, readFile as readFile47, writeFile as writeFile39 } from "fs/promises";
import { homedir as homedir33 } from "os";
import { join as join125 } from "path";
import { fileURLToPath as fileURLToPath8 } from "url";
function shouldEnableClaudeInChrome(chromeFlag) {
  if (getIsNonInteractiveSession() && chromeFlag !== !0)
    return !1;
  if (chromeFlag === !0)
    return !0;
  if (chromeFlag === !1)
    return !1;
  if (isEnvTruthy(process.env.CLAUDE_CODE_ENABLE_CFC))
    return !0;
  if (isEnvDefinedFalsy(process.env.CLAUDE_CODE_ENABLE_CFC))
    return !1;
  let config11 = getGlobalConfig();
  if (config11.claudeInChromeDefaultEnabled !== void 0)
    return config11.claudeInChromeDefaultEnabled;
  return !1;
}
function shouldAutoEnableClaudeInChrome() {
  if (shouldAutoEnable !== void 0)
    return shouldAutoEnable;
  return shouldAutoEnable = getIsInteractive() && isChromeExtensionInstalled_CACHED_MAY_BE_STALE() && !1, shouldAutoEnable;
}
function setupClaudeInChrome() {
  let isNativeBuild = isInBundledMode(), allowedTools = BROWSER_TOOLS.map((tool) => `mcp__claude-in-chrome__${tool.name}`), env5 = {};
  if (getSessionBypassPermissionsMode())
    env5.CLAUDE_CHROME_PERMISSION_MODE = "skip_all_permission_checks";
  let hasEnv = Object.keys(env5).length > 0;
  if (isNativeBuild) {
    let execCommand = `"${process.execPath}" --chrome-native-host`;
    return createWrapperScript(execCommand).then((manifestBinaryPath) => installChromeNativeHostManifest(manifestBinaryPath)).catch((e) => logForDebugging(`[Claude in Chrome] Failed to install native host: ${e}`, { level: "error" })), {
      mcpConfig: {
        [CLAUDE_IN_CHROME_MCP_SERVER_NAME]: {
          type: "stdio",
          command: process.execPath,
          args: ["--claude-in-chrome-mcp"],
          scope: "dynamic",
          ...hasEnv && { env: env5 }
        }
      },
      allowedTools,
      systemPrompt: getChromeSystemPrompt()
    };
  } else {
    let __filename3 = fileURLToPath8(import.meta.url), __dirname4 = join125(__filename3, ".."), cliPath = join125(__dirname4, "cli.js");
    return createWrapperScript(`"${process.execPath}" "${cliPath}" --chrome-native-host`).then((manifestBinaryPath) => installChromeNativeHostManifest(manifestBinaryPath)).catch((e) => logForDebugging(`[Claude in Chrome] Failed to install native host: ${e}`, { level: "error" })), {
      mcpConfig: {
        [CLAUDE_IN_CHROME_MCP_SERVER_NAME]: {
          type: "stdio",
          command: process.execPath,
          args: [`${cliPath}`, "--claude-in-chrome-mcp"],
          scope: "dynamic",
          ...hasEnv && { env: env5 }
        }
      },
      allowedTools,
      systemPrompt: getChromeSystemPrompt()
    };
  }
}
function getNativeMessagingHostsDirs() {
  if (getPlatform() === "windows") {
    let home = homedir33(), appData = process.env.APPDATA || join125(home, "AppData", "Local");
    return [join125(appData, "Claude Code", "ChromeNativeHost")];
  }
  return getAllNativeMessagingHostsDirs().map(({ path: path25 }) => path25);
}
async function installChromeNativeHostManifest(manifestBinaryPath) {
  let manifestDirs = getNativeMessagingHostsDirs();
  if (manifestDirs.length === 0)
    throw Error("Claude in Chrome Native Host not supported on this platform");
  let manifest = {
    name: NATIVE_HOST_IDENTIFIER,
    description: "Claude Code Browser Extension Native Host",
    path: manifestBinaryPath,
    type: "stdio",
    allowed_origins: [
      "chrome-extension://fcoeoabgfenejglbffodgkkbkcdhcgfn/",
      ...[]
    ]
  }, manifestContent = jsonStringify(manifest, null, 2), anyManifestUpdated = !1;
  for (let manifestDir of manifestDirs) {
    let manifestPath = join125(manifestDir, NATIVE_HOST_MANIFEST_NAME);
    if (await readFile47(manifestPath, "utf-8").catch(() => null) === manifestContent)
      continue;
    try {
      await mkdir32(manifestDir, { recursive: !0 }), await writeFile39(manifestPath, manifestContent), logForDebugging(`[Claude in Chrome] Installed native host manifest at: ${manifestPath}`), anyManifestUpdated = !0;
    } catch (error44) {
      logForDebugging(`[Claude in Chrome] Failed to install manifest at ${manifestPath}: ${error44}`);
    }
  }
  if (getPlatform() === "windows") {
    let manifestPath = join125(manifestDirs[0], NATIVE_HOST_MANIFEST_NAME);
    registerWindowsNativeHosts(manifestPath);
  }
  if (anyManifestUpdated)
    isChromeExtensionInstalled().then((isInstalled) => {
      if (isInstalled)
        logForDebugging("[Claude in Chrome] First-time install detected, opening reconnect page in browser"), openInChrome(CHROME_EXTENSION_RECONNECT_URL);
      else
        logForDebugging("[Claude in Chrome] First-time install detected, but extension not installed, skipping reconnect");
    });
}
function registerWindowsNativeHosts(manifestPath) {
  let registryKeys = getAllWindowsRegistryKeys();
  for (let { browser, key: key3 } of registryKeys) {
    let fullKey = `${key3}\\${NATIVE_HOST_IDENTIFIER}`;
    execFileNoThrowWithCwd("reg", [
      "add",
      fullKey,
      "/ve",
      "/t",
      "REG_SZ",
      "/d",
      manifestPath,
      "/f"
    ]).then((result) => {
      if (result.code === 0)
        logForDebugging(`[Claude in Chrome] Registered native host for ${browser} in Windows registry: ${fullKey}`);
      else
        logForDebugging(`[Claude in Chrome] Failed to register native host for ${browser} in Windows registry: ${result.stderr}`);
    });
  }
}
async function createWrapperScript(command18) {
  let platform6 = getPlatform(), chromeDir = join125(getClaudeConfigHomeDir(), "chrome"), wrapperPath = platform6 === "windows" ? join125(chromeDir, "chrome-native-host.bat") : join125(chromeDir, "chrome-native-host"), scriptContent = platform6 === "windows" ? `@echo off
REM Chrome native host wrapper script
REM Generated by Claude Code - do not edit manually
${command18}
` : `#!/bin/sh
# Chrome native host wrapper script
# Generated by Claude Code - do not edit manually
exec ${command18}
`;
  if (await readFile47(wrapperPath, "utf-8").catch(() => null) === scriptContent)
    return wrapperPath;
  if (await mkdir32(chromeDir, { recursive: !0 }), await writeFile39(wrapperPath, scriptContent), platform6 !== "windows")
    await chmod9(wrapperPath, 493);
  return logForDebugging(`[Claude in Chrome] Created Chrome native host wrapper script: ${wrapperPath}`), wrapperPath;
}
function isChromeExtensionInstalled_CACHED_MAY_BE_STALE() {
  return isChromeExtensionInstalled().then((isInstalled) => {
    if (!isInstalled)
      return;
    if (getGlobalConfig().cachedChromeExtensionInstalled !== isInstalled)
      saveGlobalConfig((prev) => ({
        ...prev,
        cachedChromeExtensionInstalled: isInstalled
      }));
  }), getGlobalConfig().cachedChromeExtensionInstalled ?? !1;
}
async function isChromeExtensionInstalled() {
  let browserPaths = getAllBrowserDataPaths();
  if (browserPaths.length === 0)
    return logForDebugging(`[Claude in Chrome] Unsupported platform for extension detection: ${getPlatform()}`), !1;
  return isChromeExtensionInstalledPortable(browserPaths, logForDebugging);
}
var CHROME_EXTENSION_RECONNECT_URL = "https://clau.de/chrome/reconnect", NATIVE_HOST_IDENTIFIER = "com.anthropic.claude_code_browser_extension", NATIVE_HOST_MANIFEST_NAME, shouldAutoEnable = void 0;
var init_setup2 = __esm(() => {
  init_claude_for_chrome_mcp();
  init_state();
  init_config4();
  init_debug();
  init_envUtils();
  init_execFileNoThrow();
  init_platform();
  init_slowOperations();
  init_common3();
  init_setupPortable();
  NATIVE_HOST_MANIFEST_NAME = `${NATIVE_HOST_IDENTIFIER}.json`;
});
