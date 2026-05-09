// function: isIn
function isIn(actual, expected, insensitive = !1) {
  if (insensitive) {
    let caseFold = (val) => typeof val === "string" ? val.toLowerCase() : val;
    if (Array.isArray(actual))
      return actual.some((el) => expected.some((exp) => caseFold(el) === caseFold(exp)));
    return expected.some((exp) => caseFold(actual) === caseFold(exp));
  }
  if (Array.isArray(actual))
    return actual.some((el) => expected.includes(el));
  return expected.includes(actual);
}
