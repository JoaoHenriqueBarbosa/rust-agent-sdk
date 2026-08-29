// function: resolveTeamName
function resolveTeamName(input, appState) {
  if (!isAgentSwarmsEnabled())
    return;
  return input.team_name || appState.teamContext?.teamName;
}
