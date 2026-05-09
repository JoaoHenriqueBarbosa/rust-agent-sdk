// function: validateIncompleteCommands
function validateIncompleteCommands(context3) {
  let { originalCommand } = context3, trimmed = originalCommand.trim();
  if (/^\s*\t/.test(originalCommand))
    return logEvent("tengu_bash_security_check_triggered", {
      checkId: BASH_SECURITY_CHECK_IDS.INCOMPLETE_COMMANDS,
      subId: 1
    }), {
      behavior: "ask",
      message: "Command appears to be an incomplete fragment (starts with tab)"
    };
  if (trimmed.startsWith("-"))
    return logEvent("tengu_bash_security_check_triggered", {
      checkId: BASH_SECURITY_CHECK_IDS.INCOMPLETE_COMMANDS,
      subId: 2
    }), {
      behavior: "ask",
      message: "Command appears to be an incomplete fragment (starts with flags)"
    };
  if (/^\s*(&&|\|\||;|>>?|<)/.test(originalCommand))
    return logEvent("tengu_bash_security_check_triggered", {
      checkId: BASH_SECURITY_CHECK_IDS.INCOMPLETE_COMMANDS,
      subId: 3
    }), {
      behavior: "ask",
      message: "Command appears to be a continuation line (starts with operator)"
    };
  return { behavior: "passthrough", message: "Command appears complete" };
}
