// Original: src/commands/color/color.ts
var exports_color = {};
__export(exports_color, {
  call: () => call10
});
async function call10(onDone, context6, args) {
  if (isTeammate())
    return onDone("Cannot set color: This session is a swarm teammate. Teammate colors are assigned by the team leader.", { display: "system" }), null;
  if (!args || args.trim() === "") {
    let colorList = AGENT_COLORS.join(", ");
    return onDone(`Please provide a color. Available colors: ${colorList}, default`, {
      display: "system"
    }), null;
  }
  let colorArg = args.trim().toLowerCase();
  if (RESET_ALIASES.includes(colorArg)) {
    let sessionId2 = getSessionId(), fullPath2 = getTranscriptPath();
    return await saveAgentColor(sessionId2, "default", fullPath2), context6.setAppState((prev) => ({
      ...prev,
      standaloneAgentContext: {
        ...prev.standaloneAgentContext,
        name: prev.standaloneAgentContext?.name ?? "",
        color: void 0
      }
    })), onDone("Session color reset to default", { display: "system" }), null;
  }
  if (!AGENT_COLORS.includes(colorArg)) {
    let colorList = AGENT_COLORS.join(", ");
    return onDone(`Invalid color "${colorArg}". Available colors: ${colorList}, default`, { display: "system" }), null;
  }
  let sessionId = getSessionId(), fullPath = getTranscriptPath();
  return await saveAgentColor(sessionId, colorArg, fullPath), context6.setAppState((prev) => ({
    ...prev,
    standaloneAgentContext: {
      ...prev.standaloneAgentContext,
      name: prev.standaloneAgentContext?.name ?? "",
      color: colorArg
    }
  })), onDone(`Session color set to: ${colorArg}`, { display: "system" }), null;
}
var RESET_ALIASES;
var init_color2 = __esm(() => {
  init_state();
  init_agentColorManager();
  init_sessionStorage();
  init_teammate();
  RESET_ALIASES = ["default", "reset", "none", "gray", "grey"];
});
