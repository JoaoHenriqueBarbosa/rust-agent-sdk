// Original: src/tools/TeamCreateTool/TeamCreateTool.ts
var exports_TeamCreateTool = {};
__export(exports_TeamCreateTool, {
  TeamCreateTool: () => TeamCreateTool
});
function generateUniqueTeamName(providedName) {
  if (!readTeamFile(providedName))
    return providedName;
  return generateWordSlug();
}
var inputSchema35, TeamCreateTool;
var init_TeamCreateTool = __esm(() => {
  init_v4();
  init_state();
  init_Tool();
  init_agentSwarmsEnabled();
  init_cwd2();
  init_model();
  init_slowOperations();
  init_registry();
  init_teamHelpers();
  init_teammateLayoutManager();
  init_tasks();
  init_words();
  inputSchema35 = lazySchema(() => exports_external.strictObject({
    team_name: exports_external.string().describe("Name for the new team to create."),
    description: exports_external.string().optional().describe("Team description/purpose."),
    agent_type: exports_external.string().optional().describe('Type/role of the team lead (e.g., "researcher", "test-runner"). Used for team file and inter-agent coordination.')
  }));
  TeamCreateTool = buildTool({
    name: TEAM_CREATE_TOOL_NAME,
    searchHint: "create a multi-agent swarm team",
    maxResultSizeChars: 1e5,
    shouldDefer: !0,
    userFacingName() {
      return "";
    },
    get inputSchema() {
      return inputSchema35();
    },
    isEnabled() {
      return isAgentSwarmsEnabled();
    },
    toAutoClassifierInput(input) {
      return input.team_name;
    },
    async validateInput(input, _context) {
      if (!input.team_name || input.team_name.trim().length === 0)
        return {
          result: !1,
          message: "team_name is required for TeamCreate",
          errorCode: 9
        };
      return { result: !0 };
    },
    async description() {
      return "Create a new team for coordinating multiple agents";
    },
    async prompt() {
      return getPrompt6();
    },
    mapToolResultToToolResultBlockParam(data, toolUseID) {
      return {
        tool_use_id: toolUseID,
        type: "tool_result",
        content: [
          {
            type: "text",
            text: jsonStringify(data)
          }
        ]
      };
    },
    async call(input, context6) {
      let { setAppState, getAppState } = context6, { team_name, description: _description, agent_type } = input, appState = getAppState(), existingTeam = appState.teamContext?.teamName;
      if (existingTeam)
        throw Error(`Already leading team "${existingTeam}". A leader can only manage one team at a time. Use TeamDelete to end the current team before creating a new one.`);
      let finalTeamName = generateUniqueTeamName(team_name), leadAgentId = formatAgentId(TEAM_LEAD_NAME, finalTeamName), leadAgentType = agent_type || TEAM_LEAD_NAME, leadModel = parseUserSpecifiedModel(appState.mainLoopModelForSession ?? appState.mainLoopModel ?? getDefaultMainLoopModel()), teamFilePath = getTeamFilePath(finalTeamName), teamFile = {
        name: finalTeamName,
        description: _description,
        createdAt: Date.now(),
        leadAgentId,
        leadSessionId: getSessionId(),
        members: [
          {
            agentId: leadAgentId,
            name: TEAM_LEAD_NAME,
            agentType: leadAgentType,
            model: leadModel,
            joinedAt: Date.now(),
            tmuxPaneId: "",
            cwd: getCwd(),
            subscriptions: []
          }
        ]
      };
      await writeTeamFileAsync(finalTeamName, teamFile), registerTeamForSessionCleanup(finalTeamName);
      let taskListId = sanitizeName(finalTeamName);
      return await resetTaskList(taskListId), await ensureTasksDir(taskListId), setLeaderTeamName(sanitizeName(finalTeamName)), setAppState((prev) => ({
        ...prev,
        teamContext: {
          teamName: finalTeamName,
          teamFilePath,
          leadAgentId,
          teammates: {
            [leadAgentId]: {
              name: TEAM_LEAD_NAME,
              agentType: leadAgentType,
              color: assignTeammateColor(leadAgentId),
              tmuxSessionName: "",
              tmuxPaneId: "",
              cwd: getCwd(),
              spawnedAt: Date.now()
            }
          }
        }
      })), logEvent("tengu_team_created", {
        team_name: finalTeamName,
        teammate_count: 1,
        lead_agent_type: leadAgentType,
        teammate_mode: getResolvedTeammateMode()
      }), {
        data: {
          team_name: finalTeamName,
          team_file_path: teamFilePath,
          lead_agent_id: leadAgentId
        }
      };
    },
    renderToolUseMessage: renderToolUseMessage24
  });
});
