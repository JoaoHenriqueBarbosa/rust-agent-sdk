// function: validateEmpty
function validateEmpty(context3) {
  if (!context3.originalCommand.trim())
    return {
      behavior: "allow",
      updatedInput: { command: context3.originalCommand },
      decisionReason: { type: "other", reason: "Empty command is safe" }
    };
  return { behavior: "passthrough", message: "Command is not empty" };
}
