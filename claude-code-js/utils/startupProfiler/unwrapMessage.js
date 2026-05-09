// function: unwrapMessage
function unwrapMessage(message) {
  return typeof message === "string" ? message : message?.message;
}
