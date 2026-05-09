// Original: src/utils/permissions/permissionSetup.ts
import { relative as relative21 } from "path";
import { resolve as resolve40 } from "path";
function isDangerousBashPermission(toolName, ruleContent) {
  if (toolName !== BASH_TOOL_NAME)
    return !1;
  if (ruleContent === void 0 || ruleContent === "")
    return !0;
  let content = ruleContent.trim().toLowerCase();
  if (content === "*")
    return !0;
  for (let pattern of DANGEROUS_BASH_PATTERNS) {
    let lowerPattern = pattern.toLowerCase();
    if (content === lowerPattern)
      return !0;
    if (content === `${lowerPattern}:*`)
      return !0;
    if (content === `${lowerPattern}*`)
      return !0;
    if (content === `${lowerPattern} *`)
      return !0;
    if (content.startsWith(`${lowerPattern} -`) && content.endsWith("*"))
      return !0;
  }
  return !1;
}
function isDangerousPowerShellPermission(toolName, ruleContent) {
  if (toolName !== POWERSHELL_TOOL_NAME)
    return !1;
  if (ruleContent === void 0 || ruleContent === "")
    return !0;
  let content = ruleContent.trim().toLowerCase();
  if (content === "*")
    return !0;
  let patterns = [
    ...CROSS_PLATFORM_CODE_EXEC,
    "pwsh",
    "powershell",
    "cmd",
    "wsl",
    "iex",
    "invoke-expression",
    "icm",
    "invoke-command",
    "start-process",
    "saps",
    "start",
    "start-job",
    "sajb",
    "start-threadjob",
    "register-objectevent",
    "register-engineevent",
    "register-wmievent",
    "register-scheduledjob",
    "new-pssession",
    "nsn",
    "enter-pssession",
    "etsn",
    "add-type",
    "new-object"
  ];
  for (let pattern of patterns) {
    if (content === pattern)
      return !0;
    if (content === `${pattern}:*`)
      return !0;
    if (content === `${pattern}*`)
      return !0;
    if (content === `${pattern} *`)
      return !0;
    if (content.startsWith(`${pattern} -`) && content.endsWith("*"))
      return !0;
    let sp = pattern.indexOf(" "), exe = sp === -1 ? `${pattern}.exe` : `${pattern.slice(0, sp)}.exe${pattern.slice(sp)}`;
    if (content === exe)
      return !0;
    if (content === `${exe}:*`)
      return !0;
    if (content === `${exe}*`)
      return !0;
    if (content === `${exe} *`)
      return !0;
    if (content.startsWith(`${exe} -`) && content.endsWith("*"))
      return !0;
  }
  return !1;
}
function isDangerousTaskPermission(toolName, _ruleContent) {
  return normalizeLegacyToolName(toolName) === AGENT_TOOL_NAME;
}
function formatPermissionSource(source) {
  if (SETTING_SOURCES.includes(source)) {
    let filePath = getSettingsFilePathForSource(source);
    if (filePath) {
      let relativePath = relative21(getCwd(), filePath);
      return relativePath.length < filePath.length ? relativePath : filePath;
    }
  }
  return source;
}
function isDangerousClassifierPermission(toolName, ruleContent) {
  return isDangerousBashPermission(toolName, ruleContent) || isDangerousPowerShellPermission(toolName, ruleContent) || isDangerousTaskPermission(toolName, ruleContent);
}
function findDangerousClassifierPermissions(rules2, cliAllowedTools) {
  let dangerous = [];
  for (let rule of rules2)
    if (rule.ruleBehavior === "allow" && isDangerousClassifierPermission(rule.ruleValue.toolName, rule.ruleValue.ruleContent)) {
      let ruleString = rule.ruleValue.ruleContent ? `${rule.ruleValue.toolName}(${rule.ruleValue.ruleContent})` : `${rule.ruleValue.toolName}(*)`;
      dangerous.push({
        ruleValue: rule.ruleValue,
        source: rule.source,
        ruleDisplay: ruleString,
        sourceDisplay: formatPermissionSource(rule.source)
      });
    }
  for (let toolSpec of cliAllowedTools) {
    let match = toolSpec.match(/^([^(]+)(?:\(([^)]*)\))?$/);
    if (match) {
      let toolName = match[1].trim(), ruleContent = match[2]?.trim();
      if (isDangerousClassifierPermission(toolName, ruleContent))
        dangerous.push({
          ruleValue: { toolName, ruleContent },
          source: "cliArg",
          ruleDisplay: ruleContent ? toolSpec : `${toolName}(*)`,
          sourceDisplay: "--allowed-tools"
        });
    }
  }
  return dangerous;
}
function isPermissionUpdateDestination(source) {
  return [
    "userSettings",
    "projectSettings",
    "localSettings",
    "session",
    "cliArg"
  ].includes(source);
}
function removeDangerousPermissions(context6, dangerousPermissions) {
  let rulesBySource = /* @__PURE__ */ new Map;
  for (let perm of dangerousPermissions) {
    if (!isPermissionUpdateDestination(perm.source))
      continue;
    let destination = perm.source, existing = rulesBySource.get(destination) || [];
    existing.push(perm.ruleValue), rulesBySource.set(destination, existing);
  }
  let updatedContext = context6;
  for (let [destination, rules2] of rulesBySource)
    updatedContext = applyPermissionUpdate(updatedContext, {
      type: "removeRules",
      rules: rules2,
      behavior: "allow",
      destination
    });
  return updatedContext;
}
function stripDangerousPermissionsForAutoMode(context6) {
  let rules2 = [];
  for (let [source, ruleStrings] of Object.entries(context6.alwaysAllowRules)) {
    if (!ruleStrings)
      continue;
    for (let ruleString of ruleStrings) {
      let ruleValue = permissionRuleValueFromString(ruleString);
      rules2.push({
        source,
        ruleBehavior: "allow",
        ruleValue
      });
    }
  }
  let dangerousPermissions = findDangerousClassifierPermissions(rules2, []);
  if (dangerousPermissions.length === 0)
    return {
      ...context6,
      strippedDangerousRules: context6.strippedDangerousRules ?? {}
    };
  for (let permission of dangerousPermissions)
    logForDebugging(`Ignoring dangerous permission ${permission.ruleDisplay} from ${permission.sourceDisplay} (bypasses classifier)`);
  let stripped = {};
  for (let perm of dangerousPermissions) {
    if (!isPermissionUpdateDestination(perm.source))
      continue;
    (stripped[perm.source] ??= []).push(permissionRuleValueToString(perm.ruleValue));
  }
  return {
    ...removeDangerousPermissions(context6, dangerousPermissions),
    strippedDangerousRules: stripped
  };
}
function restoreDangerousPermissions(context6) {
  let stash = context6.strippedDangerousRules;
  if (!stash)
    return context6;
  let result = context6;
  for (let [source, ruleStrings] of Object.entries(stash)) {
    if (!ruleStrings || ruleStrings.length === 0)
      continue;
    result = applyPermissionUpdate(result, {
      type: "addRules",
      rules: ruleStrings.map(permissionRuleValueFromString),
      behavior: "allow",
      destination: source
    });
  }
  return { ...result, strippedDangerousRules: void 0 };
}
function transitionPermissionMode(fromMode, toMode, context6) {
  if (fromMode === toMode)
    return context6;
  if (handlePlanModeTransition(fromMode, toMode), handleAutoModeTransition(fromMode, toMode), fromMode === "plan" && toMode !== "plan")
    setHasExitedPlanMode(!0);
  if (fromMode === "plan" && toMode !== "plan" && context6.prePlanMode)
    return { ...context6, prePlanMode: void 0 };
  return context6;
}
function parseBaseToolsFromCLI(baseTools) {
  let joinedInput = baseTools.join(" ").trim();
  if (parseToolPreset(joinedInput))
    return getToolsForDefaultPreset();
  return parseToolListFromCLI(baseTools);
}
function isSymlinkTo({
  processPwd,
  originalCwd
}) {
  let { resolvedPath: resolvedProcessPwd, isSymlink: isProcessPwdSymlink } = safeResolvePath(getFsImplementation(), processPwd);
  return isProcessPwdSymlink ? resolvedProcessPwd === resolve40(originalCwd) : !1;
}
function initialPermissionModeFromCLI({
  permissionModeCli,
  dangerouslySkipPermissions
}) {
  dangerouslySkipPermissions = dangerouslySkipPermissions !== !1 ? !0 : dangerouslySkipPermissions;
  let settings = getSettings_DEPRECATED() || {}, disableBypassPermissionsMode = !1, autoModeCircuitBrokenSync = !1, orderedModes = [], notification;
  if (dangerouslySkipPermissions)
    orderedModes.push("bypassPermissions");
  if (permissionModeCli) {
    let parsedMode = permissionModeFromString(permissionModeCli);
    orderedModes.push(parsedMode);
  }
  if (settings.permissions?.defaultMode) {
    let settingsMode = settings.permissions.defaultMode;
    if (isEnvTruthy(process.env.CLAUDE_CODE_REMOTE) && !["acceptEdits", "plan", "default"].includes(settingsMode))
      logForDebugging(`settings defaultMode "${settingsMode}" is not supported in CLAUDE_CODE_REMOTE \u2014 only acceptEdits and plan are allowed`, { level: "warn" }), logEvent("tengu_ccr_unsupported_default_mode_ignored", {
        mode: settingsMode
      });
    else
      orderedModes.push(settingsMode);
  }
  let result;
  for (let mode of orderedModes) {
    result = { mode, notification };
    break;
  }
  if (!result)
    result = { mode: "default", notification };
  if (!result)
    result = { mode: "default", notification };
  return result;
}
function parseToolListFromCLI(tools) {
  if (tools.length === 0)
    return [];
  let result = [];
  for (let toolString of tools) {
    if (!toolString)
      continue;
    let current = "", isInParens = !1;
    for (let char of toolString)
      switch (char) {
        case "(":
          isInParens = !0, current += char;
          break;
        case ")":
          isInParens = !1, current += char;
          break;
        case ",":
          if (isInParens)
            current += char;
          else {
            if (current.trim())
              result.push(current.trim());
            current = "";
          }
          break;
        case " ":
          if (isInParens)
            current += char;
          else if (current.trim())
            result.push(current.trim()), current = "";
          break;
        default:
          current += char;
      }
    if (current.trim())
      result.push(current.trim());
  }
  return result;
}
async function initializeToolPermissionContext({
  allowedToolsCli,
  disallowedToolsCli,
  baseToolsCli,
  permissionMode,
  allowDangerouslySkipPermissions,
  addDirs
}) {
  let parsedAllowedToolsCli = parseToolListFromCLI(allowedToolsCli).map((rule) => permissionRuleValueToString(permissionRuleValueFromString(rule))), parsedDisallowedToolsCli = parseToolListFromCLI(disallowedToolsCli);
  if (baseToolsCli && baseToolsCli.length > 0) {
    let baseToolsResult = parseBaseToolsFromCLI(baseToolsCli), baseToolsSet = new Set(baseToolsResult.map(normalizeLegacyToolName)), toolsToDisallow = getToolsForDefaultPreset().filter((tool) => !baseToolsSet.has(tool));
    parsedDisallowedToolsCli = [...parsedDisallowedToolsCli, ...toolsToDisallow];
  }
  let warnings = [], additionalWorkingDirectories = /* @__PURE__ */ new Map, processPwd = process.env.PWD;
  if (processPwd && processPwd !== getOriginalCwd() && isSymlinkTo({ originalCwd: getOriginalCwd(), processPwd }))
    additionalWorkingDirectories.set(processPwd, {
      path: processPwd,
      source: "session"
    });
  let settings = getSettings_DEPRECATED() || {}, settingsDisableBypassPermissionsMode = settings.permissions?.disableBypassPermissionsMode === "disable", isBypassPermissionsModeAvailable = (permissionMode === "bypassPermissions" || allowDangerouslySkipPermissions) && !settingsDisableBypassPermissionsMode, rulesFromDisk = loadAllPermissionRulesFromDisk(), overlyBroadBashPermissions = [], dangerousPermissions = [], toolPermissionContext = applyPermissionRulesToPermissionContext({
    mode: permissionMode,
    additionalWorkingDirectories,
    alwaysAllowRules: { cliArg: parsedAllowedToolsCli },
    alwaysDenyRules: { cliArg: parsedDisallowedToolsCli },
    alwaysAskRules: {},
    isBypassPermissionsModeAvailable
  }, rulesFromDisk), allAdditionalDirectories = [
    ...settings.permissions?.additionalDirectories || [],
    ...addDirs
  ], validationResults = await Promise.all(allAdditionalDirectories.map((dir) => validateDirectoryForWorkspace(dir, toolPermissionContext)));
  for (let result of validationResults)
    if (result.resultType === "success")
      toolPermissionContext = applyPermissionUpdate(toolPermissionContext, {
        type: "addDirectories",
        directories: [result.absolutePath],
        destination: "cliArg"
      });
    else if (result.resultType !== "alreadyInWorkingDirectory" && result.resultType !== "pathNotFound")
      warnings.push(addDirHelpMessage(result));
  return {
    toolPermissionContext,
    warnings,
    dangerousPermissions,
    overlyBroadBashPermissions
  };
}
function getAutoModeUnavailableNotification(reason) {
  let base2;
  switch (reason) {
    case "settings":
      base2 = "auto mode disabled by settings";
      break;
    case "circuit-breaker":
      base2 = "auto mode is unavailable for your plan";
      break;
    case "model":
      base2 = "auto mode unavailable for this model";
      break;
  }
  return base2;
}
function shouldDisableBypassPermissions() {
  return Promise.resolve(!1);
}
function isAutoModeDisabledBySettings() {
  let settings = getSettings_DEPRECATED() || {};
  return settings.disableAutoMode === "disable" || settings.permissions?.disableAutoMode === "disable";
}
function getAutoModeUnavailableReason() {
  if (isAutoModeDisabledBySettings())
    return "settings";
  if (autoModeStateModule?.isAutoModeCircuitBroken() ?? !1)
    return "circuit-breaker";
  if (!modelSupportsAutoMode(getMainLoopModel()))
    return "model";
  return null;
}
function isBypassPermissionsModeDisabled() {
  return (getSettings_DEPRECATED() || {}).permissions?.disableBypassPermissionsMode === "disable";
}
function createDisabledBypassPermissionsContext(currentContext) {
  let updatedContext = currentContext;
  if (currentContext.mode === "bypassPermissions")
    updatedContext = applyPermissionUpdate(currentContext, {
      type: "setMode",
      mode: "default",
      destination: "session"
    });
  return {
    ...updatedContext,
    isBypassPermissionsModeAvailable: !1
  };
}
async function checkAndDisableBypassPermissions(currentContext) {
  if (!currentContext.isBypassPermissionsModeAvailable)
    return;
  if (!await shouldDisableBypassPermissions())
    return;
  logForDebugging("bypassPermissions mode is being disabled by Statsig gate (async check)", { level: "warn" }), gracefulShutdown(1, "bypass_permissions_disabled");
}
function shouldPlanUseAutoMode() {
  return !1;
}
function prepareContextForPlanMode(context6) {
  let currentMode = context6.mode;
  if (currentMode === "plan")
    return context6;
  return logForDebugging(`[prepareContextForPlanMode] plain plan entry, prePlanMode=${currentMode}`, { level: "info" }), { ...context6, prePlanMode: currentMode };
}
function transitionPlanAutoMode(context6) {
  return context6;
}
var autoModeStateModule = null, NO_CACHED_AUTO_MODE_CONFIG;
var init_permissionSetup = __esm(() => {
  init_state();
  init_cwd2();
  init_envUtils();
  init_constants2();
  init_settings2();
  init_PermissionMode();
  init_permissions2();
  init_permissionsLoader();
  init_validation3();
  init_constants3();
  init_tools2();
  init_fsOperations();
  init_betas2();
  init_debug();
  init_gracefulShutdown();
  init_model();
  init_dangerousPatterns();
  init_PermissionUpdate();
  init_permissionRuleParser();
  NO_CACHED_AUTO_MODE_CONFIG = Symbol("no-cached-auto-mode-config");
});
