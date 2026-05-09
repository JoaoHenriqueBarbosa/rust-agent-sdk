// function: checkInvokeExpression
function checkInvokeExpression(parsed) {
  if (hasCommandNamed(parsed, "Invoke-Expression"))
    return {
      behavior: "ask",
      message: "Command uses Invoke-Expression which can execute arbitrary code"
    };
  return { behavior: "passthrough" };
}
