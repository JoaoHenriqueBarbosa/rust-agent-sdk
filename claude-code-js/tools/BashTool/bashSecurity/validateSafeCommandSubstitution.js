// function: validateSafeCommandSubstitution
function validateSafeCommandSubstitution(context3) {
  let { originalCommand } = context3;
  if (!HEREDOC_IN_SUBSTITUTION.test(originalCommand))
    return { behavior: "passthrough", message: "No heredoc in substitution" };
  if (isSafeHeredoc(originalCommand))
    return {
      behavior: "allow",
      updatedInput: { command: originalCommand },
      decisionReason: {
        type: "other",
        reason: "Safe command substitution: cat with quoted/escaped heredoc delimiter"
      }
    };
  return {
    behavior: "passthrough",
    message: "Command substitution needs validation"
  };
}
