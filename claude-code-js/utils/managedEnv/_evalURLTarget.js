// function: _evalURLTarget
function _evalURLTarget(url3, type, pattern) {
  try {
    let parsed = new URL(url3, "https://_");
    if (type === "regex") {
      let regex2 = getUrlRegExp(pattern);
      if (!regex2)
        return !1;
      return regex2.test(parsed.href) || regex2.test(parsed.href.substring(parsed.origin.length));
    } else if (type === "simple")
      return _evalSimpleUrlTarget(parsed, pattern);
    return !1;
  } catch (e) {
    return !1;
  }
}
