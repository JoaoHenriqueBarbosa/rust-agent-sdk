// function: calculateUrlReplacements
function calculateUrlReplacements(operationSpec, operationArguments, fallbackObject) {
  let result = /* @__PURE__ */ new Map;
  if (operationSpec.urlParameters?.length)
    for (let urlParameter of operationSpec.urlParameters) {
      let urlParameterValue = getOperationArgumentValueFromParameter(operationArguments, urlParameter, fallbackObject), parameterPathString = getPathStringFromParameter(urlParameter);
      if (urlParameterValue = operationSpec.serializer.serialize(urlParameter.mapper, urlParameterValue, parameterPathString), !urlParameter.skipEncoding)
        urlParameterValue = encodeURIComponent(urlParameterValue);
      result.set(`{${urlParameter.mapper.serializedName || parameterPathString}}`, urlParameterValue);
    }
  return result;
}
