// function: createTeleportResumeSystemMessage
function createTeleportResumeSystemMessage(branchError) {
  if (branchError === null)
    return createSystemMessage("Session resumed", "suggestion");
  let formattedError = branchError instanceof TeleportOperationError ? branchError.formattedMessage : branchError.message;
  return createSystemMessage(`Session resumed without branch: ${formattedError}`, "warning");
}
