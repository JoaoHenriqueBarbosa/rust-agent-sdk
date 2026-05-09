// function: assertClientRequestTaskCapability
function assertClientRequestTaskCapability(requests, method, entityName) {
  if (!requests)
    throw Error(`${entityName} does not support task creation (required for ${method})`);
  switch (method) {
    case "sampling/createMessage":
      if (!requests.sampling?.createMessage)
        throw Error(`${entityName} does not support task creation for sampling/createMessage (required for ${method})`);
      break;
    case "elicitation/create":
      if (!requests.elicitation?.create)
        throw Error(`${entityName} does not support task creation for elicitation/create (required for ${method})`);
      break;
    default:
      break;
  }
}
