// Original: src/commands/terminalSetup/terminalSetup.tsx
var exports_terminalSetup = {};
__export(exports_terminalSetup, {
  shouldOfferTerminalSetup: () => shouldOfferTerminalSetup,
  setupTerminal: () => setupTerminal,
  markBackslashReturnUsed: () => markBackslashReturnUsed,
  isShiftEnterKeyBindingInstalled: () => isShiftEnterKeyBindingInstalled,
  hasUsedBackslashReturn: () => hasUsedBackslashReturn,
  getNativeCSIuTerminalDisplayName: () => getNativeCSIuTerminalDisplayName,
  call: () => call5
});
import { randomBytes as randomBytes15 } from "crypto";
import { copyFile as copyFile8, mkdir as mkdir23, readFile as readFile36, writeFile as writeFile28 } from "fs/promises";
import { homedir as homedir29, platform as platform5 } from "os";
import { dirname as dirname48, join as join104 } from "path";
import { pathToFileURL as pathToFileURL7 } from "url";
function isVSCodeRemoteSSH() {
  let askpassMain = process.env.VSCODE_GIT_ASKPASS_MAIN ?? "", path21 = process.env.PATH ?? "";
  return askpassMain.includes(".vscode-server") || askpassMain.includes(".cursor-server") || askpassMain.includes(".windsurf-server") || path21.includes(".vscode-server") || path21.includes(".cursor-server") || path21.includes(".windsurf-server");
}
function getNativeCSIuTerminalDisplayName() {
  if (!env3.terminal || !(env3.terminal in NATIVE_CSIU_TERMINALS))
    return null;
  return NATIVE_CSIU_TERMINALS[env3.terminal] ?? null;
}
function formatPathLink(filePath) {
  if (!supportsHyperlinks())
    return filePath;
  return `\x1B]8;;${pathToFileURL7(filePath).href}\x07${filePath}\x1B]8;;\x07`;
}
function shouldOfferTerminalSetup() {
  return platform5() === "darwin" && env3.terminal === "Apple_Terminal" || env3.terminal === "vscode" || env3.terminal === "cursor" || env3.terminal === "windsurf" || env3.terminal === "alacritty" || env3.terminal === "zed";
}
async function setupTerminal(theme) {
  let result = "";
  switch (env3.terminal) {
    case "Apple_Terminal":
      result = await enableOptionAsMetaForTerminal(theme);
      break;
    case "vscode":
      result = await installBindingsForVSCodeTerminal("VSCode", theme);
      break;
    case "cursor":
      result = await installBindingsForVSCodeTerminal("Cursor", theme);
      break;
    case "windsurf":
      result = await installBindingsForVSCodeTerminal("Windsurf", theme);
      break;
    case "alacritty":
      result = await installBindingsForAlacritty(theme);
      break;
    case "zed":
      result = await installBindingsForZed(theme);
      break;
    case null:
      break;
  }
  return saveGlobalConfig((current) => {
    if (["vscode", "cursor", "windsurf", "alacritty", "zed"].includes(env3.terminal ?? "")) {
      if (current.shiftEnterKeyBindingInstalled === !0)
        return current;
      return {
        ...current,
        shiftEnterKeyBindingInstalled: !0
      };
    } else if (env3.terminal === "Apple_Terminal") {
      if (current.optionAsMetaKeyInstalled === !0)
        return current;
      return {
        ...current,
        optionAsMetaKeyInstalled: !0
      };
    }
    return current;
  }), maybeMarkProjectOnboardingComplete(), result;
}
function isShiftEnterKeyBindingInstalled() {
  return getGlobalConfig().shiftEnterKeyBindingInstalled === !0;
}
function hasUsedBackslashReturn() {
  return getGlobalConfig().hasUsedBackslashReturn === !0;
}
function markBackslashReturnUsed() {
  if (!getGlobalConfig().hasUsedBackslashReturn)
    saveGlobalConfig((current) => ({
      ...current,
      hasUsedBackslashReturn: !0
    }));
}
async function call5(onDone, context6, _args) {
  if (env3.terminal && env3.terminal in NATIVE_CSIU_TERMINALS) {
    let message = `Shift+Enter is natively supported in ${NATIVE_CSIU_TERMINALS[env3.terminal]}.

No configuration needed. Just use Shift+Enter to add newlines.`;
    return onDone(message), null;
  }
  if (!shouldOfferTerminalSetup()) {
    let terminalName = env3.terminal || "your current terminal", currentPlatform = getPlatform(), platformTerminals = "";
    if (currentPlatform === "macos")
      platformTerminals = `   \u2022 macOS: Apple Terminal
`;
    else if (currentPlatform === "windows")
      platformTerminals = `   \u2022 Windows: Windows Terminal
`;
    let message = `Terminal setup cannot be run from ${terminalName}.

This command configures a convenient Shift+Enter shortcut for multi-line prompts.
${source_default.dim("Note: You can already use backslash (\\\\) + return to add newlines.")}

To set up the shortcut (optional):
1. Exit tmux/screen temporarily
2. Run /terminal-setup directly in one of these terminals:
${platformTerminals}   \u2022 IDE: VSCode, Cursor, Windsurf, Zed
   \u2022 Other: Alacritty
3. Return to tmux/screen - settings will persist

${source_default.dim("Note: iTerm2, WezTerm, Ghostty, Kitty, and Warp support Shift+Enter natively.")}`;
    return onDone(message), null;
  }
  let result = await setupTerminal(context6.options.theme);
  return onDone(result), null;
}
async function installBindingsForVSCodeTerminal(editor = "VSCode", theme) {
  if (isVSCodeRemoteSSH())
    return `${color("warning", theme)(`Cannot install keybindings from a remote ${editor} session.`)}${EOL7}${EOL7}${editor} keybindings must be installed on your local machine, not the remote server.${EOL7}${EOL7}To install the Shift+Enter keybinding:${EOL7}1. Open ${editor} on your local machine (not connected to remote)${EOL7}2. Open the Command Palette (Cmd/Ctrl+Shift+P) \u2192 "Preferences: Open Keyboard Shortcuts (JSON)"${EOL7}3. Add this keybinding (the file must be a JSON array):${EOL7}${EOL7}${source_default.dim(`[
  {
    "key": "shift+enter",
    "command": "workbench.action.terminal.sendSequence",
    "args": { "text": "\\u001b\\r" },
    "when": "terminalFocus"
  }
]`)}${EOL7}`;
  let editorDir = editor === "VSCode" ? "Code" : editor, userDirPath = join104(homedir29(), platform5() === "win32" ? join104("AppData", "Roaming", editorDir, "User") : platform5() === "darwin" ? join104("Library", "Application Support", editorDir, "User") : join104(".config", editorDir, "User")), keybindingsPath = join104(userDirPath, "keybindings.json");
  try {
    await mkdir23(userDirPath, {
      recursive: !0
    });
    let content = "[]", keybindings = [], fileExists = !1;
    try {
      content = await readFile36(keybindingsPath, {
        encoding: "utf-8"
      }), fileExists = !0, keybindings = safeParseJSONC(content) ?? [];
    } catch (e) {
      if (!isFsInaccessible(e))
        throw e;
    }
    if (fileExists) {
      let randomSha = randomBytes15(4).toString("hex"), backupPath = `${keybindingsPath}.${randomSha}.bak`;
      try {
        await copyFile8(keybindingsPath, backupPath);
      } catch {
        return `${color("warning", theme)(`Error backing up existing ${editor} terminal keybindings. Bailing out.`)}${EOL7}${source_default.dim(`See ${formatPathLink(keybindingsPath)}`)}${EOL7}${source_default.dim(`Backup path: ${formatPathLink(backupPath)}`)}${EOL7}`;
      }
    }
    if (keybindings.find((binding) => binding.key === "shift+enter" && binding.command === "workbench.action.terminal.sendSequence" && binding.when === "terminalFocus"))
      return `${color("warning", theme)(`Found existing ${editor} terminal Shift+Enter key binding. Remove it to continue.`)}${EOL7}${source_default.dim(`See ${formatPathLink(keybindingsPath)}`)}${EOL7}`;
    let updatedContent = addItemToJSONCArray(content, {
      key: "shift+enter",
      command: "workbench.action.terminal.sendSequence",
      args: {
        text: "\x1B\r"
      },
      when: "terminalFocus"
    });
    return await writeFile28(keybindingsPath, updatedContent, {
      encoding: "utf-8"
    }), `${color("success", theme)(`Installed ${editor} terminal Shift+Enter key binding`)}${EOL7}${source_default.dim(`See ${formatPathLink(keybindingsPath)}`)}${EOL7}`;
  } catch (error44) {
    throw logError2(error44), Error(`Failed to install ${editor} terminal Shift+Enter key binding`);
  }
}
async function enableOptionAsMetaForProfile(profileName) {
  let {
    code: addCode
  } = await execFileNoThrow("/usr/libexec/PlistBuddy", ["-c", `Add :'Window Settings':'${profileName}':useOptionAsMetaKey bool true`, getTerminalPlistPath()]);
  if (addCode !== 0) {
    let {
      code: setCode
    } = await execFileNoThrow("/usr/libexec/PlistBuddy", ["-c", `Set :'Window Settings':'${profileName}':useOptionAsMetaKey true`, getTerminalPlistPath()]);
    if (setCode !== 0)
      return logError2(Error(`Failed to enable Option as Meta key for Terminal.app profile: ${profileName}`)), !1;
  }
  return !0;
}
async function disableAudioBellForProfile(profileName) {
  let {
    code: addCode
  } = await execFileNoThrow("/usr/libexec/PlistBuddy", ["-c", `Add :'Window Settings':'${profileName}':Bell bool false`, getTerminalPlistPath()]);
  if (addCode !== 0) {
    let {
      code: setCode
    } = await execFileNoThrow("/usr/libexec/PlistBuddy", ["-c", `Set :'Window Settings':'${profileName}':Bell false`, getTerminalPlistPath()]);
    if (setCode !== 0)
      return logError2(Error(`Failed to disable audio bell for Terminal.app profile: ${profileName}`)), !1;
  }
  return !0;
}
async function enableOptionAsMetaForTerminal(theme) {
  try {
    if (!await backupTerminalPreferences())
      throw Error("Failed to create backup of Terminal.app preferences, bailing out");
    let {
      stdout: defaultProfile,
      code: readCode
    } = await execFileNoThrow("defaults", ["read", "com.apple.Terminal", "Default Window Settings"]);
    if (readCode !== 0 || !defaultProfile.trim())
      throw Error("Failed to read default Terminal.app profile");
    let {
      stdout: startupProfile,
      code: startupCode
    } = await execFileNoThrow("defaults", ["read", "com.apple.Terminal", "Startup Window Settings"]);
    if (startupCode !== 0 || !startupProfile.trim())
      throw Error("Failed to read startup Terminal.app profile");
    let wasAnyProfileUpdated = !1, defaultProfileName = defaultProfile.trim(), optionAsMetaEnabled = await enableOptionAsMetaForProfile(defaultProfileName), audioBellDisabled = await disableAudioBellForProfile(defaultProfileName);
    if (optionAsMetaEnabled || audioBellDisabled)
      wasAnyProfileUpdated = !0;
    let startupProfileName = startupProfile.trim();
    if (startupProfileName !== defaultProfileName) {
      let startupOptionAsMetaEnabled = await enableOptionAsMetaForProfile(startupProfileName), startupAudioBellDisabled = await disableAudioBellForProfile(startupProfileName);
      if (startupOptionAsMetaEnabled || startupAudioBellDisabled)
        wasAnyProfileUpdated = !0;
    }
    if (!wasAnyProfileUpdated)
      throw Error("Failed to enable Option as Meta key or disable audio bell for any Terminal.app profile");
    return await execFileNoThrow("killall", ["cfprefsd"]), markTerminalSetupComplete(), `${color("success", theme)("Configured Terminal.app settings:")}${EOL7}${color("success", theme)('- Enabled "Use Option as Meta key"')}${EOL7}${color("success", theme)("- Switched to visual bell")}${EOL7}${source_default.dim("Option+Enter will now enter a newline.")}${EOL7}${source_default.dim("You must restart Terminal.app for changes to take effect.", theme)}${EOL7}`;
  } catch (error44) {
    logError2(error44);
    let restoreResult = await checkAndRestoreTerminalBackup(), errorMessage3 = "Failed to enable Option as Meta key for Terminal.app.";
    if (restoreResult.status === "restored")
      throw Error(`${errorMessage3} Your settings have been restored from backup.`);
    else if (restoreResult.status === "failed")
      throw Error(`${errorMessage3} Restoring from backup failed, try manually with: defaults import com.apple.Terminal ${restoreResult.backupPath}`);
    else
      throw Error(`${errorMessage3} No backup was available to restore from.`);
  }
}
async function installBindingsForAlacritty(theme) {
  let configPaths = [], xdgConfigHome = process.env.XDG_CONFIG_HOME;
  if (xdgConfigHome)
    configPaths.push(join104(xdgConfigHome, "alacritty", "alacritty.toml"));
  else
    configPaths.push(join104(homedir29(), ".config", "alacritty", "alacritty.toml"));
  if (platform5() === "win32") {
    let appData = process.env.APPDATA;
    if (appData)
      configPaths.push(join104(appData, "alacritty", "alacritty.toml"));
  }
  let configPath = null, configContent = "", configExists = !1;
  for (let path21 of configPaths)
    try {
      configContent = await readFile36(path21, {
        encoding: "utf-8"
      }), configPath = path21, configExists = !0;
      break;
    } catch (e) {
      if (!isFsInaccessible(e))
        throw e;
    }
  if (!configPath)
    configPath = configPaths[0] ?? null;
  if (!configPath)
    throw Error("No valid config path found for Alacritty");
  try {
    if (configExists) {
      if (configContent.includes('mods = "Shift"') && configContent.includes('key = "Return"'))
        return `${color("warning", theme)("Found existing Alacritty Shift+Enter key binding. Remove it to continue.")}${EOL7}${source_default.dim(`See ${formatPathLink(configPath)}`)}${EOL7}`;
      let randomSha = randomBytes15(4).toString("hex"), backupPath = `${configPath}.${randomSha}.bak`;
      try {
        await copyFile8(configPath, backupPath);
      } catch {
        return `${color("warning", theme)("Error backing up existing Alacritty config. Bailing out.")}${EOL7}${source_default.dim(`See ${formatPathLink(configPath)}`)}${EOL7}${source_default.dim(`Backup path: ${formatPathLink(backupPath)}`)}${EOL7}`;
      }
    } else
      await mkdir23(dirname48(configPath), {
        recursive: !0
      });
    let updatedContent = configContent;
    if (configContent && !configContent.endsWith(`
`))
      updatedContent += `
`;
    return updatedContent += `
[[keyboard.bindings]]
key = "Return"
mods = "Shift"
chars = "\\u001B\\r"
`, await writeFile28(configPath, updatedContent, {
      encoding: "utf-8"
    }), `${color("success", theme)("Installed Alacritty Shift+Enter key binding")}${EOL7}${color("success", theme)("You may need to restart Alacritty for changes to take effect")}${EOL7}${source_default.dim(`See ${formatPathLink(configPath)}`)}${EOL7}`;
  } catch (error44) {
    throw logError2(error44), Error("Failed to install Alacritty Shift+Enter key binding");
  }
}
async function installBindingsForZed(theme) {
  let zedDir = join104(homedir29(), ".config", "zed"), keymapPath = join104(zedDir, "keymap.json");
  try {
    await mkdir23(zedDir, {
      recursive: !0
    });
    let keymapContent = "[]", fileExists = !1;
    try {
      keymapContent = await readFile36(keymapPath, {
        encoding: "utf-8"
      }), fileExists = !0;
    } catch (e) {
      if (!isFsInaccessible(e))
        throw e;
    }
    if (fileExists) {
      if (keymapContent.includes("shift-enter"))
        return `${color("warning", theme)("Found existing Zed Shift+Enter key binding. Remove it to continue.")}${EOL7}${source_default.dim(`See ${formatPathLink(keymapPath)}`)}${EOL7}`;
      let randomSha = randomBytes15(4).toString("hex"), backupPath = `${keymapPath}.${randomSha}.bak`;
      try {
        await copyFile8(keymapPath, backupPath);
      } catch {
        return `${color("warning", theme)("Error backing up existing Zed keymap. Bailing out.")}${EOL7}${source_default.dim(`See ${formatPathLink(keymapPath)}`)}${EOL7}${source_default.dim(`Backup path: ${formatPathLink(backupPath)}`)}${EOL7}`;
      }
    }
    let keymap;
    try {
      if (keymap = jsonParse(keymapContent), !Array.isArray(keymap))
        keymap = [];
    } catch {
      keymap = [];
    }
    return keymap.push({
      context: "Terminal",
      bindings: {
        "shift-enter": ["terminal::SendText", "\x1B\r"]
      }
    }), await writeFile28(keymapPath, jsonStringify(keymap, null, 2) + `
`, {
      encoding: "utf-8"
    }), `${color("success", theme)("Installed Zed Shift+Enter key binding")}${EOL7}${source_default.dim(`See ${formatPathLink(keymapPath)}`)}${EOL7}`;
  } catch (error44) {
    throw logError2(error44), Error("Failed to install Zed Shift+Enter key binding");
  }
}
var EOL7 = `
`, NATIVE_CSIU_TERMINALS;
var init_terminalSetup = __esm(() => {
  init_source();
  init_supports_hyperlinks();
  init_ink2();
  init_projectOnboardingState();
  init_appleTerminalBackup();
  init_completionCache();
  init_config4();
  init_env();
  init_errors();
  init_execFileNoThrow();
  init_json();
  init_log3();
  init_platform();
  init_slowOperations();
  NATIVE_CSIU_TERMINALS = {
    ghostty: "Ghostty",
    kitty: "Kitty",
    "iTerm.app": "iTerm2",
    WezTerm: "WezTerm",
    WarpTerminal: "Warp"
  };
});
