// function: formatSkillLoadingMetadata
function formatSkillLoadingMetadata(skillName, _progressMessage = "loading") {
  return [`<${COMMAND_MESSAGE_TAG}>${skillName}</${COMMAND_MESSAGE_TAG}>`, `<${COMMAND_NAME_TAG}>${skillName}</${COMMAND_NAME_TAG}>`, "<skill-format>true</skill-format>"].join(`
`);
}
