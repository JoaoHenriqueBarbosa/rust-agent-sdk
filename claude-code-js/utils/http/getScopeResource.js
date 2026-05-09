// function: getScopeResource
function getScopeResource(scope) {
  return scope.replace(/\/.default$/, "");
}
