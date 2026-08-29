// function: userFacingNameBackgroundColor
function userFacingNameBackgroundColor(input) {
  if (!input?.subagent_type)
    return;
  return getAgentColor(input.subagent_type);
}
