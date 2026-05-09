// function: mapScopesToResource
function mapScopesToResource(scopes) {
  let scope = "";
  if (Array.isArray(scopes)) {
    if (scopes.length !== 1)
      return;
    scope = scopes[0];
  } else if (typeof scopes === "string")
    scope = scopes;
  if (!scope.endsWith("/.default"))
    return scope;
  return scope.substr(0, scope.lastIndexOf("/.default"));
}
