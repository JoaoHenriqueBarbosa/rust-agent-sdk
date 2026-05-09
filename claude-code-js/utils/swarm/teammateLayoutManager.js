// Original: src/utils/swarm/teammateLayoutManager.ts
async function getBackend() {
  return (await detectAndGetBackend()).backend;
}
function assignTeammateColor(teammateId) {
  let existing = teammateColorAssignments.get(teammateId);
  if (existing)
    return existing;
  let color2 = AGENT_COLORS[colorIndex % AGENT_COLORS.length];
  return teammateColorAssignments.set(teammateId, color2), colorIndex++, color2;
}
function clearTeammateColors() {
  teammateColorAssignments.clear(), colorIndex = 0;
}
async function isInsideTmux2() {
  let { isInsideTmux: checkTmux } = await Promise.resolve().then(() => (init_detection(), exports_detection));
  return checkTmux();
}
async function createTeammatePaneInSwarmView(teammateName, teammateColor) {
  return (await getBackend()).createTeammatePaneInSwarmView(teammateName, teammateColor);
}
async function enablePaneBorderStatus(windowTarget, useSwarmSocket = !1) {
  return (await getBackend()).enablePaneBorderStatus(windowTarget, useSwarmSocket);
}
async function sendCommandToPane(paneId, command12, useSwarmSocket = !1) {
  return (await getBackend()).sendCommandToPane(paneId, command12, useSwarmSocket);
}
var teammateColorAssignments, colorIndex = 0;
var init_teammateLayoutManager = __esm(() => {
  init_agentColorManager();
  init_registry();
  teammateColorAssignments = /* @__PURE__ */ new Map;
});
