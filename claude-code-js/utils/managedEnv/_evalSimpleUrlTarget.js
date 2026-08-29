// function: _evalSimpleUrlTarget
function _evalSimpleUrlTarget(actual, pattern) {
  try {
    let expected = new URL(pattern.replace(/^([^:/?]*)\./i, "https://$1.").replace(/\*/g, "_____"), "https://_____"), comps = [[actual.host, expected.host, !1], [actual.pathname, expected.pathname, !0]];
    if (expected.hash)
      comps.push([actual.hash, expected.hash, !1]);
    return expected.searchParams.forEach((v2, k3) => {
      comps.push([actual.searchParams.get(k3) || "", v2, !1]);
    }), !comps.some((data) => !_evalSimpleUrlPart(data[0], data[1], data[2]));
  } catch (e) {
    return !1;
  }
}
