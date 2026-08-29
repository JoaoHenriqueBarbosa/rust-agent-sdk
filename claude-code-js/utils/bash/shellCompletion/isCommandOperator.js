// function: isCommandOperator
function isCommandOperator(token) {
  return typeof token === "object" && token !== null && "op" in token && COMMAND_OPERATORS.includes(token.op);
}
