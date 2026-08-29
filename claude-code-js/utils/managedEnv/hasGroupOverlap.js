// function: hasGroupOverlap
function hasGroupOverlap(expGroups, ctx) {
  let groups = ctx.global.groups || {};
  for (let i5 = 0;i5 < expGroups.length; i5++)
    if (groups[expGroups[i5]])
      return !0;
  return !1;
}
