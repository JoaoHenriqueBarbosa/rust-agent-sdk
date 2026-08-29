// function: toggleTeammateVisibility
async function toggleTeammateVisibility(teammate, teamName) {
  if (teammate.isHidden)
    await showTeammate(teammate, teamName);
  else
    await hideTeammate(teammate, teamName);
}
