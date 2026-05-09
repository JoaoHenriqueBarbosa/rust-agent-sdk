// function: AUTO_REJECT_MESSAGE
function AUTO_REJECT_MESSAGE(toolName) {
  return `Permission to use ${toolName} has been denied. ${DENIAL_WORKAROUND_GUIDANCE}`;
}
