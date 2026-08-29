// function: userFacingName2
function userFacingName2(input) {
  if (input?.subagent_type && input.subagent_type !== GENERAL_PURPOSE_AGENT.agentType) {
    if (input.subagent_type === "worker")
      return "Agent";
    return input.subagent_type;
  }
  return "Agent";
}
