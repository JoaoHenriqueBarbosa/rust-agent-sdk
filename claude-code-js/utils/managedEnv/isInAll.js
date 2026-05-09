// function: isInAll
function isInAll(actual, expected, savedGroups, insensitive = !1) {
  if (!Array.isArray(actual))
    return !1;
  for (let i5 = 0;i5 < expected.length; i5++) {
    let passed = !1;
    for (let j4 = 0;j4 < actual.length; j4++)
      if (evalConditionValue(expected[i5], actual[j4], savedGroups, insensitive)) {
        passed = !0;
        break;
      }
    if (!passed)
      return !1;
  }
  return !0;
}
