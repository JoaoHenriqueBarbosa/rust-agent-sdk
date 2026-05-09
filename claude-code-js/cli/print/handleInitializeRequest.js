// function: handleInitializeRequest
async function handleInitializeRequest(request2, requestId, initialized6, output, commands7, modelInfos, structuredIO, enableAuthStatus, options2, agents2, getAppState) {
  if (initialized6) {
    output.enqueue({
      type: "control_response",
      response: {
        subtype: "error",
        error: "Already initialized",
        request_id: requestId,
        pending_permission_requests: structuredIO.getPendingPermissionRequests()
      }
    });
    return;
  }
  if (request2.systemPrompt !== void 0)
    options2.systemPrompt = request2.systemPrompt;
  if (request2.appendSystemPrompt !== void 0)
    options2.appendSystemPrompt = request2.appendSystemPrompt;
  if (request2.promptSuggestions !== void 0)
    options2.promptSuggestions = request2.promptSuggestions;
  if (request2.agents) {
    let stdinAgents = parseAgentsFromJson(request2.agents, "flagSettings");
    agents2.push(...stdinAgents);
  }
  if (options2.agent) {
    let alreadyResolved = getMainThreadAgentType() === options2.agent, mainThreadAgent = agents2.find((a2) => a2.agentType === options2.agent);
    if (mainThreadAgent && !alreadyResolved) {
      if (setMainThreadAgentType(mainThreadAgent.agentType), !options2.systemPrompt && !isBuiltInAgent(mainThreadAgent)) {
        let agentSystemPrompt = mainThreadAgent.getSystemPrompt();
        if (agentSystemPrompt)
          options2.systemPrompt = agentSystemPrompt;
      }
      if (!options2.userSpecifiedModel && mainThreadAgent.model && mainThreadAgent.model !== "inherit") {
        let agentModel = parseUserSpecifiedModel(mainThreadAgent.model);
        setMainLoopModelOverride(agentModel);
      }
      if (mainThreadAgent.initialPrompt)
        structuredIO.prependUserMessage(mainThreadAgent.initialPrompt);
    } else if (mainThreadAgent?.initialPrompt)
      structuredIO.prependUserMessage(mainThreadAgent.initialPrompt);
  }
  let outputStyle2 = getSettings_DEPRECATED()?.outputStyle || DEFAULT_OUTPUT_STYLE_NAME, availableOutputStyles = await getAllOutputStyles(getCwd()), accountInfo = getAccountInformation();
  if (request2.hooks) {
    let hooks2 = {};
    for (let [event, matchers] of Object.entries(request2.hooks))
      hooks2[event] = matchers.map((matcher) => {
        let callbacks = matcher.hookCallbackIds.map((callbackId) => {
          return structuredIO.createHookCallback(callbackId, matcher.timeout);
        });
        return {
          matcher: matcher.matcher,
          hooks: callbacks
        };
      });
    registerHookCallbacks(hooks2);
  }
  if (request2.jsonSchema)
    setInitJsonSchema(request2.jsonSchema);
  let initResponse = {
    commands: commands7.filter((cmd) => cmd.userInvocable !== !1).map((cmd) => ({
      name: getCommandName(cmd),
      description: formatDescriptionWithSource(cmd),
      argumentHint: cmd.argumentHint || ""
    })),
    agents: agents2.map((agent) => ({
      name: agent.agentType,
      description: agent.whenToUse,
      model: agent.model === "inherit" ? void 0 : agent.model
    })),
    output_style: outputStyle2,
    available_output_styles: Object.keys(availableOutputStyles),
    models: modelInfos,
    account: {
      email: accountInfo?.email,
      organization: accountInfo?.organization,
      subscriptionType: accountInfo?.subscription,
      tokenSource: accountInfo?.tokenSource,
      apiKeySource: accountInfo?.apiKeySource,
      apiProvider: getAPIProvider()
    },
    pid: process.pid
  };
  if (isFastModeEnabled() && isFastModeAvailable()) {
    let appState = getAppState();
    initResponse.fast_mode_state = getFastModeState(options2.userSpecifiedModel ?? null, appState.fastMode);
  }
  if (output.enqueue({
    type: "control_response",
    response: {
      subtype: "success",
      request_id: requestId,
      response: initResponse
    }
  }), enableAuthStatus) {
    let status2 = AwsAuthStatusManager.getInstance().getStatus();
    if (status2)
      output.enqueue({
        type: "auth_status",
        isAuthenticating: status2.isAuthenticating,
        output: status2.output,
        error: status2.error,
        uuid: randomUUID48(),
        session_id: getSessionId()
      });
  }
}
