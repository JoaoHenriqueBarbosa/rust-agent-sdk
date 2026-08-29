// function: TeamsDialog
function TeamsDialog({
  initialTeams,
  onDone
}) {
  useRegisterOverlay("teams-dialog");
  let setAppState = useSetAppState(), firstTeamName = initialTeams?.[0]?.name ?? "", [dialogLevel, setDialogLevel] = import_react245.useState({
    type: "teammateList",
    teamName: firstTeamName
  }), [selectedIndex, setSelectedIndex] = import_react245.useState(0), [refreshKey, setRefreshKey] = import_react245.useState(0), teammateStatuses = import_react245.useMemo(() => {
    return getTeammateStatuses(dialogLevel.teamName);
  }, [dialogLevel.teamName, refreshKey]);
  useInterval(() => {
    setRefreshKey((k3) => k3 + 1);
  }, 1000);
  let currentTeammate = import_react245.useMemo(() => {
    if (dialogLevel.type !== "teammateDetail")
      return null;
    return teammateStatuses.find((t2) => t2.name === dialogLevel.memberName) ?? null;
  }, [dialogLevel, teammateStatuses]), isBypassAvailable = useAppState((s2) => s2.toolPermissionContext.isBypassPermissionsModeAvailable), goBackToList = () => {
    setDialogLevel({
      type: "teammateList",
      teamName: dialogLevel.teamName
    }), setSelectedIndex(0);
  }, handleCycleMode = import_react245.useCallback(() => {
    if (dialogLevel.type === "teammateDetail" && currentTeammate)
      cycleTeammateMode(currentTeammate, dialogLevel.teamName, isBypassAvailable), setRefreshKey((k3) => k3 + 1);
    else if (dialogLevel.type === "teammateList" && teammateStatuses.length > 0)
      cycleAllTeammateModes(teammateStatuses, dialogLevel.teamName, isBypassAvailable), setRefreshKey((k3) => k3 + 1);
  }, [dialogLevel, currentTeammate, teammateStatuses, isBypassAvailable]);
  useKeybindings({
    "confirm:cycleMode": handleCycleMode
  }, {
    context: "Confirmation"
  }), use_input_default((input, key3) => {
    if (key3.leftArrow) {
      if (dialogLevel.type === "teammateDetail")
        goBackToList();
      return;
    }
    if (key3.upArrow || key3.downArrow) {
      let maxIndex = getMaxIndex();
      if (key3.upArrow)
        setSelectedIndex((prev) => Math.max(0, prev - 1));
      else
        setSelectedIndex((prev) => Math.min(maxIndex, prev + 1));
      return;
    }
    if (key3.return) {
      if (dialogLevel.type === "teammateList" && teammateStatuses[selectedIndex])
        setDialogLevel({
          type: "teammateDetail",
          teamName: dialogLevel.teamName,
          memberName: teammateStatuses[selectedIndex].name
        });
      else if (dialogLevel.type === "teammateDetail" && currentTeammate)
        viewTeammateOutput(currentTeammate.tmuxPaneId, currentTeammate.backendType), onDone();
      return;
    }
    if (input === "k") {
      if (dialogLevel.type === "teammateList" && teammateStatuses[selectedIndex])
        killTeammate(teammateStatuses[selectedIndex].tmuxPaneId, teammateStatuses[selectedIndex].backendType, dialogLevel.teamName, teammateStatuses[selectedIndex].agentId, teammateStatuses[selectedIndex].name, setAppState).then(() => {
          setRefreshKey((k3) => k3 + 1), setSelectedIndex((prev) => Math.max(0, Math.min(prev, teammateStatuses.length - 2)));
        });
      else if (dialogLevel.type === "teammateDetail" && currentTeammate)
        killTeammate(currentTeammate.tmuxPaneId, currentTeammate.backendType, dialogLevel.teamName, currentTeammate.agentId, currentTeammate.name, setAppState), goBackToList();
      return;
    }
    if (input === "s") {
      if (dialogLevel.type === "teammateList" && teammateStatuses[selectedIndex]) {
        let teammate = teammateStatuses[selectedIndex];
        sendShutdownRequestToMailbox(teammate.name, dialogLevel.teamName, "Graceful shutdown requested by team lead");
      } else if (dialogLevel.type === "teammateDetail" && currentTeammate)
        sendShutdownRequestToMailbox(currentTeammate.name, dialogLevel.teamName, "Graceful shutdown requested by team lead"), goBackToList();
      return;
    }
    if (input === "h") {
      let backend = getCachedBackend(), teammate = dialogLevel.type === "teammateList" ? teammateStatuses[selectedIndex] : dialogLevel.type === "teammateDetail" ? currentTeammate : null;
      if (teammate && backend?.supportsHideShow) {
        if (toggleTeammateVisibility(teammate, dialogLevel.teamName).then(() => {
          setRefreshKey((k3) => k3 + 1);
        }), dialogLevel.type === "teammateDetail")
          goBackToList();
      }
      return;
    }
    if (input === "H" && dialogLevel.type === "teammateList") {
      if (getCachedBackend()?.supportsHideShow && teammateStatuses.length > 0) {
        let anyVisible = teammateStatuses.some((t2) => !t2.isHidden);
        Promise.all(teammateStatuses.map((t2) => anyVisible ? hideTeammate(t2, dialogLevel.teamName) : showTeammate(t2, dialogLevel.teamName))).then(() => {
          setRefreshKey((k3) => k3 + 1);
        });
      }
      return;
    }
    if (input === "p" && dialogLevel.type === "teammateList") {
      let idleTeammates = teammateStatuses.filter((t2) => t2.status === "idle");
      if (idleTeammates.length > 0)
        Promise.all(idleTeammates.map((t2) => killTeammate(t2.tmuxPaneId, t2.backendType, dialogLevel.teamName, t2.agentId, t2.name, setAppState))).then(() => {
          setRefreshKey((k3) => k3 + 1), setSelectedIndex((prev) => Math.max(0, Math.min(prev, teammateStatuses.length - idleTeammates.length - 1)));
        });
      return;
    }
  });
  function getMaxIndex() {
    if (dialogLevel.type === "teammateList")
      return Math.max(0, teammateStatuses.length - 1);
    return 0;
  }
  if (dialogLevel.type === "teammateList")
    return /* @__PURE__ */ jsx_dev_runtime422.jsxDEV(TeamDetailView, {
      teamName: dialogLevel.teamName,
      teammates: teammateStatuses,
      selectedIndex,
      onCancel: onDone
    }, void 0, !1, void 0, this);
  if (dialogLevel.type === "teammateDetail" && currentTeammate)
    return /* @__PURE__ */ jsx_dev_runtime422.jsxDEV(TeammateDetailView, {
      teammate: currentTeammate,
      teamName: dialogLevel.teamName,
      onCancel: goBackToList
    }, void 0, !1, void 0, this);
  return null;
}
