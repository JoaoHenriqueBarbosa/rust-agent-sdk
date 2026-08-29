// function: executeForkedSlashCommand
async function executeForkedSlashCommand(command12, args, context6, precedingInputBlocks, setToolJSX, canUseTool) {
  let agentId = createAgentId(), pluginMarketplace = command12.pluginInfo ? parsePluginIdentifier(command12.pluginInfo.repository).marketplace : void 0;
  logEvent("tengu_slash_command_forked", {
    command_name: command12.name,
    invocation_trigger: "user-slash",
    ...command12.pluginInfo && {
      _PROTO_plugin_name: command12.pluginInfo.pluginManifest.name,
      ...pluginMarketplace && {
        _PROTO_marketplace_name: pluginMarketplace
      },
      ...buildPluginCommandTelemetryFields(command12.pluginInfo)
    }
  });
  let {
    skillContent,
    modifiedGetAppState,
    baseAgent,
    promptMessages
  } = await prepareForkedCommandContext(command12, args, context6), agentDefinition = command12.effort !== void 0 ? {
    ...baseAgent,
    effort: command12.effort
  } : baseAgent;
  logForDebugging(`Executing forked slash command /${command12.name} with agent ${agentDefinition.agentType}`);
  let agentMessages = [], progressMessages = [], parentToolUseID = `forked-command-${command12.name}`, toolUseCounter = 0, createProgressMessage = (message) => {
    return toolUseCounter++, {
      type: "progress",
      data: {
        message,
        type: "agent_progress",
        prompt: skillContent,
        agentId
      },
      parentToolUseID,
      toolUseID: `${parentToolUseID}-${toolUseCounter}`,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      uuid: randomUUID9()
    };
  }, updateProgress = () => {
    setToolJSX({
      jsx: renderToolUseProgressMessage3(progressMessages, {
        tools: context6.options.tools,
        verbose: !1
      }),
      shouldHidePromptInput: !1,
      shouldContinueAnimation: !0,
      showSpinner: !0
    });
  };
  updateProgress();
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
      availableTools: context6.options.tools
    })) {
      agentMessages.push(message);
      let normalizedNew = normalizeMessages([message]);
      if (message.type === "assistant") {
        let contentLength = getAssistantMessageContentLength(message);
        if (contentLength > 0)
          context6.setResponseLength((len) => len + contentLength);
        let normalizedMsg = normalizedNew[0];
        if (normalizedMsg && normalizedMsg.type === "assistant")
          progressMessages.push(createProgressMessage(message)), updateProgress();
      }
      if (message.type === "user") {
        let normalizedMsg = normalizedNew[0];
        if (normalizedMsg && normalizedMsg.type === "user")
          progressMessages.push(createProgressMessage(normalizedMsg)), updateProgress();
      }
    }
  } finally {
    setToolJSX(null);
  }
  let resultText = extractResultText(agentMessages, "Command completed");
  return logForDebugging(`Forked slash command /${command12.name} completed with agent ${agentId}`), {
    messages: [createUserMessage({
      content: prepareUserContent({
        inputString: `/${getCommandName(command12)} ${args}`.trim(),
        precedingInputBlocks
      })
    }), createUserMessage({
      content: `<local-command-stdout>
${resultText}
</local-command-stdout>`
    })],
    shouldQuery: !1,
    command: command12,
    resultText
  };
}
