// function: getCompletionTypeFromPrefix
function getCompletionTypeFromPrefix(prefix) {
  if (prefix.startsWith("$"))
    return "variable";
  if (prefix.includes("/") || prefix.startsWith("~") || prefix.startsWith("."))
    return "file";
  return "command";
}
