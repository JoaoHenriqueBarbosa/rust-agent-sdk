// function: checkPathSafetyForAutoEdit
function checkPathSafetyForAutoEdit(path25, precomputedPathsToCheck) {
  let pathsToCheck = precomputedPathsToCheck ?? getPathsForPermissionCheck(path25);
  for (let pathToCheck of pathsToCheck)
    if (hasSuspiciousWindowsPathPattern(pathToCheck))
      return {
        safe: !1,
        message: `Claude requested permissions to write to ${path25}, which contains a suspicious Windows path pattern that requires manual approval.`,
        classifierApprovable: !1
      };
  for (let pathToCheck of pathsToCheck)
    if (isClaudeConfigFilePath(pathToCheck))
      return {
        safe: !1,
        message: `Claude requested permissions to write to ${path25}, but you haven't granted it yet.`,
        classifierApprovable: !0
      };
  for (let pathToCheck of pathsToCheck)
    if (isDangerousFilePathToAutoEdit(pathToCheck))
      return {
        safe: !1,
        message: `Claude requested permissions to edit ${path25} which is a sensitive file.`,
        classifierApprovable: !0
      };
  return { safe: !0 };
}
