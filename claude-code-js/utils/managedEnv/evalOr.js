// function: evalOr
function evalOr(obj, conditions, savedGroups) {
  if (!conditions.length)
    return !0;
  for (let i5 = 0;i5 < conditions.length; i5++)
    if (evalCondition(obj, conditions[i5], savedGroups))
      return !0;
  return !1;
}
