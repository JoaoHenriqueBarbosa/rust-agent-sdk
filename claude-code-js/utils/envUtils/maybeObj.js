// function: maybeObj
function maybeObj(x) {
  if (typeof x !== "object")
    return {};
  return x ?? {};
}
