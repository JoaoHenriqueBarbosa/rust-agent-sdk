// Original: src/utils/permissions/permissions.ts
function permissionRuleSourceDisplayString(source) {
  return getSettingSourceDisplayNameLowercase(source);
}
function getAllowRules(context6) {
  return PERMISSION_RULE_SOURCES.flatMap((source) => (context6.alwaysAllowRules[source] || []).map((ruleString) => ({
    source,
    ruleBehavior: "allow",
    ruleValue: permissionRuleValueFromString(ruleString)
  })));
}
function createPermissionRequestMessage2(toolName, decisionReason) {
  if (decisionReason) {
    if (decisionReason.type === "classifier")
      return `Classifier '${decisionReason.classifier}' requires approval for this ${toolName} command: ${decisionReason.reason}`;
    switch (decisionReason.type) {
      case "hook":
        return decisionReason.reason ? `Hook '${decisionReason.hookName}' blocked this action: ${decisionReason.reason}` : `Hook '${decisionReason.hookName}' requires approval for this ${toolName} command`;
      case "rule": {
        let ruleString = permissionRuleValueToString(decisionReason.rule.ruleValue), sourceString = permissionRuleSourceDisplayString(decisionReason.rule.source);
        return `Permission rule '${ruleString}' from ${sourceString} requires approval for this ${toolName} command`;
      }
      case "subcommandResults": {
        let needsApproval = [];
        for (let [cmd, result] of decisionReason.reasons)
          if (result.behavior === "ask" || result.behavior === "passthrough")
            if (toolName === "Bash") {
              let { commandWithoutRedirections, redirections } = extractOutputRedirections(cmd), displayCmd = redirections.length > 0 ? commandWithoutRedirections : cmd;
              needsApproval.push(displayCmd);
            } else
              needsApproval.push(cmd);
        if (needsApproval.length > 0) {
          let n5 = needsApproval.length;
          return `This ${toolName} command contains multiple operations. The following ${plural(n5, "part")} ${plural(n5, "requires", "require")} approval: ${needsApproval.join(", ")}`;
        }
        return `This ${toolName} command contains multiple operations that require approval`;
      }
      case "permissionPromptTool":
        return `Tool '${decisionReason.permissionPromptToolName}' requires approval for this ${toolName} command`;
      case "sandboxOverride":
        return "Run outside of the sandbox";
      case "workingDir":
        return decisionReason.reason;
      case "safetyCheck":
      case "other":
        return decisionReason.reason;
      case "mode":
        return `Current permission mode (${permissionModeTitle(decisionReason.mode)}) requires approval for this ${toolName} command`;
      case "asyncAgent":
        return decisionReason.reason;
    }
  }
  return `Claude requested permissions to use ${toolName}, but you haven't granted it yet.`;
}
function getDenyRules(context6) {
  return PERMISSION_RULE_SOURCES.flatMap((source) => (context6.alwaysDenyRules[source] || []).map((ruleString) => ({
    source,
    ruleBehavior: "deny",
    ruleValue: permissionRuleValueFromString(ruleString)
  })));
}
function getAskRules(context6) {
  return PERMISSION_RULE_SOURCES.flatMap((source) => (context6.alwaysAskRules[source] || []).map((ruleString) => ({
    source,
    ruleBehavior: "ask",
    ruleValue: permissionRuleValueFromString(ruleString)
  })));
}
function toolMatchesRule(tool, rule) {
  if (rule.ruleValue.ruleContent !== void 0)
    return !1;
  let nameForRuleMatch = getToolNameForPermissionCheck(tool);
  if (rule.ruleValue.toolName === nameForRuleMatch)
    return !0;
  let ruleInfo = mcpInfoFromString(rule.ruleValue.toolName), toolInfo = mcpInfoFromString(nameForRuleMatch);
  return ruleInfo !== null && toolInfo !== null && (ruleInfo.toolName === void 0 || ruleInfo.toolName === "*") && ruleInfo.serverName === toolInfo.serverName;
}
function toolAlwaysAllowedRule(context6, tool) {
  return getAllowRules(context6).find((rule) => toolMatchesRule(tool, rule)) || null;
}
function getDenyRuleForTool(context6, tool) {
  return getDenyRules(context6).find((rule) => toolMatchesRule(tool, rule)) || null;
}
function getAskRuleForTool(context6, tool) {
  return getAskRules(context6).find((rule) => toolMatchesRule(tool, rule)) || null;
}
function getDenyRuleForAgent(context6, agentToolName, agentType) {
  return getDenyRules(context6).find((rule) => rule.ruleValue.toolName === agentToolName && rule.ruleValue.ruleContent === agentType) || null;
}
function filterDeniedAgents(agents, context6, agentToolName) {
  let deniedAgentTypes = /* @__PURE__ */ new Set;
  for (let rule of getDenyRules(context6))
    if (rule.ruleValue.toolName === agentToolName && rule.ruleValue.ruleContent !== void 0)
      deniedAgentTypes.add(rule.ruleValue.ruleContent);
  return agents.filter((agent) => !deniedAgentTypes.has(agent.agentType));
}
function getRuleByContentsForTool(context6, tool, behavior) {
  return getRuleByContentsForToolName(context6, getToolNameForPermissionCheck(tool), behavior);
}
function getRuleByContentsForToolName(context6, toolName, behavior) {
  let ruleByContents = /* @__PURE__ */ new Map, rules2 = [];
  switch (behavior) {
    case "allow":
      rules2 = getAllowRules(context6);
      break;
    case "deny":
      rules2 = getDenyRules(context6);
      break;
    case "ask":
      rules2 = getAskRules(context6);
      break;
  }
  for (let rule of rules2)
    if (rule.ruleValue.toolName === toolName && rule.ruleValue.ruleContent !== void 0 && rule.ruleBehavior === behavior)
      ruleByContents.set(rule.ruleValue.ruleContent, rule);
  return ruleByContents;
}
async function runPermissionRequestHooksForHeadlessAgent(tool, input, toolUseID, context6, permissionMode, suggestions) {
  try {
    for await (let hookResult of executePermissionRequestHooks(tool.name, toolUseID, input, context6, permissionMode, suggestions, context6.abortController.signal)) {
      if (!hookResult.permissionRequestResult)
        continue;
      let decision = hookResult.permissionRequestResult;
      if (decision.behavior === "allow") {
        let finalInput = decision.updatedInput ?? input;
        if (decision.updatedPermissions?.length)
          persistPermissionUpdates(decision.updatedPermissions), context6.setAppState((prev) => ({
            ...prev,
            toolPermissionContext: applyPermissionUpdates(prev.toolPermissionContext, decision.updatedPermissions)
          }));
        return {
          behavior: "allow",
          updatedInput: finalInput,
          decisionReason: {
            type: "hook",
            hookName: "PermissionRequest"
          }
        };
      }
      if (decision.behavior === "deny") {
        if (decision.interrupt)
          logForDebugging(`Hook interrupt: tool=${tool.name} hookMessage=${decision.message}`), context6.abortController.abort();
        return {
          behavior: "deny",
          message: decision.message || "Permission denied by hook",
          decisionReason: {
            type: "hook",
            hookName: "PermissionRequest",
            reason: decision.message
          }
        };
      }
    }
  } catch (error44) {
    logError2(Error("PermissionRequest hook failed for headless agent", {
      cause: toError(error44)
    }));
  }
  return null;
}
async function checkRuleBasedPermissions(tool, input, context6) {
  let appState = context6.getAppState(), denyRule = getDenyRuleForTool(appState.toolPermissionContext, tool);
  if (denyRule)
    return {
      behavior: "deny",
      decisionReason: {
        type: "rule",
        rule: denyRule
      },
      message: `Permission to use ${tool.name} has been denied.`
    };
  let askRule = getAskRuleForTool(appState.toolPermissionContext, tool);
  if (askRule) {
    if (!(tool.name === BASH_TOOL_NAME && SandboxManager2.isSandboxingEnabled() && SandboxManager2.isAutoAllowBashIfSandboxedEnabled() && shouldUseSandbox(input)))
      return {
        behavior: "ask",
        decisionReason: {
          type: "rule",
          rule: askRule
        },
        message: createPermissionRequestMessage2(tool.name)
      };
  }
  let toolPermissionResult = {
    behavior: "passthrough",
    message: createPermissionRequestMessage2(tool.name)
  };
  try {
    let parsedInput = tool.inputSchema.parse(input);
    toolPermissionResult = await tool.checkPermissions(parsedInput, context6);
  } catch (e) {
    if (e instanceof AbortError || e instanceof APIUserAbortError)
      throw e;
    logError2(e);
  }
  if (toolPermissionResult?.behavior === "deny")
    return toolPermissionResult;
  if (toolPermissionResult?.behavior === "ask" && toolPermissionResult.decisionReason?.type === "rule" && toolPermissionResult.decisionReason.rule.ruleBehavior === "ask")
    return toolPermissionResult;
  if (toolPermissionResult?.behavior === "ask" && toolPermissionResult.decisionReason?.type === "safetyCheck")
    return toolPermissionResult;
  return null;
}
async function hasPermissionsToUseToolInner(tool, input, context6) {
  if (context6.abortController.signal.aborted)
    throw new AbortError;
  let appState = context6.getAppState(), denyRule = getDenyRuleForTool(appState.toolPermissionContext, tool);
  if (denyRule)
    return {
      behavior: "deny",
      decisionReason: {
        type: "rule",
        rule: denyRule
      },
      message: `Permission to use ${tool.name} has been denied.`
    };
  let askRule = getAskRuleForTool(appState.toolPermissionContext, tool);
  if (askRule) {
    if (!(tool.name === BASH_TOOL_NAME && SandboxManager2.isSandboxingEnabled() && SandboxManager2.isAutoAllowBashIfSandboxedEnabled() && shouldUseSandbox(input)))
      return {
        behavior: "ask",
        decisionReason: {
          type: "rule",
          rule: askRule
        },
        message: createPermissionRequestMessage2(tool.name)
      };
  }
  let toolPermissionResult = {
    behavior: "passthrough",
    message: createPermissionRequestMessage2(tool.name)
  };
  try {
    let parsedInput = tool.inputSchema.parse(input);
    toolPermissionResult = await tool.checkPermissions(parsedInput, context6);
  } catch (e) {
    if (e instanceof AbortError || e instanceof APIUserAbortError)
      throw e;
    logError2(e);
  }
  if (toolPermissionResult?.behavior === "deny")
    return toolPermissionResult;
  if (tool.requiresUserInteraction?.() && toolPermissionResult?.behavior === "ask")
    return toolPermissionResult;
  if (toolPermissionResult?.behavior === "ask" && toolPermissionResult.decisionReason?.type === "rule" && toolPermissionResult.decisionReason.rule.ruleBehavior === "ask")
    return toolPermissionResult;
  if (toolPermissionResult?.behavior === "ask" && toolPermissionResult.decisionReason?.type === "safetyCheck")
    return toolPermissionResult;
  if (appState = context6.getAppState(), appState.toolPermissionContext.mode === "bypassPermissions" || appState.toolPermissionContext.mode === "plan" && appState.toolPermissionContext.isBypassPermissionsModeAvailable)
    return {
      behavior: "allow",
      updatedInput: getUpdatedInputOrFallback(toolPermissionResult, input),
      decisionReason: {
        type: "mode",
        mode: appState.toolPermissionContext.mode
      }
    };
  let alwaysAllowedRule = toolAlwaysAllowedRule(appState.toolPermissionContext, tool);
  if (alwaysAllowedRule)
    return {
      behavior: "allow",
      updatedInput: getUpdatedInputOrFallback(toolPermissionResult, input),
      decisionReason: {
        type: "rule",
        rule: alwaysAllowedRule
      }
    };
  let result = toolPermissionResult.behavior === "passthrough" ? {
    ...toolPermissionResult,
    behavior: "ask",
    message: createPermissionRequestMessage2(tool.name, toolPermissionResult.decisionReason)
  } : toolPermissionResult;
  if (result.behavior === "ask" && result.suggestions)
    logForDebugging(`Permission suggestions for ${tool.name}: ${jsonStringify(result.suggestions, null, 2)}`);
  return result;
}
async function deletePermissionRule({
  rule,
  initialContext,
  setToolPermissionContext
}) {
  if (rule.source === "policySettings" || rule.source === "flagSettings" || rule.source === "command")
    throw Error("Cannot delete permission rules from read-only settings");
  let updatedContext = applyPermissionUpdate(initialContext, {
    type: "removeRules",
    rules: [rule.ruleValue],
    behavior: rule.ruleBehavior,
    destination: rule.source
  });
  switch (rule.source) {
    case "localSettings":
    case "userSettings":
    case "projectSettings": {
      deletePermissionRuleFromSettings(rule);
      break;
    }
    case "cliArg":
    case "session":
      break;
  }
  setToolPermissionContext(updatedContext);
}
function convertRulesToUpdates(rules2, updateType) {
  let grouped = /* @__PURE__ */ new Map;
  for (let rule of rules2) {
    let key3 = `${rule.source}:${rule.ruleBehavior}`;
    if (!grouped.has(key3))
      grouped.set(key3, []);
    grouped.get(key3).push(rule.ruleValue);
  }
  let updates = [];
  for (let [key3, ruleValues] of grouped) {
    let [source, behavior] = key3.split(":");
    updates.push({
      type: updateType,
      rules: ruleValues,
      behavior,
      destination: source
    });
  }
  return updates;
}
function applyPermissionRulesToPermissionContext(toolPermissionContext, rules2) {
  let updates = convertRulesToUpdates(rules2, "addRules");
  return applyPermissionUpdates(toolPermissionContext, updates);
}
function syncPermissionRulesFromDisk(toolPermissionContext, rules2) {
  let context6 = toolPermissionContext;
  if (shouldAllowManagedPermissionRulesOnly()) {
    let sourcesToClear = [
      "userSettings",
      "projectSettings",
      "localSettings",
      "cliArg",
      "session"
    ], behaviors = ["allow", "deny", "ask"];
    for (let source of sourcesToClear)
      for (let behavior of behaviors)
        context6 = applyPermissionUpdate(context6, {
          type: "replaceRules",
          rules: [],
          behavior,
          destination: source
        });
  }
  let diskSources = [
    "userSettings",
    "projectSettings",
    "localSettings"
  ];
  for (let diskSource of diskSources)
    for (let behavior of ["allow", "deny", "ask"])
      context6 = applyPermissionUpdate(context6, {
        type: "replaceRules",
        rules: [],
        behavior,
        destination: diskSource
      });
  let updates = convertRulesToUpdates(rules2, "replaceRules");
  return applyPermissionUpdates(context6, updates);
}
function getUpdatedInputOrFallback(permissionResult, fallback) {
  return ("updatedInput" in permissionResult ? permissionResult.updatedInput : void 0) ?? fallback;
}
var PERMISSION_RULE_SOURCES, hasPermissionsToUseTool = async (tool, input, context6, assistantMessage, toolUseID) => {
  let result = await hasPermissionsToUseToolInner(tool, input, context6);
  if (result.behavior === "allow") {
    let appState = context6.getAppState();
    return result;
  }
  if (result.behavior === "ask") {
    let appState = context6.getAppState();
    if (appState.toolPermissionContext.mode === "dontAsk")
      return {
        behavior: "deny",
        decisionReason: {
          type: "mode",
          mode: "dontAsk"
        },
        message: DONT_ASK_REJECT_MESSAGE(tool.name)
      };
    if (appState.toolPermissionContext.shouldAvoidPermissionPrompts) {
      let hookDecision = await runPermissionRequestHooksForHeadlessAgent(tool, input, toolUseID, context6, appState.toolPermissionContext.mode, result.suggestions);
      if (hookDecision)
        return hookDecision;
      return {
        behavior: "deny",
        decisionReason: {
          type: "asyncAgent",
          reason: "Permission prompts are not available in this context"
        },
        message: AUTO_REJECT_MESSAGE(tool.name)
      };
    }
  }
  return result;
};
var init_permissions2 = __esm(() => {
  init_sdk();
  init_mcpStringUtils();
  init_constants3();
  init_shouldUseSandbox();
  init_constants9();
  init_commands4();
  init_debug();
  init_errors();
  init_log3();
  init_sandbox_adapter();
  init_constants2();
  init_PermissionMode();
  init_PermissionUpdate();
  init_permissionRuleParser();
  init_permissionsLoader();
  init_state();
  init_metadata();
  init_classifierApprovals();
  init_envUtils();
  init_hooks5();
  init_messages3();
  init_modelCost();
  init_slowOperations();
  init_denialTracking();
  init_yoloClassifier();
  PERMISSION_RULE_SOURCES = [
    ...SETTING_SOURCES,
    "cliArg",
    "command",
    "session"
  ];
});
