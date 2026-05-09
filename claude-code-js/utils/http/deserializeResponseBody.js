// function: deserializeResponseBody
async function deserializeResponseBody(jsonContentTypes, xmlContentTypes, response7, options, parseXML) {
  let parsedResponse = await parse9(jsonContentTypes, xmlContentTypes, response7, options, parseXML);
  if (!shouldDeserializeResponse(parsedResponse))
    return parsedResponse;
  let operationSpec = getOperationRequestInfo(parsedResponse.request)?.operationSpec;
  if (!operationSpec || !operationSpec.responses)
    return parsedResponse;
  let responseSpec = getOperationResponseMap(parsedResponse), { error: error43, shouldReturnResponse } = handleErrorResponse(parsedResponse, operationSpec, responseSpec, options);
  if (error43)
    throw error43;
  else if (shouldReturnResponse)
    return parsedResponse;
  if (responseSpec) {
    if (responseSpec.bodyMapper) {
      let valueToDeserialize = parsedResponse.parsedBody;
      if (operationSpec.isXML && responseSpec.bodyMapper.type.name === MapperTypeNames.Sequence)
        valueToDeserialize = typeof valueToDeserialize === "object" ? valueToDeserialize[responseSpec.bodyMapper.xmlElementName] : [];
      try {
        parsedResponse.parsedBody = operationSpec.serializer.deserialize(responseSpec.bodyMapper, valueToDeserialize, "operationRes.parsedBody", options);
      } catch (deserializeError) {
        throw new RestError2(`Error ${deserializeError} occurred in deserializing the responseBody - ${parsedResponse.bodyAsText}`, {
          statusCode: parsedResponse.status,
          request: parsedResponse.request,
          response: parsedResponse
        });
      }
    } else if (operationSpec.httpMethod === "HEAD")
      parsedResponse.parsedBody = response7.status >= 200 && response7.status < 300;
    if (responseSpec.headersMapper)
      parsedResponse.parsedHeaders = operationSpec.serializer.deserialize(responseSpec.headersMapper, parsedResponse.headers.toJSON(), "operationRes.parsedHeaders", { xml: {}, ignoreUnknownProperties: !0 });
  }
  return parsedResponse;
}
