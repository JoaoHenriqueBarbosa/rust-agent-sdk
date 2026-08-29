// function: getInstrumentationScopeKey
function getInstrumentationScopeKey(scope) {
  return `${scope.name}@${scope.version || ""}:${scope.schemaUrl || ""}`;
}
