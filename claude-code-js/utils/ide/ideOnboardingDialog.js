// var: ideOnboardingDialog
var ideOnboardingDialog = () => (init_IdeOnboardingDialog(), __toCommonJS(exports_IdeOnboardingDialog)), supportedIdeConfigs, isSupportedVSCodeTerminal, isSupportedJetBrainsTerminal, isSupportedTerminal, getWindowsUserProfile, currentIDESearch = null, EXTENSION_ID = "anthropic.claude-code", cachedRunningIDEs = null, EDITOR_DISPLAY_NAMES, detectHostIP;
var init_ide = __esm(() => {
  init_execa();
  init_capitalize();
  init_memoize();
  init_state();
  init_client20();
  init_config4();
  init_env();
  init_envUtils();
  init_execFileNoThrow();
  init_fsOperations();
  init_genericProcessUtils();
  init_jetbrains();
  init_log3();
  init_platform();
  init_abortController();
  init_debug();
  init_envDynamic();
  init_errors();
  init_idePathConversion();
  init_slowOperations();
  supportedIdeConfigs = {
    cursor: {
      ideKind: "vscode",
      displayName: "Cursor",
      processKeywordsMac: ["Cursor Helper", "Cursor.app"],
      processKeywordsWindows: ["cursor.exe"],
      processKeywordsLinux: ["cursor"]
    },
    windsurf: {
      ideKind: "vscode",
      displayName: "Windsurf",
      processKeywordsMac: ["Windsurf Helper", "Windsurf.app"],
      processKeywordsWindows: ["windsurf.exe"],
      processKeywordsLinux: ["windsurf"]
    },
    vscode: {
      ideKind: "vscode",
      displayName: "VS Code",
      processKeywordsMac: ["Visual Studio Code", "Code Helper"],
      processKeywordsWindows: ["code.exe"],
      processKeywordsLinux: ["code"]
    },
    intellij: {
      ideKind: "jetbrains",
      displayName: "IntelliJ IDEA",
      processKeywordsMac: ["IntelliJ IDEA"],
      processKeywordsWindows: ["idea64.exe"],
      processKeywordsLinux: ["idea", "intellij"]
    },
    pycharm: {
      ideKind: "jetbrains",
      displayName: "PyCharm",
      processKeywordsMac: ["PyCharm"],
      processKeywordsWindows: ["pycharm64.exe"],
      processKeywordsLinux: ["pycharm"]
    },
    webstorm: {
      ideKind: "jetbrains",
      displayName: "WebStorm",
      processKeywordsMac: ["WebStorm"],
      processKeywordsWindows: ["webstorm64.exe"],
      processKeywordsLinux: ["webstorm"]
    },
    phpstorm: {
      ideKind: "jetbrains",
      displayName: "PhpStorm",
      processKeywordsMac: ["PhpStorm"],
      processKeywordsWindows: ["phpstorm64.exe"],
      processKeywordsLinux: ["phpstorm"]
    },
    rubymine: {
      ideKind: "jetbrains",
      displayName: "RubyMine",
      processKeywordsMac: ["RubyMine"],
      processKeywordsWindows: ["rubymine64.exe"],
      processKeywordsLinux: ["rubymine"]
    },
    clion: {
      ideKind: "jetbrains",
      displayName: "CLion",
      processKeywordsMac: ["CLion"],
      processKeywordsWindows: ["clion64.exe"],
      processKeywordsLinux: ["clion"]
    },
    goland: {
      ideKind: "jetbrains",
      displayName: "GoLand",
      processKeywordsMac: ["GoLand"],
      processKeywordsWindows: ["goland64.exe"],
      processKeywordsLinux: ["goland"]
    },
    rider: {
      ideKind: "jetbrains",
      displayName: "Rider",
      processKeywordsMac: ["Rider"],
      processKeywordsWindows: ["rider64.exe"],
      processKeywordsLinux: ["rider"]
    },
    datagrip: {
      ideKind: "jetbrains",
      displayName: "DataGrip",
      processKeywordsMac: ["DataGrip"],
      processKeywordsWindows: ["datagrip64.exe"],
      processKeywordsLinux: ["datagrip"]
    },
    appcode: {
      ideKind: "jetbrains",
      displayName: "AppCode",
      processKeywordsMac: ["AppCode"],
      processKeywordsWindows: ["appcode.exe"],
      processKeywordsLinux: ["appcode"]
    },
    dataspell: {
      ideKind: "jetbrains",
      displayName: "DataSpell",
      processKeywordsMac: ["DataSpell"],
      processKeywordsWindows: ["dataspell64.exe"],
      processKeywordsLinux: ["dataspell"]
    },
    aqua: {
      ideKind: "jetbrains",
      displayName: "Aqua",
      processKeywordsMac: [],
      processKeywordsWindows: ["aqua64.exe"],
      processKeywordsLinux: []
    },
    gateway: {
      ideKind: "jetbrains",
      displayName: "Gateway",
      processKeywordsMac: [],
      processKeywordsWindows: ["gateway64.exe"],
      processKeywordsLinux: []
    },
    fleet: {
      ideKind: "jetbrains",
      displayName: "Fleet",
      processKeywordsMac: [],
      processKeywordsWindows: ["fleet.exe"],
      processKeywordsLinux: []
    },
    androidstudio: {
      ideKind: "jetbrains",
      displayName: "Android Studio",
      processKeywordsMac: ["Android Studio"],
      processKeywordsWindows: ["studio64.exe"],
      processKeywordsLinux: ["android-studio"]
    }
  };
  isSupportedVSCodeTerminal = memoize_default(() => {
    return isVSCodeIde(env3.terminal);
  }), isSupportedJetBrainsTerminal = memoize_default(() => {
    return isJetBrainsIde(envDynamic.terminal);
  }), isSupportedTerminal = memoize_default(() => {
    return isSupportedVSCodeTerminal() || isSupportedJetBrainsTerminal() || Boolean(process.env.FORCE_CODE_TERMINAL);
  });
  getWindowsUserProfile = memoize_default(async () => {
    if (process.env.USERPROFILE)
      return process.env.USERPROFILE;
    let { stdout, code } = await execFileNoThrow("powershell.exe", [
      "-NoProfile",
      "-NonInteractive",
      "-Command",
      "$env:USERPROFILE"
    ]);
    if (code === 0 && stdout.trim())
      return stdout.trim();
    logForDebugging("Unable to get Windows USERPROFILE via PowerShell - IDE detection may be incomplete");
    return;
  });
  EDITOR_DISPLAY_NAMES = {
    code: "VS Code",
    cursor: "Cursor",
    windsurf: "Windsurf",
    antigravity: "Antigravity",
    vi: "Vim",
    vim: "Vim",
    nano: "nano",
    notepad: "Notepad",
    "start /wait notepad": "Notepad",
    emacs: "Emacs",
    subl: "Sublime Text",
    atom: "Atom"
  };
  detectHostIP = memoize_default(async (isIdeRunningInWindows, port) => {
    if (process.env.CLAUDE_CODE_IDE_HOST_OVERRIDE)
      return process.env.CLAUDE_CODE_IDE_HOST_OVERRIDE;
    if (getPlatform() !== "wsl" || !isIdeRunningInWindows)
      return "127.0.0.1";
    try {
      let routeResult = await execa("ip route show | grep -i default", {
        shell: !0,
        reject: !1
      });
      if (routeResult.exitCode === 0 && routeResult.stdout) {
        let gatewayMatch = routeResult.stdout.match(/default via (\d+\.\d+\.\d+\.\d+)/);
        if (gatewayMatch) {
          let gatewayIP = gatewayMatch[1];
          if (await checkIdeConnection(gatewayIP, port))
            return gatewayIP;
        }
      }
    } catch (_) {}
    return "127.0.0.1";
  }, (isIdeRunningInWindows, port) => `${isIdeRunningInWindows}:${port}`);
});
