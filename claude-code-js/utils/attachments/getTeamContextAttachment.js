// function: getTeamContextAttachment
function getTeamContextAttachment(messages) {
  let teamName = getTeamName(), agentId = getAgentId(), agentName = getAgentName();
  if (!teamName || !agentId)
    return [];
  if (messages.some((m4) => m4.type === "assistant"))
    return [];
  let configDir = getClaudeConfigHomeDir(), teamConfigPath = `${configDir}/teams/${teamName}/config.json`, taskListPath = `${configDir}/tasks/${teamName}/`;
  return [
    {
      type: "team_context",
      agentId,
      agentName: agentName || agentId,
      teamName,
      teamConfigPath,
      taskListPath
    }
  ];
}
