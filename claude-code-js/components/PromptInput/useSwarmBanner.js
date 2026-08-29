// Original: src/components/PromptInput/useSwarmBanner.ts
function useSwarmBanner() {
  let teamContext = useAppState((s2) => s2.teamContext), standaloneAgentContext = useAppState((s2) => s2.standaloneAgentContext), agent = useAppState((s2) => s2.agent);
  useAppState((s2) => s2.viewingAgentTaskId);
  let store = useAppStateStore(), [insideTmux, setInsideTmux] = React138.useState(null);
  React138.useEffect(() => {
    isInsideTmux().then(setInsideTmux);
  }, []);
  let state4 = store.getState();
  if (isTeammate() && !isInProcessTeammate()) {
    let agentName = getAgentName();
    if (agentName && getTeamName())
      return {
        text: `@${agentName}`,
        bgColor: toThemeColor(teamContext?.selfAgentColor ?? getTeammateColor())
      };
  }
  if (teamContext?.teamName && teamContext.teammates && Object.keys(teamContext.teammates).length > 0) {
    let viewedTeammate = getViewedTeammateTask(state4), viewedColor = toThemeColor(viewedTeammate?.identity.color), inProcessMode = isInProcessEnabled(), nativePanes = getCachedDetectionResult()?.isNative ?? !1;
    if (insideTmux === !1 && !inProcessMode && !nativePanes)
      return {
        text: `View teammates: \`tmux -L ${getSwarmSocketName()} a\``,
        bgColor: viewedColor
      };
    if ((insideTmux === !0 || inProcessMode || nativePanes) && viewedTeammate)
      return {
        text: `@${viewedTeammate.identity.agentName}`,
        bgColor: viewedColor
      };
  }
  let active = getActiveAgentForInput(state4);
  if (active.type === "named_agent") {
    let task = active.task, name3;
    for (let [n6, id] of state4.agentNameRegistry)
      if (id === task.id) {
        name3 = n6;
        break;
      }
    return {
      text: name3 ? `@${name3}` : task.description,
      bgColor: getAgentColor(task.agentType) ?? "cyan_FOR_SUBAGENTS_ONLY"
    };
  }
  let standaloneName = getStandaloneAgentName(state4), standaloneColor = standaloneAgentContext?.color;
  if (standaloneName || standaloneColor)
    return {
      text: standaloneName ?? "",
      bgColor: toThemeColor(standaloneColor)
    };
  if (agent) {
    let agentDef = state4.agentDefinitions.activeAgents.find((a2) => a2.agentType === agent);
    return {
      text: agent,
      bgColor: toThemeColor(agentDef?.color, "promptBorder")
    };
  }
  return null;
}
function toThemeColor(colorName, fallback = "cyan_FOR_SUBAGENTS_ONLY") {
  return colorName && AGENT_COLORS.includes(colorName) ? AGENT_COLOR_TO_THEME_COLOR[colorName] : fallback;
}
var React138;
var init_useSwarmBanner = __esm(() => {
  init_AppState();
  init_selectors();
  init_agentColorManager();
  init_standaloneAgent();
  init_detection();
  init_registry();
  init_teammate();
  init_teammateContext();
  React138 = __toESM(require_react_development(), 1);
});
