// function: evalOperatorCondition
function evalOperatorCondition(operator, actual, expected, savedGroups) {
  switch (operator) {
    case "$veq":
      return paddedVersionString(actual) === paddedVersionString(expected);
    case "$vne":
      return paddedVersionString(actual) !== paddedVersionString(expected);
    case "$vgt":
      return paddedVersionString(actual) > paddedVersionString(expected);
    case "$vgte":
      return paddedVersionString(actual) >= paddedVersionString(expected);
    case "$vlt":
      return paddedVersionString(actual) < paddedVersionString(expected);
    case "$vlte":
      return paddedVersionString(actual) <= paddedVersionString(expected);
    case "$eq":
      return actual === expected;
    case "$ne":
      return actual !== expected;
    case "$lt":
      return actual < expected;
    case "$lte":
      return actual <= expected;
    case "$gt":
      return actual > expected;
    case "$gte":
      return actual >= expected;
    case "$exists":
      return expected ? actual != null : actual == null;
    case "$in":
      if (!Array.isArray(expected))
        return !1;
      return isIn(actual, expected);
    case "$ini":
      if (!Array.isArray(expected))
        return !1;
      return isIn(actual, expected, !0);
    case "$inGroup":
      return isIn(actual, savedGroups[expected] || []);
    case "$notInGroup":
      return !isIn(actual, savedGroups[expected] || []);
    case "$nin":
      if (!Array.isArray(expected))
        return !1;
      return !isIn(actual, expected);
    case "$nini":
      if (!Array.isArray(expected))
        return !1;
      return !isIn(actual, expected, !0);
    case "$not":
      return !evalConditionValue(expected, actual, savedGroups);
    case "$size":
      if (!Array.isArray(actual))
        return !1;
      return evalConditionValue(expected, actual.length, savedGroups);
    case "$elemMatch":
      return elemMatch(actual, expected, savedGroups);
    case "$all":
      if (!Array.isArray(expected))
        return !1;
      return isInAll(actual, expected, savedGroups);
    case "$alli":
      if (!Array.isArray(expected))
        return !1;
      return isInAll(actual, expected, savedGroups, !0);
    case "$regex":
      try {
        return getRegex(expected).test(actual);
      } catch (e) {
        return !1;
      }
    case "$regexi":
      try {
        return getRegex(expected, !0).test(actual);
      } catch (e) {
        return !1;
      }
    case "$type":
      return getType(actual) === expected;
    default:
      return console.error("Unknown operator: " + operator), !1;
  }
}
