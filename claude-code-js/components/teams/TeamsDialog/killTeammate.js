// function: killTeammate
async function killTeammate(paneId, backendType, teamName, teammateId, teammateName, setAppState) {
  if (backendType)
    try {
      await ensureBackendsRegistered(), await getBackendByType(backendType).killPane(paneId, !isInsideTmuxSync());
    } catch (error44) {
      logForDebugging(`[TeamsDialog] Failed to kill pane ${paneId}: ${error44}`);
    }
  else
    logForDebugging(`[TeamsDialog] Skipping pane kill for ${paneId}: no backendType recorded`);
  removeMemberFromTeam(teamName, paneId);
  let {
    notificationMessage
  } = await unassignTeammateTasks(teamName, teammateId, teammateName, "terminated");
  setAppState((prev) => {
    if (!prev.teamContext?.teammates)
      return prev;
    if (!(teammateId in prev.teamContext.teammates))
      return prev;
    let {
      [teammateId]: _,
      ...remainingTeammates
    } = prev.teamContext.teammates;
    return {
      ...prev,
      teamContext: {
        ...prev.teamContext,
        teammates: remainingTeammates
      },
      inbox: {
        messages: [...prev.inbox.messages, {
          id: randomUUID33(),
          from: "system",
          text: jsonStringify({
            type: "teammate_terminated",
            message: notificationMessage
          }),
          timestamp: (/* @__PURE__ */ new Date()).toISOString(),
          status: "pending"
        }]
      }
    };
  }), logForDebugging(`[TeamsDialog] Removed ${teammateId} from teamContext`);
}
