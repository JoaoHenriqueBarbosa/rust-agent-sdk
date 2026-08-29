// function: getAutoMemPathOverride
function getAutoMemPathOverride() {
  return validateMemoryPath(process.env.CLAUDE_COWORK_MEMORY_PATH_OVERRIDE, !1);
}
