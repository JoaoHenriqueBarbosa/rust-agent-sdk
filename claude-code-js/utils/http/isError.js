// function: isError
function isError(e) {
  if (isObject5(e)) {
    let hasName = typeof e.name === "string", hasMessage = typeof e.message === "string";
    return hasName && hasMessage;
  }
  return !1;
}
