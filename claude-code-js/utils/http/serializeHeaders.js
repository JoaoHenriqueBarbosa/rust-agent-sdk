// function: serializeHeaders
function serializeHeaders(request2, operationArguments, operationSpec) {
  if (operationSpec.headerParameters)
    for (let headerParameter of operationSpec.headerParameters) {
      let headerValue = getOperationArgumentValueFromParameter(operationArguments, headerParameter);
      if (headerValue !== null && headerValue !== void 0 || headerParameter.mapper.required) {
        headerValue = operationSpec.serializer.serialize(headerParameter.mapper, headerValue, getPathStringFromParameter(headerParameter));
        let headerCollectionPrefix = headerParameter.mapper.headerCollectionPrefix;
        if (headerCollectionPrefix)
          for (let key of Object.keys(headerValue))
            request2.headers.set(headerCollectionPrefix + key, headerValue[key]);
        else
          request2.headers.set(headerParameter.mapper.serializedName || getPathStringFromParameter(headerParameter), headerValue);
      }
    }
  let customHeaders = operationArguments.options?.requestOptions?.customHeaders;
  if (customHeaders)
    for (let customHeaderName of Object.keys(customHeaders))
      request2.headers.set(customHeaderName, customHeaders[customHeaderName]);
}
