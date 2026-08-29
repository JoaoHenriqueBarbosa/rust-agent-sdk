// function: getVariablesByScope
function getVariablesByScope(parsed, scope) {
  let prefix = scope.toLowerCase() + ":";
  return parsed.variables.filter((v2) => v2.path.toLowerCase().startsWith(prefix));
}
