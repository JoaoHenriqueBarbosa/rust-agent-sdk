// function: getLinuxGlobPatternWarnings
function getLinuxGlobPatternWarnings() {
  if (getPlatform2() !== "linux" || !config8)
    return [];
  let globPatterns = [], allPaths = [
    ...config8.filesystem.allowWrite,
    ...config8.filesystem.denyWrite
  ];
  for (let path16 of allPaths) {
    let pathWithoutTrailingStar = removeTrailingGlobSuffix(path16);
    if (containsGlobChars(pathWithoutTrailingStar))
      globPatterns.push(path16);
  }
  return globPatterns;
}
