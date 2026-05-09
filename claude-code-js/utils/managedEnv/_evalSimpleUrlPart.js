// function: _evalSimpleUrlPart
function _evalSimpleUrlPart(actual, pattern, isPath) {
  try {
    let escaped = pattern.replace(/[*.+?^${}()|[\]\\]/g, "\\$&").replace(/_____/g, ".*");
    if (isPath)
      escaped = "\\/?" + escaped.replace(/(^\/|\/$)/g, "") + "\\/?";
    return new RegExp("^" + escaped + "$", "i").test(actual);
  } catch (e) {
    return !1;
  }
}
