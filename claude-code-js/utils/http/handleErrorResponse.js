// function: handleErrorResponse
function handleErrorResponse(parsedResponse, operationSpec, responseSpec, options) {
  let isSuccessByStatus = 200 <= parsedResponse.status && parsedResponse.status < 300;
  if (isOperationSpecEmpty(operationSpec) ? isSuccessByStatus : !!responseSpec)
    if (responseSpec) {
      if (!responseSpec.isError)
        return { error: null, shouldReturnResponse: !1 };
    } else
      return { error: null, shouldReturnResponse: !1 };
  let errorResponseSpec = responseSpec ?? operationSpec.responses.default, initialErrorMessage = parsedResponse.request.streamResponseStatusCodes?.has(parsedResponse.status) ? `Unexpected status code: ${parsedResponse.status}` : parsedResponse.bodyAsText, error43 = new RestError2(initialErrorMessage, {
    statusCode: parsedResponse.status,
    request: parsedResponse.request,
    response: parsedResponse
  });
  if (!errorResponseSpec && !(parsedResponse.parsedBody?.error?.code && parsedResponse.parsedBody?.error?.message))
    throw error43;
  let defaultBodyMapper = errorResponseSpec?.bodyMapper, defaultHeadersMapper = errorResponseSpec?.headersMapper;
  try {
    if (parsedResponse.parsedBody) {
      let parsedBody = parsedResponse.parsedBody, deserializedError;
      if (defaultBodyMapper) {
        let valueToDeserialize = parsedBody;
        if (operationSpec.isXML && defaultBodyMapper.type.name === MapperTypeNames.Sequence) {
          valueToDeserialize = [];
          let elementName = defaultBodyMapper.xmlElementName;
          if (typeof parsedBody === "object" && elementName)
            valueToDeserialize = parsedBody[elementName];
        }
        deserializedError = operationSpec.serializer.deserialize(defaultBodyMapper, valueToDeserialize, "error.response.parsedBody", options);
      }
      let internalError = parsedBody.error || deserializedError || parsedBody;
      if (error43.code = internalError.code, internalError.message)
        error43.message = internalError.message;
      if (defaultBodyMapper)
        error43.response.parsedBody = deserializedError;
    }
    if (parsedResponse.headers && defaultHeadersMapper)
      error43.response.parsedHeaders = operationSpec.serializer.deserialize(defaultHeadersMapper, parsedResponse.headers.toJSON(), "operationRes.parsedHeaders");
  } catch (defaultError) {
    error43.message = `Error "${defaultError.message}" occurred in deserializing the responseBody - "${parsedResponse.bodyAsText}" for the default response.`;
  }
  return { error: error43, shouldReturnResponse: !1 };
}
