// function: getScopeHeading
function getScopeHeading(scope) {
  switch (scope) {
    case "project":
      return {
        label: "Project MCPs",
        path: describeMcpConfigFilePath(scope)
      };
    case "user":
      return {
        label: "User MCPs",
        path: describeMcpConfigFilePath(scope)
      };
    case "local":
      return {
        label: "Local MCPs",
        path: describeMcpConfigFilePath(scope)
      };
    case "enterprise":
      return {
        label: "Enterprise MCPs"
      };
    case "dynamic":
      return {
        label: "Built-in MCPs",
        path: "always available"
      };
    default:
      return {
        label: scope
      };
  }
}
