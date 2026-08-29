// function: cycleAllTeammateModes
function cycleAllTeammateModes(teammates, teamName, isBypassAvailable) {
  if (teammates.length === 0)
    return;
  let modes = teammates.map((t2) => t2.mode ? permissionModeFromString(t2.mode) : "default"), targetMode = !modes.every((m4) => m4 === modes[0]) ? "default" : getNextPermissionMode({
    ...getEmptyToolPermissionContext(),
    mode: modes[0] ?? "default",
    isBypassPermissionsModeAvailable: isBypassAvailable
  }), modeUpdates = teammates.map((t2) => ({
    memberName: t2.name,
    mode: targetMode
  }));
  setMultipleMemberModes(teamName, modeUpdates);
  for (let teammate of teammates) {
    let message = createModeSetRequestMessage({
      mode: targetMode,
      from: "team-lead"
    });
    writeToMailbox(teammate.name, {
      from: "team-lead",
      text: jsonStringify(message),
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    }, teamName);
  }
  logForDebugging(`[TeamsDialog] Sent mode change to all ${teammates.length} teammates: ${targetMode}`);
}
