// function: extractTeammateOptions
function extractTeammateOptions(options2) {
  if (typeof options2 !== "object" || options2 === null)
    return {};
  let opts = options2, teammateMode = opts.teammateMode;
  return {
    agentId: typeof opts.agentId === "string" ? opts.agentId : void 0,
    agentName: typeof opts.agentName === "string" ? opts.agentName : void 0,
    teamName: typeof opts.teamName === "string" ? opts.teamName : void 0,
    agentColor: typeof opts.agentColor === "string" ? opts.agentColor : void 0,
    planModeRequired: typeof opts.planModeRequired === "boolean" ? opts.planModeRequired : void 0,
    parentSessionId: typeof opts.parentSessionId === "string" ? opts.parentSessionId : void 0,
    teammateMode: teammateMode === "auto" || teammateMode === "tmux" || teammateMode === "in-process" ? teammateMode : void 0,
    agentType: typeof opts.agentType === "string" ? opts.agentType : void 0
  };
}
