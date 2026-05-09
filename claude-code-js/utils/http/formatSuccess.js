// function: formatSuccess
function formatSuccess(scope) {
  return `SUCCESS. Scopes: ${Array.isArray(scope) ? scope.join(", ") : scope}.`;
}
