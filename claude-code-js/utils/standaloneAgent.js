// Original: src/utils/standaloneAgent.ts
function getStandaloneAgentName(appState) {
  if (getTeamName())
    return;
  return appState.standaloneAgentContext?.name;
}
var init_standaloneAgent = __esm(() => {
  init_teammate();
});
