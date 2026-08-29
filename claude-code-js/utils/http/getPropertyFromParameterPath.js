// function: getPropertyFromParameterPath
function getPropertyFromParameterPath(parent, parameterPath) {
  let result = { propertyFound: !1 }, i4 = 0;
  for (;i4 < parameterPath.length; ++i4) {
    let parameterPathPart = parameterPath[i4];
    if (parent && parameterPathPart in parent)
      parent = parent[parameterPathPart];
    else
      break;
  }
  if (i4 === parameterPath.length)
    result.propertyValue = parent, result.propertyFound = !0;
  return result;
}
