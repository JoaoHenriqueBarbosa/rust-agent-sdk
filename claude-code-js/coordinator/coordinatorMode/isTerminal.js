// function: isTerminal
function isTerminal(status) {
  return status === "completed" || status === "failed" || status === "cancelled";
}
