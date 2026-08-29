// Original: src/utils/swarm/backends/teammateModeSnapshot.ts
var exports_teammateModeSnapshot = {};
__export(exports_teammateModeSnapshot, {
  setCliTeammateModeOverride: () => setCliTeammateModeOverride,
  getTeammateModeFromSnapshot: () => getTeammateModeFromSnapshot,
  getCliTeammateModeOverride: () => getCliTeammateModeOverride,
  clearCliTeammateModeOverride: () => clearCliTeammateModeOverride,
  captureTeammateModeSnapshot: () => captureTeammateModeSnapshot
});
function setCliTeammateModeOverride(mode) {
  cliTeammateModeOverride = mode;
}
function getCliTeammateModeOverride() {
  return cliTeammateModeOverride;
}
function clearCliTeammateModeOverride(newMode) {
  cliTeammateModeOverride = null, initialTeammateMode = newMode, logForDebugging(`[TeammateModeSnapshot] CLI override cleared, new mode: ${newMode}`);
}
function captureTeammateModeSnapshot() {
  if (cliTeammateModeOverride)
    initialTeammateMode = cliTeammateModeOverride, logForDebugging(`[TeammateModeSnapshot] Captured from CLI override: ${initialTeammateMode}`);
  else
    initialTeammateMode = getGlobalConfig().teammateMode ?? "auto", logForDebugging(`[TeammateModeSnapshot] Captured from config: ${initialTeammateMode}`);
}
function getTeammateModeFromSnapshot() {
  if (initialTeammateMode === null)
    logError2(Error("getTeammateModeFromSnapshot called before capture - this indicates an initialization bug")), captureTeammateModeSnapshot();
  return initialTeammateMode ?? "auto";
}
var initialTeammateMode = null, cliTeammateModeOverride = null;
var init_teammateModeSnapshot = __esm(() => {
  init_config4();
  init_debug();
  init_log3();
});
