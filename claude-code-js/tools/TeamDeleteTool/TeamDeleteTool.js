// Original: src/tools/TeamDeleteTool/TeamDeleteTool.ts
var exports_TeamDeleteTool = {};
__export(exports_TeamDeleteTool, {
  TeamDeleteTool: () => TeamDeleteTool
});
var inputSchema36, TeamDeleteTool;
var init_TeamDeleteTool = __esm(() => {
  init_v4();
  init_Tool();
  init_agentSwarmsEnabled();
  init_slowOperations();
  init_teamHelpers();
  init_teammateLayoutManager();
  init_tasks();
  init_UI23();
  inputSchema36 = lazySchema(() => exports_external.strictObject({})), TeamDeleteTool = buildTool({
    name: TEAM_DELETE_TOOL_NAME,
    searchHint: "disband a swarm team and clean up",
    maxResultSizeChars: 1e5,
    shouldDefer: !0,
    userFacingName() {
      return "";
    },
    get inputSchema() {
      return inputSchema36();
    },
    isEnabled() {
      return isAgentSwarmsEnabled();
    },
    async description() {
      return "Clean up team and task directories when the swarm is complete";
    },
    async prompt() {
      return getPrompt7();
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
    async call(_input, context6) {
      let { setAppState, getAppState } = context6, teamName = getAppState().teamContext?.teamName;
      if (teamName) {
        let teamFile = readTeamFile(teamName);
        if (teamFile) {
          let activeMembers = teamFile.members.filter((m4) => m4.name !== TEAM_LEAD_NAME).filter((m4) => m4.isActive !== !1);
          if (activeMembers.length > 0) {
            let memberNames = activeMembers.map((m4) => m4.name).join(", ");
            return {
              data: {
                success: !1,
                message: `Cannot cleanup team with ${activeMembers.length} active member(s): ${memberNames}. Use requestShutdown to gracefully terminate teammates first.`,
                team_name: teamName
              }
            };
          }
        }
        await cleanupTeamDirectories(teamName), unregisterTeamForSessionCleanup(teamName), clearTeammateColors(), clearLeaderTeamName(), logEvent("tengu_team_deleted", {
          team_name: teamName
        });
      }
      return setAppState((prev) => ({
        ...prev,
        teamContext: void 0,
        inbox: {
          messages: []
        }
      })), {
        data: {
          success: !0,
          message: teamName ? `Cleaned up directories and worktrees for team "${teamName}"` : "No team name found, nothing to clean up",
          team_name: teamName
        }
      };
    },
    renderToolUseMessage: renderToolUseMessage25,
    renderToolResultMessage: renderToolResultMessage23
  });
});
