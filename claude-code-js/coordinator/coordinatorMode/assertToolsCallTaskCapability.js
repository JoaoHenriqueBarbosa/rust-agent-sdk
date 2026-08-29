// function: assertToolsCallTaskCapability
function assertToolsCallTaskCapability(requests, method, entityName) {
  if (!requests)
    throw Error(`${entityName} does not support task creation (required for ${method})`);
  switch (method) {
    case "tools/call":
      if (!requests.tools?.call)
        throw Error(`${entityName} does not support task creation for tools/call (required for ${method})`);
      break;
    default:
      break;
  }
}
