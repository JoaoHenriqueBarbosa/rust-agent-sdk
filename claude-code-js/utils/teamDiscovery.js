// Original: src/utils/teamDiscovery.ts
function getTeammateStatuses(teamName) {
  let teamFile = readTeamFile(teamName);
  if (!teamFile)
    return [];
  let hiddenPaneIds = new Set(teamFile.hiddenPaneIds ?? []), statuses = [];
  for (let member of teamFile.members) {
    if (member.name === "team-lead")
      continue;
    let status2 = member.isActive !== !1 ? "running" : "idle";
    statuses.push({
      name: member.name,
      agentId: member.agentId,
      agentType: member.agentType,
      model: member.model,
      prompt: member.prompt,
      status: status2,
      color: member.color,
      tmuxPaneId: member.tmuxPaneId,
      cwd: member.cwd,
      worktreePath: member.worktreePath,
      isHidden: hiddenPaneIds.has(member.tmuxPaneId),
      backendType: member.backendType && isPaneBackend(member.backendType) ? member.backendType : void 0,
      mode: member.mode
    });
  }
  return statuses;
}
var init_teamDiscovery = __esm(() => {
  init_teamHelpers();
});
