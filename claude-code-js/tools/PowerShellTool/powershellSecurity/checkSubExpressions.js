// function: checkSubExpressions
function checkSubExpressions(parsed) {
  if (deriveSecurityFlags(parsed).hasSubExpressions)
    return {
      behavior: "ask",
      message: "Command contains subexpressions $()"
    };
  return { behavior: "passthrough" };
}
