// function: isURLTargeted
function isURLTargeted(url3, targets) {
  if (!targets.length)
    return !1;
  let hasIncludeRules = !1, isIncluded = !1;
  for (let i5 = 0;i5 < targets.length; i5++) {
    let match = _evalURLTarget(url3, targets[i5].type, targets[i5].pattern);
    if (targets[i5].include === !1) {
      if (match)
        return !1;
    } else if (hasIncludeRules = !0, match)
      isIncluded = !0;
  }
  return isIncluded || !hasIncludeRules;
}
