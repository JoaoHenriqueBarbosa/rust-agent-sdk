// function: errorMessage
function errorMessage(e) {
  return e instanceof Error ? e.message : String(e);
}
