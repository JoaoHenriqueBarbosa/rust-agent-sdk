// function: matchesParam
function matchesParam(paramLower, paramList) {
  for (let p4 of paramList)
    if (p4 === paramLower || paramLower.length > 1 && p4.startsWith(paramLower))
      return !0;
  return !1;
}
