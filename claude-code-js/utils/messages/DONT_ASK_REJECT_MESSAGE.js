// function: DONT_ASK_REJECT_MESSAGE
function DONT_ASK_REJECT_MESSAGE(toolName) {
  return `Permission to use ${toolName} has been denied because Claude Code is running in don't ask mode. ${DENIAL_WORKAROUND_GUIDANCE}`;
}
