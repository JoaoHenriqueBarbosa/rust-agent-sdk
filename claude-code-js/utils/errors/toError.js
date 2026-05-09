// function: toError
function toError(e) {
  return e instanceof Error ? e : Error(String(e));
}
