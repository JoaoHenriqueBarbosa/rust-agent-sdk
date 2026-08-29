// function: cycleTeammateMode
function cycleTeammateMode(teammate, teamName, isBypassAvailable) {
  let currentMode = teammate.mode ? permissionModeFromString(teammate.mode) : "default", context7 = {
    ...getEmptyToolPermissionContext(),
    mode: currentMode,
    isBypassPermissionsModeAvailable: isBypassAvailable
  }, nextMode = getNextPermissionMode(context7);
  sendModeChangeToTeammate(teammate.name, teamName, nextMode);
}
