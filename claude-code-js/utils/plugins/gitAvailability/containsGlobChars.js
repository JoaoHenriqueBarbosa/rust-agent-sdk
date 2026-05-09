// function: containsGlobChars
function containsGlobChars(pathPattern) {
  return pathPattern.includes("*") || pathPattern.includes("?") || pathPattern.includes("[") || pathPattern.includes("]");
}
