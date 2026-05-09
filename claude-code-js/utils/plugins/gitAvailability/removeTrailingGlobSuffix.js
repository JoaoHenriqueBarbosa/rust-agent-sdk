// function: removeTrailingGlobSuffix
function removeTrailingGlobSuffix(pathPattern) {
  return pathPattern.replace(/\/\*\*$/, "") || "/";
}
