// Original: src/tools/AgentTool/agentColorManager.ts
function getAgentColor(agentType) {
  if (agentType === "general-purpose")
    return;
  let existingColor = getAgentColorMap().get(agentType);
  if (existingColor && AGENT_COLORS.includes(existingColor))
    return AGENT_COLOR_TO_THEME_COLOR[existingColor];
  return;
}
function setAgentColor(agentType, color2) {
  let agentColorMap = getAgentColorMap();
  if (!color2) {
    agentColorMap.delete(agentType);
    return;
  }
  if (AGENT_COLORS.includes(color2))
    agentColorMap.set(agentType, color2);
}
var AGENT_COLORS, AGENT_COLOR_TO_THEME_COLOR;
var init_agentColorManager = __esm(() => {
  init_state();
  AGENT_COLORS = [
    "red",
    "blue",
    "green",
    "yellow",
    "purple",
    "orange",
    "pink",
    "cyan"
  ], AGENT_COLOR_TO_THEME_COLOR = {
    red: "red_FOR_SUBAGENTS_ONLY",
    blue: "blue_FOR_SUBAGENTS_ONLY",
    green: "green_FOR_SUBAGENTS_ONLY",
    yellow: "yellow_FOR_SUBAGENTS_ONLY",
    purple: "purple_FOR_SUBAGENTS_ONLY",
    orange: "orange_FOR_SUBAGENTS_ONLY",
    pink: "pink_FOR_SUBAGENTS_ONLY",
    cyan: "cyan_FOR_SUBAGENTS_ONLY"
  };
});
