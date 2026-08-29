// function: getPathStringFromParameter
function getPathStringFromParameter(parameter) {
  let { parameterPath, mapper } = parameter, result;
  if (typeof parameterPath === "string")
    result = parameterPath;
  else if (Array.isArray(parameterPath))
    result = parameterPath.join(".");
  else
    result = mapper.serializedName;
  return result;
}
