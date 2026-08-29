// function: getFsWriteConfig
function getFsWriteConfig() {
  if (!config8)
    return { allowOnly: getDefaultWritePaths(), denyWithinAllow: [] };
  let allowPaths = config8.filesystem.allowWrite.map((path16) => removeTrailingGlobSuffix(path16)).filter((path16) => {
    if (getPlatform2() === "linux" && containsGlobChars(path16))
      return logForDebugging2(`Skipping glob pattern on Linux/WSL: ${path16}`), !1;
    return !0;
  }), denyPaths = config8.filesystem.denyWrite.map((path16) => removeTrailingGlobSuffix(path16)).filter((path16) => {
    if (getPlatform2() === "linux" && containsGlobChars(path16))
      return logForDebugging2(`Skipping glob pattern on Linux/WSL: ${path16}`), !1;
    return !0;
  });
  return {
    allowOnly: [...getDefaultWritePaths(), ...allowPaths],
    denyWithinAllow: denyPaths
  };
}
