// function: getOperationArgumentValueFromParameter
function getOperationArgumentValueFromParameter(operationArguments, parameter, fallbackObject) {
  let { parameterPath, mapper: parameterMapper } = parameter, value;
  if (typeof parameterPath === "string")
    parameterPath = [parameterPath];
  if (Array.isArray(parameterPath)) {
    if (parameterPath.length > 0)
      if (parameterMapper.isConstant)
        value = parameterMapper.defaultValue;
      else {
        let propertySearchResult = getPropertyFromParameterPath(operationArguments, parameterPath);
        if (!propertySearchResult.propertyFound && fallbackObject)
          propertySearchResult = getPropertyFromParameterPath(fallbackObject, parameterPath);
        let useDefaultValue = !1;
        if (!propertySearchResult.propertyFound)
          useDefaultValue = parameterMapper.required || parameterPath[0] === "options" && parameterPath.length === 2;
        value = useDefaultValue ? parameterMapper.defaultValue : propertySearchResult.propertyValue;
      }
  } else {
    if (parameterMapper.required)
      value = {};
    for (let propertyName in parameterPath) {
      let propertyMapper = parameterMapper.type.modelProperties[propertyName], propertyPath = parameterPath[propertyName], propertyValue = getOperationArgumentValueFromParameter(operationArguments, {
        parameterPath: propertyPath,
        mapper: propertyMapper
      }, fallbackObject);
      if (propertyValue !== void 0) {
        if (!value)
          value = {};
        value[propertyName] = propertyValue;
      }
    }
  }
  return value;
}
