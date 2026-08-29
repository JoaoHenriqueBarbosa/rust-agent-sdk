// function: evalAnd
function evalAnd(obj, conditions, savedGroups) {
  for (let i5 = 0;i5 < conditions.length; i5++)
    if (!evalCondition(obj, conditions[i5], savedGroups))
      return !1;
  return !0;
}
