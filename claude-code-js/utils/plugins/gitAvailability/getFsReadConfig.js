// function: getFsReadConfig
function getFsReadConfig() {
  if (!config8)
    return { denyOnly: [], allowWithinDeny: [] };
  let denyPaths = [];
  for (let p4 of config8.filesystem.denyRead) {
    let stripped = removeTrailingGlobSuffix(p4);
    if (getPlatform2() === "linux" && containsGlobChars(stripped)) {
      let expanded = expandGlobPattern(p4);
      logForDebugging2(`[Sandbox] Expanded glob pattern "${p4}" to ${expanded.length} paths on Linux`), denyPaths.push(...expanded);
    } else
      denyPaths.push(stripped);
  }
  let allowPaths = [];
  for (let p4 of config8.filesystem.allowRead ?? []) {
    let stripped = removeTrailingGlobSuffix(p4);
    if (getPlatform2() === "linux" && containsGlobChars(stripped)) {
      let expanded = expandGlobPattern(p4);
      logForDebugging2(`[Sandbox] Expanded allowRead glob pattern "${p4}" to ${expanded.length} paths on Linux`), allowPaths.push(...expanded);
    } else
      allowPaths.push(stripped);
  }
  return {
    denyOnly: denyPaths,
    allowWithinDeny: allowPaths
  };
}
