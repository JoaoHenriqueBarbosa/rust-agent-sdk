// Original: src/tools/SkillTool/SkillTool.ts
async function getAllCommands(context6) {
  let mcpSkills = context6.getAppState().mcp.commands.filter((cmd) => cmd.type === "prompt" && cmd.loadedFrom === "mcp");
  if (mcpSkills.length === 0)
    return getCommands(getProjectRoot());
  let localCommands = await getCommands(getProjectRoot());
  return uniqBy_default([...localCommands, ...mcpSkills], "name");
}
async function executeForkedSkill(command12, commandName, args, context6, canUseTool, parentMessage, onProgress) {
  let startTime = Date.now(), agentId = createAgentId(), isBuiltIn = builtInCommandNames().has(commandName), isOfficialSkill = isOfficialMarketplaceSkill(command12), isBundled = command12.source === "bundled", forkedSanitizedName = isBuiltIn || isBundled || isOfficialSkill ? commandName : "custom", wasDiscoveredField = {}, pluginMarketplace = command12.pluginInfo ? parsePluginIdentifier(command12.pluginInfo.repository).marketplace : void 0, queryDepth = context6.queryTracking?.depth ?? 0, parentAgentId = getAgentContext()?.agentId;
  logEvent("tengu_skill_tool_invocation", {
    command_name: forkedSanitizedName,
    _PROTO_skill_name: commandName,
    execution_context: "fork",
    invocation_trigger: queryDepth > 0 ? "nested-skill" : "claude-proactive",
    query_depth: queryDepth,
    ...parentAgentId && {
      parent_agent_id: parentAgentId
    },
    ...wasDiscoveredField,
    ...!1,
    ...command12.pluginInfo && {
      _PROTO_plugin_name: command12.pluginInfo.pluginManifest.name,
      ...pluginMarketplace && {
        _PROTO_marketplace_name: pluginMarketplace
      },
      plugin_name: isOfficialSkill ? command12.pluginInfo.pluginManifest.name : "third-party",
      plugin_repository: isOfficialSkill ? command12.pluginInfo.repository : "third-party",
      ...buildPluginCommandTelemetryFields(command12.pluginInfo)
    }
  });
  let { modifiedGetAppState, baseAgent, promptMessages, skillContent } = await prepareForkedCommandContext(command12, args || "", context6), agentDefinition = command12.effort !== void 0 ? { ...baseAgent, effort: command12.effort } : baseAgent, agentMessages = [];
  logForDebugging(`SkillTool executing forked skill ${commandName} with agent ${agentDefinition.agentType}`);
  try {
    for await (let message of runAgent({
      agentDefinition,
      promptMessages,
      toolUseContext: {
        ...context6,
        getAppState: modifiedGetAppState
      },
      canUseTool,
      isAsync: !1,
      querySource: "agent:custom",
      model: command12.model,
      availableTools: context6.options.tools,
      override: { agentId }
    }))
      if (agentMessages.push(message), (message.type === "assistant" || message.type === "user") && onProgress) {
        let normalizedNew = normalizeMessages([message]);
        for (let m4 of normalizedNew)
          if (m4.message.content.some((c3) => c3.type === "tool_use" || c3.type === "tool_result"))
            onProgress({
              toolUseID: `skill_${parentMessage.message.id}`,
              data: {
                message: m4,
                type: "skill_progress",
                prompt: skillContent,
                agentId
              }
            });
      }
    let resultText = extractResultText(agentMessages, "Skill execution completed");
    agentMessages.length = 0;
    let durationMs = Date.now() - startTime;
    return logForDebugging(`SkillTool forked skill ${commandName} completed in ${durationMs}ms`), {
      data: {
        success: !0,
        commandName,
        status: "forked",
        agentId,
        result: resultText
      }
    };
  } finally {
    clearInvokedSkillsForAgent(agentId);
  }
}
function skillHasOnlySafeProperties(command12) {
  for (let key2 of Object.keys(command12)) {
    if (SAFE_SKILL_PROPERTIES.has(key2))
      continue;
    let value = command12[key2];
    if (value === void 0 || value === null)
      continue;
    if (Array.isArray(value) && value.length === 0)
      continue;
    if (typeof value === "object" && !Array.isArray(value) && Object.keys(value).length === 0)
      continue;
    return !1;
  }
  return !0;
}
function isOfficialMarketplaceSkill(command12) {
  if (command12.source !== "plugin" || !command12.pluginInfo?.repository)
    return !1;
  return isOfficialMarketplaceName(parsePluginIdentifier(command12.pluginInfo.repository).marketplace);
}
var inputSchema10, outputSchema7, SkillTool, SAFE_SKILL_PROPERTIES;
var init_SkillTool = __esm(() => {
  init_uniqBy();
  init_state();
  init_commands5();
  init_Tool();
  init_debug();
  init_permissions2();
  init_pluginIdentifier();
  init_pluginTelemetry();
  init_v4();
  init_state();
  init_xml();
  init_agentContext();
  init_errors();
  init_forkedAgent();
  init_frontmatterParser();
  init_messages3();
  init_model();
  init_skillUsageTracking();
  init_uuid();
  init_runAgent();
  init_prompt7();
  init_UI5();
  inputSchema10 = lazySchema(() => exports_external.object({
    skill: exports_external.string().describe('The skill name. E.g., "commit", "review-pr", or "pdf"'),
    args: exports_external.string().optional().describe("Optional arguments for the skill")
  })), outputSchema7 = lazySchema(() => {
    let inlineOutputSchema = exports_external.object({
      success: exports_external.boolean().describe("Whether the skill is valid"),
      commandName: exports_external.string().describe("The name of the skill"),
      allowedTools: exports_external.array(exports_external.string()).optional().describe("Tools allowed by this skill"),
      model: exports_external.string().optional().describe("Model override if specified"),
      status: exports_external.literal("inline").optional().describe("Execution status")
    }), forkedOutputSchema = exports_external.object({
      success: exports_external.boolean().describe("Whether the skill completed successfully"),
      commandName: exports_external.string().describe("The name of the skill"),
      status: exports_external.literal("forked").describe("Execution status"),
      agentId: exports_external.string().describe("The ID of the sub-agent that executed the skill"),
      result: exports_external.string().describe("The result from the forked skill execution")
    });
    return exports_external.union([inlineOutputSchema, forkedOutputSchema]);
  }), SkillTool = buildTool({
    name: SKILL_TOOL_NAME,
    searchHint: "invoke a slash-command skill",
    maxResultSizeChars: 1e5,
    get inputSchema() {
      return inputSchema10();
    },
    get outputSchema() {
      return outputSchema7();
    },
    description: async ({ skill }) => `Execute skill: ${skill}`,
    prompt: async () => getPrompt(getProjectRoot()),
    toAutoClassifierInput: ({ skill }) => skill ?? "",
    async validateInput({ skill }, context6) {
      let trimmed = skill.trim();
      if (!trimmed)
        return {
          result: !1,
          message: `Invalid skill format: ${skill}`,
          errorCode: 1
        };
      let hasLeadingSlash = trimmed.startsWith("/");
      if (hasLeadingSlash)
        logEvent("tengu_skill_tool_slash_prefix", {});
      let normalizedCommandName = hasLeadingSlash ? trimmed.substring(1) : trimmed, commands7 = await getAllCommands(context6), foundCommand = findCommand(normalizedCommandName, commands7);
      if (!foundCommand)
        return {
          result: !1,
          message: `Unknown skill: ${normalizedCommandName}`,
          errorCode: 2
        };
      if (foundCommand.disableModelInvocation)
        return {
          result: !1,
          message: `Skill ${normalizedCommandName} cannot be used with ${SKILL_TOOL_NAME} tool due to disable-model-invocation`,
          errorCode: 4
        };
      if (foundCommand.type !== "prompt")
        return {
          result: !1,
          message: `Skill ${normalizedCommandName} is not a prompt-based skill`,
          errorCode: 5
        };
      return { result: !0 };
    },
    async checkPermissions({ skill, args }, context6) {
      let trimmed = skill.trim(), commandName = trimmed.startsWith("/") ? trimmed.substring(1) : trimmed, permissionContext = context6.getAppState().toolPermissionContext, commands7 = await getAllCommands(context6), commandObj = findCommand(commandName, commands7), ruleMatches = (ruleContent) => {
        let normalizedRule = ruleContent.startsWith("/") ? ruleContent.substring(1) : ruleContent;
        if (normalizedRule === commandName)
          return !0;
        if (normalizedRule.endsWith(":*")) {
          let prefix = normalizedRule.slice(0, -2);
          return commandName.startsWith(prefix);
        }
        return !1;
      }, denyRules = getRuleByContentsForTool(permissionContext, SkillTool, "deny");
      for (let [ruleContent, rule] of denyRules.entries())
        if (ruleMatches(ruleContent))
          return {
            behavior: "deny",
            message: "Skill execution blocked by permission rules",
            decisionReason: {
              type: "rule",
              rule
            }
          };
      let allowRules = getRuleByContentsForTool(permissionContext, SkillTool, "allow");
      for (let [ruleContent, rule] of allowRules.entries())
        if (ruleMatches(ruleContent))
          return {
            behavior: "allow",
            updatedInput: { skill, args },
            decisionReason: {
              type: "rule",
              rule
            }
          };
      if (commandObj?.type === "prompt" && skillHasOnlySafeProperties(commandObj))
        return {
          behavior: "allow",
          updatedInput: { skill, args },
          decisionReason: void 0
        };
      let suggestions = [
        {
          type: "addRules",
          rules: [
            {
              toolName: SKILL_TOOL_NAME,
              ruleContent: commandName
            }
          ],
          behavior: "allow",
          destination: "localSettings"
        },
        {
          type: "addRules",
          rules: [
            {
              toolName: SKILL_TOOL_NAME,
              ruleContent: `${commandName}:*`
            }
          ],
          behavior: "allow",
          destination: "localSettings"
        }
      ];
      return {
        behavior: "ask",
        message: `Execute skill: ${commandName}`,
        decisionReason: void 0,
        suggestions,
        updatedInput: { skill, args },
        metadata: commandObj ? { command: commandObj } : void 0
      };
    },
    async call({ skill, args }, context6, canUseTool, parentMessage, onProgress) {
      let trimmed = skill.trim(), commandName = trimmed.startsWith("/") ? trimmed.substring(1) : trimmed, commands7 = await getAllCommands(context6), command12 = findCommand(commandName, commands7);
      if (recordSkillUsage(commandName), command12?.type === "prompt" && command12.context === "fork")
        return executeForkedSkill(command12, commandName, args, context6, canUseTool, parentMessage, onProgress);
      let { processPromptSlashCommand: processPromptSlashCommand2 } = await Promise.resolve().then(() => (init_processSlashCommand(), exports_processSlashCommand)), processedCommand = await processPromptSlashCommand2(commandName, args || "", commands7, context6);
      if (!processedCommand.shouldQuery)
        throw Error("Command processing failed");
      let allowedTools = processedCommand.allowedTools || [], model = processedCommand.model, effort = command12?.type === "prompt" ? command12.effort : void 0, isBuiltIn = builtInCommandNames().has(commandName), isBundled = command12?.type === "prompt" && command12.source === "bundled", isOfficialSkill = command12?.type === "prompt" && isOfficialMarketplaceSkill(command12), sanitizedCommandName = isBuiltIn || isBundled || isOfficialSkill ? commandName : "custom", wasDiscoveredField = {}, pluginMarketplace = command12?.type === "prompt" && command12.pluginInfo ? parsePluginIdentifier(command12.pluginInfo.repository).marketplace : void 0, queryDepth = context6.queryTracking?.depth ?? 0, parentAgentId = getAgentContext()?.agentId;
      logEvent("tengu_skill_tool_invocation", {
        command_name: sanitizedCommandName,
        _PROTO_skill_name: commandName,
        execution_context: "inline",
        invocation_trigger: queryDepth > 0 ? "nested-skill" : "claude-proactive",
        query_depth: queryDepth,
        ...parentAgentId && {
          parent_agent_id: parentAgentId
        },
        ...wasDiscoveredField,
        ...!1,
        ...command12?.type === "prompt" && command12.pluginInfo && {
          _PROTO_plugin_name: command12.pluginInfo.pluginManifest.name,
          ...pluginMarketplace && {
            _PROTO_marketplace_name: pluginMarketplace
          },
          plugin_name: isOfficialSkill ? command12.pluginInfo.pluginManifest.name : "third-party",
          plugin_repository: isOfficialSkill ? command12.pluginInfo.repository : "third-party",
          ...buildPluginCommandTelemetryFields(command12.pluginInfo)
        }
      });
      let toolUseID = getToolUseIDFromParentMessage(parentMessage, SKILL_TOOL_NAME), newMessages = tagMessagesWithToolUseID(processedCommand.messages.filter((m4) => {
        if (m4.type === "progress")
          return !1;
        if (m4.type === "user" && "message" in m4) {
          let content = m4.message.content;
          if (typeof content === "string" && content.includes(`<${COMMAND_MESSAGE_TAG}>`))
            return !1;
        }
        return !0;
      }), toolUseID);
      return logForDebugging(`SkillTool returning ${newMessages.length} newMessages for skill ${commandName}`), {
        data: {
          success: !0,
          commandName,
          allowedTools: allowedTools.length > 0 ? allowedTools : void 0,
          model
        },
        newMessages,
        contextModifier(ctx) {
          let modifiedContext = ctx;
          if (allowedTools.length > 0) {
            let previousGetAppState = modifiedContext.getAppState;
            modifiedContext = {
              ...modifiedContext,
              getAppState() {
                let appState = previousGetAppState();
                return {
                  ...appState,
                  toolPermissionContext: {
                    ...appState.toolPermissionContext,
                    alwaysAllowRules: {
                      ...appState.toolPermissionContext.alwaysAllowRules,
                      command: [
                        .../* @__PURE__ */ new Set([
                          ...appState.toolPermissionContext.alwaysAllowRules.command || [],
                          ...allowedTools
                        ])
                      ]
                    }
                  }
                };
              }
            };
          }
          if (model)
            modifiedContext = {
              ...modifiedContext,
              options: {
                ...modifiedContext.options,
                mainLoopModel: resolveSkillModelOverride(model, ctx.options.mainLoopModel)
              }
            };
          if (effort !== void 0) {
            let previousGetAppState = modifiedContext.getAppState;
            modifiedContext = {
              ...modifiedContext,
              getAppState() {
                return {
                  ...previousGetAppState(),
                  effortValue: effort
                };
              }
            };
          }
          return modifiedContext;
        }
      };
    },
    mapToolResultToToolResultBlockParam(result, toolUseID) {
      if ("status" in result && result.status === "forked")
        return {
          type: "tool_result",
          tool_use_id: toolUseID,
          content: `Skill "${result.commandName}" completed (forked execution).

Result:
${result.result}`
        };
      return {
        type: "tool_result",
        tool_use_id: toolUseID,
        content: `Launching skill: ${result.commandName}`
      };
    },
    renderToolResultMessage: renderToolResultMessage5,
    renderToolUseMessage: renderToolUseMessage6,
    renderToolUseProgressMessage: renderToolUseProgressMessage4,
    renderToolUseRejectedMessage: renderToolUseRejectedMessage2,
    renderToolUseErrorMessage: renderToolUseErrorMessage2
  }), SAFE_SKILL_PROPERTIES = /* @__PURE__ */ new Set([
    "type",
    "progressMessage",
    "contentLength",
    "argNames",
    "model",
    "effort",
    "source",
    "pluginInfo",
    "disableNonInteractive",
    "skillRoot",
    "context",
    "agent",
    "getPromptForCommand",
    "frontmatterKeys",
    "name",
    "description",
    "hasUserSpecifiedDescription",
    "isEnabled",
    "isHidden",
    "aliases",
    "isMcp",
    "argumentHint",
    "whenToUse",
    "paths",
    "version",
    "disableModelInvocation",
    "userInvocable",
    "loadedFrom",
    "immediate",
    "userFacingName"
  ]);
});
