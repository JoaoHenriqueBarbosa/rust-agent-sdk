// Original: src/tools/shared/spawnMultiAgent.ts
function getDefaultTeammateModel(leaderModel) {
  let configured = getGlobalConfig().teammateDefaultModel;
  if (configured === null)
    return leaderModel ?? getHardcodedTeammateModelFallback();
  if (configured !== void 0)
    return parseUserSpecifiedModel(configured);
  return getHardcodedTeammateModelFallback();
}
function resolveTeammateModel(inputModel, leaderModel) {
  if (inputModel === "inherit")
    return leaderModel ?? getDefaultTeammateModel(leaderModel);
  return inputModel ?? getDefaultTeammateModel(leaderModel);
}
async function hasSession(sessionName) {
  return (await execFileNoThrow(TMUX_COMMAND, [
    "has-session",
    "-t",
    sessionName
  ])).code === 0;
}
async function ensureSession(sessionName) {
  if (!await hasSession(sessionName)) {
    let result = await execFileNoThrow(TMUX_COMMAND, [
      "new-session",
      "-d",
      "-s",
      sessionName
    ]);
    if (result.code !== 0)
      throw Error(`Failed to create tmux session '${sessionName}': ${result.stderr || "Unknown error"}`);
  }
}
function getTeammateCommand2() {
  if (process.env[TEAMMATE_COMMAND_ENV_VAR])
    return process.env[TEAMMATE_COMMAND_ENV_VAR];
  return isInBundledMode() ? process.execPath : process.argv[1];
}
function buildInheritedCliFlags2(options2) {
  let flags = [], { planModeRequired, permissionMode } = options2 || {};
  if (planModeRequired)
    ;
  else if (permissionMode === "bypassPermissions" || getSessionBypassPermissionsMode())
    flags.push("--dangerously-skip-permissions");
  else if (permissionMode === "acceptEdits")
    flags.push("--permission-mode acceptEdits");
  else if (permissionMode === "auto")
    flags.push("--permission-mode auto");
  let modelOverride = getMainLoopModelOverride();
  if (modelOverride)
    flags.push(`--model ${quote([modelOverride])}`);
  let settingsPath = getFlagSettingsPath();
  if (settingsPath)
    flags.push(`--settings ${quote([settingsPath])}`);
  let inlinePlugins = getInlinePlugins();
  for (let pluginDir of inlinePlugins)
    flags.push(`--plugin-dir ${quote([pluginDir])}`);
  let chromeFlagOverride = getChromeFlagOverride();
  if (chromeFlagOverride === !0)
    flags.push("--chrome");
  else if (chromeFlagOverride === !1)
    flags.push("--no-chrome");
  return flags.join(" ");
}
async function generateUniqueTeammateName(baseName, teamName) {
  if (!teamName)
    return baseName;
  let teamFile = await readTeamFileAsync(teamName);
  if (!teamFile)
    return baseName;
  let existingNames = new Set(teamFile.members.map((m4) => m4.name.toLowerCase()));
  if (!existingNames.has(baseName.toLowerCase()))
    return baseName;
  let suffix = 2;
  while (existingNames.has(`${baseName}-${suffix}`.toLowerCase()))
    suffix++;
  return `${baseName}-${suffix}`;
}
async function handleSpawnSplitPane(input, context6) {
  let { setAppState, getAppState } = context6, { name: name3, prompt, agent_type, cwd: cwd2, plan_mode_required } = input, model = resolveTeammateModel(input.model, getAppState().mainLoopModel);
  if (!name3 || !prompt)
    throw Error("name and prompt are required for spawn operation");
  let appState = getAppState(), teamName = input.team_name || appState.teamContext?.teamName;
  if (!teamName)
    throw Error("team_name is required for spawn operation. Either provide team_name in input or call spawnTeam first to establish team context.");
  let uniqueName = await generateUniqueTeammateName(name3, teamName), sanitizedName = sanitizeAgentName(uniqueName), teammateId = formatAgentId(sanitizedName, teamName), workingDir = cwd2 || getCwd(), detectionResult = await detectAndGetBackend();
  if (detectionResult.needsIt2Setup && context6.setToolJSX) {
    let tmuxAvailable2 = await isTmuxAvailable(), setupResult = await new Promise((resolve35) => {
      context6.setToolJSX({
        jsx: import_react82.default.createElement(It2SetupPrompt, {
          onDone: resolve35,
          tmuxAvailable: tmuxAvailable2
        }),
        shouldHidePromptInput: !0
      });
    });
    if (context6.setToolJSX(null), setupResult === "cancelled")
      throw Error("Teammate spawn cancelled - iTerm2 setup required");
    if (setupResult === "installed" || setupResult === "use-tmux")
      resetBackendDetection(), detectionResult = await detectAndGetBackend();
  }
  let insideTmux = await isInsideTmux2(), teammateColor = assignTeammateColor(teammateId), { paneId, isFirstTeammate } = await createTeammatePaneInSwarmView(sanitizedName, teammateColor);
  if (isFirstTeammate && insideTmux)
    await enablePaneBorderStatus();
  let binaryPath = getTeammateCommand2(), teammateArgs = [
    `--agent-id ${quote([teammateId])}`,
    `--agent-name ${quote([sanitizedName])}`,
    `--team-name ${quote([teamName])}`,
    `--agent-color ${quote([teammateColor])}`,
    `--parent-session-id ${quote([getSessionId()])}`,
    plan_mode_required ? "--plan-mode-required" : "",
    agent_type ? `--agent-type ${quote([agent_type])}` : ""
  ].filter(Boolean).join(" "), inheritedFlags = buildInheritedCliFlags2({
    planModeRequired: plan_mode_required,
    permissionMode: appState.toolPermissionContext.mode
  });
  if (model)
    inheritedFlags = inheritedFlags.split(" ").filter((flag, i5, arr) => flag !== "--model" && arr[i5 - 1] !== "--model").join(" "), inheritedFlags = inheritedFlags ? `${inheritedFlags} --model ${quote([model])}` : `--model ${quote([model])}`;
  let flagsStr = inheritedFlags ? ` ${inheritedFlags}` : "", envStr = buildInheritedEnvVars(), spawnCommand = `cd ${quote([workingDir])} && env ${envStr} ${quote([binaryPath])} ${teammateArgs}${flagsStr}`;
  await sendCommandToPane(paneId, spawnCommand, !insideTmux);
  let sessionName = insideTmux ? "current" : SWARM_SESSION_NAME, windowName = insideTmux ? "current" : "swarm-view";
  setAppState((prev) => ({
    ...prev,
    teamContext: {
      ...prev.teamContext,
      teamName: teamName ?? prev.teamContext?.teamName ?? "default",
      teamFilePath: prev.teamContext?.teamFilePath ?? "",
      leadAgentId: prev.teamContext?.leadAgentId ?? "",
      teammates: {
        ...prev.teamContext?.teammates || {},
        [teammateId]: {
          name: sanitizedName,
          agentType: agent_type,
          color: teammateColor,
          tmuxSessionName: sessionName,
          tmuxPaneId: paneId,
          cwd: workingDir,
          spawnedAt: Date.now()
        }
      }
    }
  })), registerOutOfProcessTeammateTask(setAppState, {
    teammateId,
    sanitizedName,
    teamName,
    teammateColor,
    prompt,
    plan_mode_required,
    paneId,
    insideTmux,
    backendType: detectionResult.backend.type,
    toolUseId: context6.toolUseId
  });
  let teamFile = await readTeamFileAsync(teamName);
  if (!teamFile)
    throw Error(`Team "${teamName}" does not exist. Call spawnTeam first to create the team.`);
  return teamFile.members.push({
    agentId: teammateId,
    name: sanitizedName,
    agentType: agent_type,
    model,
    prompt,
    color: teammateColor,
    planModeRequired: plan_mode_required,
    joinedAt: Date.now(),
    tmuxPaneId: paneId,
    cwd: workingDir,
    subscriptions: [],
    backendType: detectionResult.backend.type
  }), await writeTeamFileAsync(teamName, teamFile), await writeToMailbox(sanitizedName, {
    from: TEAM_LEAD_NAME,
    text: prompt,
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  }, teamName), {
    data: {
      teammate_id: teammateId,
      agent_id: teammateId,
      agent_type,
      model,
      name: sanitizedName,
      color: teammateColor,
      tmux_session_name: sessionName,
      tmux_window_name: windowName,
      tmux_pane_id: paneId,
      team_name: teamName,
      is_splitpane: !0,
      plan_mode_required
    }
  };
}
async function handleSpawnSeparateWindow(input, context6) {
  let { setAppState, getAppState } = context6, { name: name3, prompt, agent_type, cwd: cwd2, plan_mode_required } = input, model = resolveTeammateModel(input.model, getAppState().mainLoopModel);
  if (!name3 || !prompt)
    throw Error("name and prompt are required for spawn operation");
  let appState = getAppState(), teamName = input.team_name || appState.teamContext?.teamName;
  if (!teamName)
    throw Error("team_name is required for spawn operation. Either provide team_name in input or call spawnTeam first to establish team context.");
  let uniqueName = await generateUniqueTeammateName(name3, teamName), sanitizedName = sanitizeAgentName(uniqueName), teammateId = formatAgentId(sanitizedName, teamName), windowName = `teammate-${sanitizeName(sanitizedName)}`, workingDir = cwd2 || getCwd();
  await ensureSession(SWARM_SESSION_NAME);
  let teammateColor = assignTeammateColor(teammateId), createWindowResult = await execFileNoThrow(TMUX_COMMAND, [
    "new-window",
    "-t",
    SWARM_SESSION_NAME,
    "-n",
    windowName,
    "-P",
    "-F",
    "#{pane_id}"
  ]);
  if (createWindowResult.code !== 0)
    throw Error(`Failed to create tmux window: ${createWindowResult.stderr}`);
  let paneId = createWindowResult.stdout.trim(), binaryPath = getTeammateCommand2(), teammateArgs = [
    `--agent-id ${quote([teammateId])}`,
    `--agent-name ${quote([sanitizedName])}`,
    `--team-name ${quote([teamName])}`,
    `--agent-color ${quote([teammateColor])}`,
    `--parent-session-id ${quote([getSessionId()])}`,
    plan_mode_required ? "--plan-mode-required" : "",
    agent_type ? `--agent-type ${quote([agent_type])}` : ""
  ].filter(Boolean).join(" "), inheritedFlags = buildInheritedCliFlags2({
    planModeRequired: plan_mode_required,
    permissionMode: appState.toolPermissionContext.mode
  });
  if (model)
    inheritedFlags = inheritedFlags.split(" ").filter((flag, i5, arr) => flag !== "--model" && arr[i5 - 1] !== "--model").join(" "), inheritedFlags = inheritedFlags ? `${inheritedFlags} --model ${quote([model])}` : `--model ${quote([model])}`;
  let flagsStr = inheritedFlags ? ` ${inheritedFlags}` : "", envStr = buildInheritedEnvVars(), spawnCommand = `cd ${quote([workingDir])} && env ${envStr} ${quote([binaryPath])} ${teammateArgs}${flagsStr}`, sendKeysResult = await execFileNoThrow(TMUX_COMMAND, [
    "send-keys",
    "-t",
    `${SWARM_SESSION_NAME}:${windowName}`,
    spawnCommand,
    "Enter"
  ]);
  if (sendKeysResult.code !== 0)
    throw Error(`Failed to send command to tmux window: ${sendKeysResult.stderr}`);
  setAppState((prev) => ({
    ...prev,
    teamContext: {
      ...prev.teamContext,
      teamName: teamName ?? prev.teamContext?.teamName ?? "default",
      teamFilePath: prev.teamContext?.teamFilePath ?? "",
      leadAgentId: prev.teamContext?.leadAgentId ?? "",
      teammates: {
        ...prev.teamContext?.teammates || {},
        [teammateId]: {
          name: sanitizedName,
          agentType: agent_type,
          color: teammateColor,
          tmuxSessionName: SWARM_SESSION_NAME,
          tmuxPaneId: paneId,
          cwd: workingDir,
          spawnedAt: Date.now()
        }
      }
    }
  })), registerOutOfProcessTeammateTask(setAppState, {
    teammateId,
    sanitizedName,
    teamName,
    teammateColor,
    prompt,
    plan_mode_required,
    paneId,
    insideTmux: !1,
    backendType: "tmux",
    toolUseId: context6.toolUseId
  });
  let teamFile = await readTeamFileAsync(teamName);
  if (!teamFile)
    throw Error(`Team "${teamName}" does not exist. Call spawnTeam first to create the team.`);
  return teamFile.members.push({
    agentId: teammateId,
    name: sanitizedName,
    agentType: agent_type,
    model,
    prompt,
    color: teammateColor,
    planModeRequired: plan_mode_required,
    joinedAt: Date.now(),
    tmuxPaneId: paneId,
    cwd: workingDir,
    subscriptions: [],
    backendType: "tmux"
  }), await writeTeamFileAsync(teamName, teamFile), await writeToMailbox(sanitizedName, {
    from: TEAM_LEAD_NAME,
    text: prompt,
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  }, teamName), {
    data: {
      teammate_id: teammateId,
      agent_id: teammateId,
      agent_type,
      model,
      name: sanitizedName,
      color: teammateColor,
      tmux_session_name: SWARM_SESSION_NAME,
      tmux_window_name: windowName,
      tmux_pane_id: paneId,
      team_name: teamName,
      is_splitpane: !1,
      plan_mode_required
    }
  };
}
function registerOutOfProcessTeammateTask(setAppState, {
  teammateId,
  sanitizedName,
  teamName,
  teammateColor,
  prompt,
  plan_mode_required,
  paneId,
  insideTmux,
  backendType,
  toolUseId
}) {
  let taskId = generateTaskId("in_process_teammate"), description = `${sanitizedName}: ${prompt.substring(0, 50)}${prompt.length > 50 ? "..." : ""}`, abortController = new AbortController, taskState = {
    ...createTaskStateBase(taskId, "in_process_teammate", description, toolUseId),
    type: "in_process_teammate",
    status: "running",
    identity: {
      agentId: teammateId,
      agentName: sanitizedName,
      teamName,
      color: teammateColor,
      planModeRequired: plan_mode_required ?? !1,
      parentSessionId: getSessionId()
    },
    prompt,
    abortController,
    awaitingPlanApproval: !1,
    permissionMode: plan_mode_required ? "plan" : "default",
    isIdle: !1,
    shutdownRequested: !1,
    lastReportedToolCount: 0,
    lastReportedTokenCount: 0,
    pendingUserMessages: []
  };
  registerTask(taskState, setAppState), abortController.signal.addEventListener("abort", () => {
    if (isPaneBackend(backendType))
      getBackendByType(backendType).killPane(paneId, !insideTmux);
  }, { once: !0 });
}
async function handleSpawnInProcess(input, context6) {
  let { setAppState, getAppState } = context6, { name: name3, prompt, agent_type, plan_mode_required } = input, model = resolveTeammateModel(input.model, getAppState().mainLoopModel);
  if (!name3 || !prompt)
    throw Error("name and prompt are required for spawn operation");
  let appState = getAppState(), teamName = input.team_name || appState.teamContext?.teamName;
  if (!teamName)
    throw Error("team_name is required for spawn operation. Either provide team_name in input or call spawnTeam first to establish team context.");
  let uniqueName = await generateUniqueTeammateName(name3, teamName), sanitizedName = sanitizeAgentName(uniqueName), teammateId = formatAgentId(sanitizedName, teamName), teammateColor = assignTeammateColor(teammateId), agentDefinition;
  if (agent_type) {
    let foundAgent = context6.options.agentDefinitions.activeAgents.find((a2) => a2.agentType === agent_type);
    if (foundAgent && isCustomAgent(foundAgent))
      agentDefinition = foundAgent;
    logForDebugging(`[handleSpawnInProcess] agent_type=${agent_type}, found=${!!agentDefinition}`);
  }
  let result = await spawnInProcessTeammate({
    name: sanitizedName,
    teamName,
    prompt,
    color: teammateColor,
    planModeRequired: plan_mode_required ?? !1,
    model
  }, context6);
  if (!result.success)
    throw Error(result.error ?? "Failed to spawn in-process teammate");
  if (logForDebugging(`[handleSpawnInProcess] spawn result: taskId=${result.taskId}, hasContext=${!!result.teammateContext}, hasAbort=${!!result.abortController}`), result.taskId && result.teammateContext && result.abortController)
    startInProcessTeammate({
      identity: {
        agentId: teammateId,
        agentName: sanitizedName,
        teamName,
        color: teammateColor,
        planModeRequired: plan_mode_required ?? !1,
        parentSessionId: result.teammateContext.parentSessionId
      },
      taskId: result.taskId,
      prompt,
      description: input.description,
      model,
      agentDefinition,
      teammateContext: result.teammateContext,
      toolUseContext: { ...context6, messages: [] },
      abortController: result.abortController,
      invokingRequestId: input.invokingRequestId
    }), logForDebugging(`[handleSpawnInProcess] Started agent execution for ${teammateId}`);
  setAppState((prev) => {
    let needsLeaderSetup = !prev.teamContext?.leadAgentId, leadAgentId = needsLeaderSetup ? formatAgentId(TEAM_LEAD_NAME, teamName) : prev.teamContext.leadAgentId, existingTeammates = prev.teamContext?.teammates || {}, leadEntry = needsLeaderSetup ? {
      [leadAgentId]: {
        name: TEAM_LEAD_NAME,
        agentType: TEAM_LEAD_NAME,
        color: assignTeammateColor(leadAgentId),
        tmuxSessionName: "in-process",
        tmuxPaneId: "leader",
        cwd: getCwd(),
        spawnedAt: Date.now()
      }
    } : {};
    return {
      ...prev,
      teamContext: {
        ...prev.teamContext,
        teamName: teamName ?? prev.teamContext?.teamName ?? "default",
        teamFilePath: prev.teamContext?.teamFilePath ?? "",
        leadAgentId,
        teammates: {
          ...existingTeammates,
          ...leadEntry,
          [teammateId]: {
            name: sanitizedName,
            agentType: agent_type,
            color: teammateColor,
            tmuxSessionName: "in-process",
            tmuxPaneId: "in-process",
            cwd: getCwd(),
            spawnedAt: Date.now()
          }
        }
      }
    };
  });
  let teamFile = await readTeamFileAsync(teamName);
  if (!teamFile)
    throw Error(`Team "${teamName}" does not exist. Call spawnTeam first to create the team.`);
  return teamFile.members.push({
    agentId: teammateId,
    name: sanitizedName,
    agentType: agent_type,
    model,
    prompt,
    color: teammateColor,
    planModeRequired: plan_mode_required,
    joinedAt: Date.now(),
    tmuxPaneId: "in-process",
    cwd: getCwd(),
    subscriptions: [],
    backendType: "in-process"
  }), await writeTeamFileAsync(teamName, teamFile), {
    data: {
      teammate_id: teammateId,
      agent_id: teammateId,
      agent_type,
      model,
      name: sanitizedName,
      color: teammateColor,
      tmux_session_name: "in-process",
      tmux_window_name: "in-process",
      tmux_pane_id: "in-process",
      team_name: teamName,
      is_splitpane: !1,
      plan_mode_required
    }
  };
}
async function handleSpawn(input, context6) {
  if (isInProcessEnabled())
    return handleSpawnInProcess(input, context6);
  try {
    await detectAndGetBackend();
  } catch (error44) {
    if (getTeammateModeFromSnapshot() !== "auto")
      throw error44;
    return logForDebugging(`[handleSpawn] No pane backend available, falling back to in-process: ${errorMessage(error44)}`), markInProcessFallback(), handleSpawnInProcess(input, context6);
  }
  if (input.use_splitpane !== !1)
    return handleSpawnSplitPane(input, context6);
  return handleSpawnSeparateWindow(input, context6);
}
async function spawnTeammate(config10, context6) {
  return handleSpawn(config10, context6);
}
var import_react82;
var init_spawnMultiAgent = __esm(() => {
  init_state();
  init_Task();
  init_shellQuote();
  init_config4();
  init_cwd2();
  init_debug();
  init_errors();
  init_execFileNoThrow();
  init_model();
  init_detection();
  init_registry();
  init_teammateModeSnapshot();
  init_It2SetupPrompt();
  init_inProcessRunner();
  init_spawnInProcess();
  init_spawnUtils();
  init_teamHelpers();
  init_teammateLayoutManager();
  init_teammateModel();
  init_framework();
  init_teammateMailbox();
  init_loadAgentsDir();
  import_react82 = __toESM(require_react_development(), 1);
});
