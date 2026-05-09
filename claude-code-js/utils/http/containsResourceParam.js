// function: containsResourceParam
function containsResourceParam(params) {
  if (!params)
    return !1;
  return Object.prototype.hasOwnProperty.call(params, "resource");
}
