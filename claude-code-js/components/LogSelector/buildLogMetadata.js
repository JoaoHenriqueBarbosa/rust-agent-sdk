// function: buildLogMetadata
function buildLogMetadata(log3, options2) {
  let {
    isChild = !1,
    showProjectPath = !1
  } = options2 || {}, childPadding = isChild ? "    " : "", baseMetadata2 = formatLogMetadata(log3), projectSuffix = showProjectPath && log3.projectPath ? ` \xB7 ${log3.projectPath}` : "";
  return childPadding + baseMetadata2 + projectSuffix;
}
