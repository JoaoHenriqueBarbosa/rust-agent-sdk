// Original: src/utils/sandbox/sandbox-adapter.ts
var exports_sandbox_adapter = {};
__export(exports_sandbox_adapter, {
  shouldAllowManagedSandboxDomainsOnly: () => shouldAllowManagedSandboxDomainsOnly,
  resolveSandboxFilesystemPath: () => resolveSandboxFilesystemPath,
  resolvePathPatternForSandbox: () => resolvePathPatternForSandbox,
  convertToSandboxRuntimeConfig: () => convertToSandboxRuntimeConfig,
  addToExcludedCommands: () => addToExcludedCommands,
  SandboxViolationStore: () => SandboxViolationStore,
  SandboxRuntimeConfigSchema: () => SandboxRuntimeConfigSchema,
  SandboxManager: () => SandboxManager2
});
import { rmSync as rmSync3, statSync as statSync7 } from "fs";
import { readFile as readFile12 } from "fs/promises";
import { join as join33, resolve as resolve17, sep as sep8 } from "path";
function permissionRuleValueFromString2(ruleString) {
  let matches = ruleString.match(/^([^(]+)\(([^)]+)\)$/);
  if (!matches)
    return { toolName: ruleString };
  let toolName = matches[1], ruleContent = matches[2];
  if (!toolName || !ruleContent)
    return { toolName: ruleString };
  return { toolName, ruleContent };
}
function permissionRuleExtractPrefix(permissionRule) {
  return permissionRule.match(/^(.+):\*$/)?.[1] ?? null;
}
function resolvePathPatternForSandbox(pattern, source) {
  if (pattern.startsWith("//"))
    return pattern.slice(1);
  if (pattern.startsWith("/") && !pattern.startsWith("//")) {
    let root2 = getSettingsRootPathForSource(source);
    return resolve17(root2, pattern.slice(1));
  }
  return pattern;
}
function resolveSandboxFilesystemPath(pattern, source) {
  if (pattern.startsWith("//"))
    return pattern.slice(1);
  return expandPath(pattern, getSettingsRootPathForSource(source));
}
function shouldAllowManagedSandboxDomainsOnly() {
  return getSettingsForSource("policySettings")?.sandbox?.network?.allowManagedDomainsOnly === !0;
}
function shouldAllowManagedReadPathsOnly() {
  return getSettingsForSource("policySettings")?.sandbox?.filesystem?.allowManagedReadPathsOnly === !0;
}
function convertToSandboxRuntimeConfig(settings) {
  let permissions = settings.permissions || {}, allowedDomains = [], deniedDomains = [];
  if (shouldAllowManagedSandboxDomainsOnly()) {
    let policySettings = getSettingsForSource("policySettings");
    for (let domain2 of policySettings?.sandbox?.network?.allowedDomains || [])
      allowedDomains.push(domain2);
    for (let ruleString of policySettings?.permissions?.allow || []) {
      let rule = permissionRuleValueFromString2(ruleString);
      if (rule.toolName === WEB_FETCH_TOOL_NAME && rule.ruleContent?.startsWith("domain:"))
        allowedDomains.push(rule.ruleContent.substring(7));
    }
  } else {
    for (let domain2 of settings.sandbox?.network?.allowedDomains || [])
      allowedDomains.push(domain2);
    for (let ruleString of permissions.allow || []) {
      let rule = permissionRuleValueFromString2(ruleString);
      if (rule.toolName === WEB_FETCH_TOOL_NAME && rule.ruleContent?.startsWith("domain:"))
        allowedDomains.push(rule.ruleContent.substring(7));
    }
  }
  for (let ruleString of permissions.deny || []) {
    let rule = permissionRuleValueFromString2(ruleString);
    if (rule.toolName === WEB_FETCH_TOOL_NAME && rule.ruleContent?.startsWith("domain:"))
      deniedDomains.push(rule.ruleContent.substring(7));
  }
  let allowWrite = [".", getClaudeTempDir()], denyWrite = [], denyRead = [], allowRead = [], settingsPaths = SETTING_SOURCES.map((source) => getSettingsFilePathForSource(source)).filter((p4) => p4 !== void 0);
  denyWrite.push(...settingsPaths), denyWrite.push(getManagedSettingsDropInDir());
  let cwd2 = getCwdState(), originalCwd = getOriginalCwd();
  if (cwd2 !== originalCwd)
    denyWrite.push(resolve17(cwd2, ".claude", "settings.json")), denyWrite.push(resolve17(cwd2, ".claude", "settings.local.json"));
  if (denyWrite.push(resolve17(originalCwd, ".claude", "skills")), cwd2 !== originalCwd)
    denyWrite.push(resolve17(cwd2, ".claude", "skills"));
  bareGitRepoScrubPaths.length = 0;
  let bareGitRepoFiles = ["HEAD", "objects", "refs", "hooks", "config"];
  for (let dir of cwd2 === originalCwd ? [originalCwd] : [originalCwd, cwd2])
    for (let gitFile of bareGitRepoFiles) {
      let p4 = resolve17(dir, gitFile);
      try {
        statSync7(p4), denyWrite.push(p4);
      } catch {
        bareGitRepoScrubPaths.push(p4);
      }
    }
  if (worktreeMainRepoPath && worktreeMainRepoPath !== cwd2)
    allowWrite.push(worktreeMainRepoPath);
  let additionalDirs = /* @__PURE__ */ new Set([
    ...settings.permissions?.additionalDirectories || [],
    ...getAdditionalDirectoriesForClaudeMd()
  ]);
  allowWrite.push(...additionalDirs);
  for (let source of SETTING_SOURCES) {
    let sourceSettings = getSettingsForSource(source);
    if (sourceSettings?.permissions) {
      for (let ruleString of sourceSettings.permissions.allow || []) {
        let rule = permissionRuleValueFromString2(ruleString);
        if (rule.toolName === FILE_EDIT_TOOL_NAME && rule.ruleContent)
          allowWrite.push(resolvePathPatternForSandbox(rule.ruleContent, source));
      }
      for (let ruleString of sourceSettings.permissions.deny || []) {
        let rule = permissionRuleValueFromString2(ruleString);
        if (rule.toolName === FILE_EDIT_TOOL_NAME && rule.ruleContent)
          denyWrite.push(resolvePathPatternForSandbox(rule.ruleContent, source));
        if (rule.toolName === FILE_READ_TOOL_NAME && rule.ruleContent)
          denyRead.push(resolvePathPatternForSandbox(rule.ruleContent, source));
      }
    }
    let fs14 = sourceSettings?.sandbox?.filesystem;
    if (fs14) {
      for (let p4 of fs14.allowWrite || [])
        allowWrite.push(resolveSandboxFilesystemPath(p4, source));
      for (let p4 of fs14.denyWrite || [])
        denyWrite.push(resolveSandboxFilesystemPath(p4, source));
      for (let p4 of fs14.denyRead || [])
        denyRead.push(resolveSandboxFilesystemPath(p4, source));
      if (!shouldAllowManagedReadPathsOnly() || source === "policySettings")
        for (let p4 of fs14.allowRead || [])
          allowRead.push(resolveSandboxFilesystemPath(p4, source));
    }
  }
  let { rgPath, rgArgs, argv0 } = ripgrepCommand(), ripgrepConfig = settings.sandbox?.ripgrep ?? {
    command: rgPath,
    args: rgArgs,
    argv0
  };
  return {
    network: {
      allowedDomains,
      deniedDomains,
      allowUnixSockets: settings.sandbox?.network?.allowUnixSockets,
      allowAllUnixSockets: settings.sandbox?.network?.allowAllUnixSockets,
      allowLocalBinding: settings.sandbox?.network?.allowLocalBinding,
      httpProxyPort: settings.sandbox?.network?.httpProxyPort,
      socksProxyPort: settings.sandbox?.network?.socksProxyPort
    },
    filesystem: {
      denyRead,
      allowRead,
      allowWrite,
      denyWrite
    },
    ignoreViolations: settings.sandbox?.ignoreViolations,
    enableWeakerNestedSandbox: settings.sandbox?.enableWeakerNestedSandbox,
    enableWeakerNetworkIsolation: settings.sandbox?.enableWeakerNetworkIsolation,
    ripgrep: ripgrepConfig
  };
}
function scrubBareGitRepoFiles() {
  for (let p4 of bareGitRepoScrubPaths)
    try {
      rmSync3(p4, { recursive: !0 }), logForDebugging(`[Sandbox] scrubbed planted bare-repo file: ${p4}`);
    } catch {}
}
async function detectWorktreeMainRepoPath(cwd2) {
  let gitPath = join33(cwd2, ".git");
  try {
    let gitdirMatch = (await readFile12(gitPath, { encoding: "utf8" })).match(/^gitdir:\s*(.+)$/m);
    if (!gitdirMatch?.[1])
      return null;
    let gitdir = resolve17(cwd2, gitdirMatch[1].trim()), marker = `${sep8}.git${sep8}worktrees${sep8}`, markerIndex = gitdir.lastIndexOf(marker);
    if (markerIndex > 0)
      return gitdir.substring(0, markerIndex);
    return null;
  } catch {
    return null;
  }
}
function getSandboxEnabledSetting() {
  try {
    return getSettings_DEPRECATED()?.sandbox?.enabled ?? !1;
  } catch (error44) {
    return logForDebugging(`Failed to get settings for sandbox check: ${error44}`), !1;
  }
}
function isAutoAllowBashIfSandboxedEnabled() {
  return getSettings_DEPRECATED()?.sandbox?.autoAllowBashIfSandboxed ?? !0;
}
function areUnsandboxedCommandsAllowed() {
  return getSettings_DEPRECATED()?.sandbox?.allowUnsandboxedCommands ?? !0;
}
function isSandboxRequired() {
  let settings = getSettings_DEPRECATED();
  return getSandboxEnabledSetting() && (settings?.sandbox?.failIfUnavailable ?? !1);
}
function isPlatformInEnabledList() {
  try {
    let enabledPlatforms = getInitialSettings()?.sandbox?.enabledPlatforms;
    if (enabledPlatforms === void 0)
      return !0;
    if (enabledPlatforms.length === 0)
      return !1;
    let currentPlatform = getPlatform();
    return enabledPlatforms.includes(currentPlatform);
  } catch (error44) {
    return logForDebugging(`Failed to check enabledPlatforms: ${error44}`), !0;
  }
}
function isSandboxingEnabled2() {
  if (!isSupportedPlatform2())
    return !1;
  if (checkDependencies2().errors.length > 0)
    return !1;
  if (!isPlatformInEnabledList())
    return !1;
  return getSandboxEnabledSetting();
}
function getSandboxUnavailableReason() {
  if (!getSandboxEnabledSetting())
    return;
  if (!isSupportedPlatform2()) {
    let platform3 = getPlatform();
    if (platform3 === "wsl")
      return "sandbox.enabled is set but WSL1 is not supported (requires WSL2)";
    return `sandbox.enabled is set but ${platform3} is not supported (requires macOS, Linux, or WSL2)`;
  }
  if (!isPlatformInEnabledList())
    return `sandbox.enabled is set but ${getPlatform()} is not in sandbox.enabledPlatforms`;
  let deps = checkDependencies2();
  if (deps.errors.length > 0) {
    let hint = getPlatform() === "macos" ? "run /sandbox or /doctor for details" : "install missing tools (e.g. apt install bubblewrap socat) or run /sandbox for details";
    return `sandbox.enabled is set but dependencies are missing: ${deps.errors.join(", ")} \xB7 ${hint}`;
  }
  return;
}
function getLinuxGlobPatternWarnings2() {
  let platform3 = getPlatform();
  if (platform3 !== "linux" && platform3 !== "wsl")
    return [];
  try {
    let settings = getSettings_DEPRECATED();
    if (!settings?.sandbox?.enabled)
      return [];
    let permissions = settings?.permissions || {}, warnings = [], hasGlobs = (path16) => {
      let stripped = path16.replace(/\/\*\*$/, "");
      return /[*?[\]]/.test(stripped);
    };
    for (let ruleString of [
      ...permissions.allow || [],
      ...permissions.deny || []
    ]) {
      let rule = permissionRuleValueFromString2(ruleString);
      if ((rule.toolName === FILE_EDIT_TOOL_NAME || rule.toolName === FILE_READ_TOOL_NAME) && rule.ruleContent && hasGlobs(rule.ruleContent))
        warnings.push(ruleString);
    }
    return warnings;
  } catch (error44) {
    return logForDebugging(`Failed to get Linux glob pattern warnings: ${error44}`), [];
  }
}
function areSandboxSettingsLockedByPolicy() {
  let overridingSources = ["flagSettings", "policySettings"];
  for (let source of overridingSources) {
    let settings = getSettingsForSource(source);
    if (settings?.sandbox?.enabled !== void 0 || settings?.sandbox?.autoAllowBashIfSandboxed !== void 0 || settings?.sandbox?.allowUnsandboxedCommands !== void 0)
      return !0;
  }
  return !1;
}
async function setSandboxSettings(options) {
  let existingSettings = getSettingsForSource("localSettings");
  updateSettingsForSource("localSettings", {
    sandbox: {
      ...existingSettings?.sandbox,
      ...options.enabled !== void 0 && { enabled: options.enabled },
      ...options.autoAllowBashIfSandboxed !== void 0 && {
        autoAllowBashIfSandboxed: options.autoAllowBashIfSandboxed
      },
      ...options.allowUnsandboxedCommands !== void 0 && {
        allowUnsandboxedCommands: options.allowUnsandboxedCommands
      }
    }
  });
}
function getExcludedCommands() {
  return getSettings_DEPRECATED()?.sandbox?.excludedCommands ?? [];
}
async function wrapWithSandbox2(command12, binShell, customConfig, abortSignal) {
  if (isSandboxingEnabled2())
    if (initializationPromise2)
      await initializationPromise2;
    else
      throw Error("Sandbox failed to initialize. ");
  return SandboxManager.wrapWithSandbox(command12, binShell, customConfig, abortSignal);
}
async function initialize3(sandboxAskCallback) {
  if (initializationPromise2)
    return initializationPromise2;
  if (!isSandboxingEnabled2())
    return;
  let wrappedCallback = sandboxAskCallback ? async (hostPattern) => {
    if (shouldAllowManagedSandboxDomainsOnly())
      return logForDebugging(`[sandbox] Blocked network request to ${hostPattern.host} (allowManagedDomainsOnly)`), !1;
    return sandboxAskCallback(hostPattern);
  } : void 0;
  return initializationPromise2 = (async () => {
    try {
      if (worktreeMainRepoPath === void 0)
        worktreeMainRepoPath = await detectWorktreeMainRepoPath(getCwdState());
      let settings = getSettings_DEPRECATED(), runtimeConfig = convertToSandboxRuntimeConfig(settings);
      await SandboxManager.initialize(runtimeConfig, wrappedCallback), settingsSubscriptionCleanup = settingsChangeDetector.subscribe(() => {
        let settings2 = getSettings_DEPRECATED(), newConfig = convertToSandboxRuntimeConfig(settings2);
        SandboxManager.updateConfig(newConfig), logForDebugging("Sandbox configuration updated from settings change");
      });
    } catch (error44) {
      initializationPromise2 = void 0, logForDebugging(`Failed to initialize sandbox: ${errorMessage(error44)}`);
    }
  })(), initializationPromise2;
}
function refreshConfig() {
  if (!isSandboxingEnabled2())
    return;
  let settings = getSettings_DEPRECATED(), newConfig = convertToSandboxRuntimeConfig(settings);
  SandboxManager.updateConfig(newConfig);
}
async function reset3() {
  return settingsSubscriptionCleanup?.(), settingsSubscriptionCleanup = void 0, worktreeMainRepoPath = void 0, bareGitRepoScrubPaths.length = 0, checkDependencies2.cache.clear?.(), isSupportedPlatform2.cache.clear?.(), initializationPromise2 = void 0, SandboxManager.reset();
}
function addToExcludedCommands(command12, permissionUpdates) {
  let existingSettings = getSettingsForSource("localSettings"), existingExcludedCommands = existingSettings?.sandbox?.excludedCommands || [], commandPattern = command12;
  if (permissionUpdates) {
    let bashSuggestions = permissionUpdates.filter((update) => update.type === "addRules" && update.rules.some((rule) => rule.toolName === BASH_TOOL_NAME));
    if (bashSuggestions.length > 0 && bashSuggestions[0].type === "addRules") {
      let firstBashRule = bashSuggestions[0].rules.find((rule) => rule.toolName === BASH_TOOL_NAME);
      if (firstBashRule?.ruleContent)
        commandPattern = permissionRuleExtractPrefix(firstBashRule.ruleContent) || firstBashRule.ruleContent;
    }
  }
  if (!existingExcludedCommands.includes(commandPattern))
    updateSettingsForSource("localSettings", {
      sandbox: {
        ...existingSettings?.sandbox,
        excludedCommands: [...existingExcludedCommands, commandPattern]
      }
    });
  return commandPattern;
}
var initializationPromise2, settingsSubscriptionCleanup, worktreeMainRepoPath, bareGitRepoScrubPaths, checkDependencies2, isSupportedPlatform2, SandboxManager2;
var init_sandbox_adapter = __esm(() => {
  init_dist6();
  init_lodash();
  init_state();
  init_debug();
  init_path2();
  init_platform();
  init_changeDetector();
  init_constants2();
  init_managedPath();
  init_settings2();
  init_prompt2();
  init_prompt3();
  init_errors();
  init_filesystem();
  init_ripgrep();
  bareGitRepoScrubPaths = [];
  checkDependencies2 = memoize_default(() => {
    let { rgPath, rgArgs } = ripgrepCommand();
    return SandboxManager.checkDependencies({
      command: rgPath,
      args: rgArgs
    });
  });
  isSupportedPlatform2 = memoize_default(() => {
    return SandboxManager.isSupportedPlatform();
  });
  SandboxManager2 = {
    initialize: initialize3,
    isSandboxingEnabled: isSandboxingEnabled2,
    isSandboxEnabledInSettings: getSandboxEnabledSetting,
    isPlatformInEnabledList,
    getSandboxUnavailableReason,
    isAutoAllowBashIfSandboxedEnabled,
    areUnsandboxedCommandsAllowed,
    isSandboxRequired,
    areSandboxSettingsLockedByPolicy,
    setSandboxSettings,
    getExcludedCommands,
    wrapWithSandbox: wrapWithSandbox2,
    refreshConfig,
    reset: reset3,
    checkDependencies: checkDependencies2,
    getFsReadConfig: SandboxManager.getFsReadConfig,
    getFsWriteConfig: SandboxManager.getFsWriteConfig,
    getNetworkRestrictionConfig: SandboxManager.getNetworkRestrictionConfig,
    getIgnoreViolations: SandboxManager.getIgnoreViolations,
    getLinuxGlobPatternWarnings: getLinuxGlobPatternWarnings2,
    isSupportedPlatform: isSupportedPlatform2,
    getAllowUnixSockets: SandboxManager.getAllowUnixSockets,
    getAllowLocalBinding: SandboxManager.getAllowLocalBinding,
    getEnableWeakerNestedSandbox: SandboxManager.getEnableWeakerNestedSandbox,
    getProxyPort: SandboxManager.getProxyPort,
    getSocksProxyPort: SandboxManager.getSocksProxyPort,
    getLinuxHttpSocketPath: SandboxManager.getLinuxHttpSocketPath,
    getLinuxSocksSocketPath: SandboxManager.getLinuxSocksSocketPath,
    waitForNetworkInitialization: SandboxManager.waitForNetworkInitialization,
    getSandboxViolationStore: SandboxManager.getSandboxViolationStore,
    annotateStderrWithSandboxFailures: SandboxManager.annotateStderrWithSandboxFailures,
    cleanupAfterCommand: () => {
      SandboxManager.cleanupAfterCommand(), scrubBareGitRepoFiles();
    }
  };
});
