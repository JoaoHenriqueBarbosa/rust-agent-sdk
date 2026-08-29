// function: pathInAllowedWorkingPath
function pathInAllowedWorkingPath(path25, toolPermissionContext, precomputedPathsToCheck) {
  let pathsToCheck = precomputedPathsToCheck ?? getPathsForPermissionCheck(path25), workingPaths = Array.from(allWorkingDirectories(toolPermissionContext)).flatMap((wp) => getResolvedWorkingDirPaths(wp));
  return pathsToCheck.every((pathToCheck) => workingPaths.some((workingPath) => pathInWorkingPath(pathToCheck, workingPath)));
}
