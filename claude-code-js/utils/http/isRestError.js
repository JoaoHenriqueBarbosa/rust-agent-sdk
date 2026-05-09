// function: isRestError
function isRestError(e) {
  if (e instanceof RestError)
    return !0;
  return isError(e) && e.name === "RestError";
}
