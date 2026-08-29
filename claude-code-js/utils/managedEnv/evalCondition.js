// function: evalCondition
function evalCondition(obj, condition, savedGroups) {
  savedGroups = savedGroups || {};
  for (let [k3, v2] of Object.entries(condition))
    switch (k3) {
      case "$or":
        if (!evalOr(obj, v2, savedGroups))
          return !1;
        break;
      case "$nor":
        if (evalOr(obj, v2, savedGroups))
          return !1;
        break;
      case "$and":
        if (!evalAnd(obj, v2, savedGroups))
          return !1;
        break;
      case "$not":
        if (evalCondition(obj, v2, savedGroups))
          return !1;
        break;
      default:
        if (!evalConditionValue(v2, getPath2(obj, k3), savedGroups))
          return !1;
    }
  return !0;
}
