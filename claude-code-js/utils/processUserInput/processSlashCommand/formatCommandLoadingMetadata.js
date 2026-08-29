// function: formatCommandLoadingMetadata
function formatCommandLoadingMetadata(command12, args) {
  if (command12.userInvocable !== !1)
    return formatSlashCommandLoadingMetadata(command12.name, args);
  if (command12.loadedFrom === "skills" || command12.loadedFrom === "plugin" || command12.loadedFrom === "mcp")
    return formatSkillLoadingMetadata(command12.name, command12.progressMessage);
  return formatSlashCommandLoadingMetadata(command12.name, args);
}
