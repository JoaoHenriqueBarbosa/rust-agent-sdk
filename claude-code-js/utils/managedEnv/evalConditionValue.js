// function: evalConditionValue
function evalConditionValue(condition, value, savedGroups, insensitive = !1) {
  if (typeof condition === "string") {
    if (insensitive)
      return String(value).toLowerCase() === condition.toLowerCase();
    return value + "" === condition;
  }
  if (typeof condition === "number")
    return value * 1 === condition;
  if (typeof condition === "boolean")
    return value !== null && !!value === condition;
  if (condition === null)
    return value === null;
  if (Array.isArray(condition) || !isOperatorObject(condition))
    return JSON.stringify(value) === JSON.stringify(condition);
  for (let op in condition)
    if (!evalOperatorCondition(op, value, condition[op], savedGroups))
      return !1;
  return !0;
}
