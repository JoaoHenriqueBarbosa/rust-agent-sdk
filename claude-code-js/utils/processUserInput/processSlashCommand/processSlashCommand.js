// function: processSlashCommand
async function processSlashCommand(inputString, precedingInputBlocks, imageContentBlocks, attachmentMessages, context6, setToolJSX, uuid8, isAlreadyProcessing, canUseTool) {
  let parsed = parseSlashCommand(inputString);
  if (!parsed) {
    logEvent("tengu_input_slash_missing", {});
    let errorMessage2 = "Commands are in the form `/command [args]`";
    return {
      messages: [createSyntheticUserCaveatMessage(), ...attachmentMessages, createUserMessage({
        content: prepareUserContent({
          inputString: errorMessage2,
          precedingInputBlocks
        })
      })],
      shouldQuery: !1,
      resultText: errorMessage2
    };
  }
  let {
    commandName,
    args: parsedArgs,
    isMcp
  } = parsed, sanitizedCommandName = isMcp ? "mcp" : !builtInCommandNames().has(commandName) ? "custom" : commandName;
  if (!hasCommand(commandName, context6.options.commands)) {
    let isFilePath = !1;
    try {
      await getFsImplementation().stat(`/${commandName}`), isFilePath = !0;
    } catch {}
    if (looksLikeCommand(commandName) && !isFilePath) {
      logEvent("tengu_input_slash_invalid", {
        input: commandName
      });
      let unknownMessage = `Unknown skill: ${commandName}`;
      return {
        messages: [
          createSyntheticUserCaveatMessage(),
          ...attachmentMessages,
          createUserMessage({
            content: prepareUserContent({
              inputString: unknownMessage,
              precedingInputBlocks
            })
          }),
          ...parsedArgs ? [createSystemMessage(`Args from unknown skill: ${parsedArgs}`, "warning")] : []
        ],
        shouldQuery: !1,
        resultText: unknownMessage
      };
    }
    let promptId = randomUUID9();
    return setPromptId(promptId), logEvent("tengu_input_prompt", {}), logOTelEvent("user_prompt", {
      prompt_length: String(inputString.length),
      prompt: redactIfDisabled(inputString),
      "prompt.id": promptId
    }), {
      messages: [createUserMessage({
        content: prepareUserContent({
          inputString,
          precedingInputBlocks
        }),
        uuid: uuid8
      }), ...attachmentMessages],
      shouldQuery: !0
    };
  }
  let {
    messages: newMessages,
    shouldQuery: messageShouldQuery,
    allowedTools,
    model,
    effort,
    command: returnedCommand,
    resultText,
    nextInput,
    submitNextInput
  } = await getMessagesForSlashCommand(commandName, parsedArgs, setToolJSX, context6, precedingInputBlocks, imageContentBlocks, isAlreadyProcessing, canUseTool, uuid8);
  if (newMessages.length === 0) {
    let eventData2 = {
      input: sanitizedCommandName
    };
    if (returnedCommand.type === "prompt" && returnedCommand.pluginInfo) {
      let {
        pluginManifest,
        repository
      } = returnedCommand.pluginInfo, {
        marketplace
      } = parsePluginIdentifier(repository), isOfficial = isOfficialMarketplaceName(marketplace);
      if (eventData2._PROTO_plugin_name = pluginManifest.name, marketplace)
        eventData2._PROTO_marketplace_name = marketplace;
      if (eventData2.plugin_repository = isOfficial ? repository : "third-party", eventData2.plugin_name = isOfficial ? pluginManifest.name : "third-party", isOfficial && pluginManifest.version)
        eventData2.plugin_version = pluginManifest.version;
      Object.assign(eventData2, buildPluginCommandTelemetryFields(returnedCommand.pluginInfo));
    }
    return logEvent("tengu_input_command", {
      ...eventData2,
      invocation_trigger: "user-slash",
      ...!1
    }), {
      messages: [],
      shouldQuery: !1,
      model,
      nextInput,
      submitNextInput
    };
  }
  if (newMessages.length === 2 && newMessages[1].type === "user" && typeof newMessages[1].message.content === "string" && newMessages[1].message.content.startsWith("Unknown command:")) {
    if (!(inputString.startsWith("/var") || inputString.startsWith("/tmp") || inputString.startsWith("/private")))
      logEvent("tengu_input_slash_invalid", {
        input: commandName
      });
    return {
      messages: [createSyntheticUserCaveatMessage(), ...newMessages],
      shouldQuery: messageShouldQuery,
      allowedTools,
      model
    };
  }
  let eventData = {
    input: sanitizedCommandName
  };
  if (returnedCommand.type === "prompt" && returnedCommand.pluginInfo) {
    let {
      pluginManifest,
      repository
    } = returnedCommand.pluginInfo, {
      marketplace
    } = parsePluginIdentifier(repository), isOfficial = isOfficialMarketplaceName(marketplace);
    if (eventData._PROTO_plugin_name = pluginManifest.name, marketplace)
      eventData._PROTO_marketplace_name = marketplace;
    if (eventData.plugin_repository = isOfficial ? repository : "third-party", eventData.plugin_name = isOfficial ? pluginManifest.name : "third-party", isOfficial && pluginManifest.version)
      eventData.plugin_version = pluginManifest.version;
    Object.assign(eventData, buildPluginCommandTelemetryFields(returnedCommand.pluginInfo));
  }
  logEvent("tengu_input_command", {
    ...eventData,
    invocation_trigger: "user-slash",
    ...!1
  });
  let isCompactResult = newMessages.length > 0 && newMessages[0] && isCompactBoundaryMessage(newMessages[0]);
  return {
    messages: messageShouldQuery || newMessages.every(isSystemLocalCommandMessage) || isCompactResult ? newMessages : [createSyntheticUserCaveatMessage(), ...newMessages],
    shouldQuery: messageShouldQuery,
    allowedTools,
    model,
    effort,
    resultText,
    nextInput,
    submitNextInput
  };
}
