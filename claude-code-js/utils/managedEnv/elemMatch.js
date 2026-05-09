// function: elemMatch
function elemMatch(actual, expected, savedGroups) {
  if (!Array.isArray(actual))
    return !1;
  let check3 = isOperatorObject(expected) ? (v2) => evalConditionValue(expected, v2, savedGroups) : (v2) => evalCondition(v2, expected, savedGroups);
  for (let i5 = 0;i5 < actual.length; i5++)
    if (actual[i5] && check3(actual[i5]))
      return !0;
  return !1;
}
