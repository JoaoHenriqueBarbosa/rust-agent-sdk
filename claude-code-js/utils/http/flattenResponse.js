// function: flattenResponse
function flattenResponse(fullResponse, responseSpec) {
  let parsedHeaders = fullResponse.parsedHeaders;
  if (fullResponse.request.method === "HEAD")
    return {
      ...parsedHeaders,
      body: fullResponse.parsedBody
    };
  let bodyMapper = responseSpec && responseSpec.bodyMapper, isNullable = Boolean(bodyMapper?.nullable), expectedBodyTypeName = bodyMapper?.type.name;
  if (expectedBodyTypeName === "Stream")
    return {
      ...parsedHeaders,
      blobBody: fullResponse.blobBody,
      readableStreamBody: fullResponse.readableStreamBody
    };
  let modelProperties = expectedBodyTypeName === "Composite" && bodyMapper.type.modelProperties || {}, isPageableResponse = Object.keys(modelProperties).some((k3) => modelProperties[k3].serializedName === "");
  if (expectedBodyTypeName === "Sequence" || isPageableResponse) {
    let arrayResponse = fullResponse.parsedBody ?? [];
    for (let key of Object.keys(modelProperties))
      if (modelProperties[key].serializedName)
        arrayResponse[key] = fullResponse.parsedBody?.[key];
    if (parsedHeaders)
      for (let key of Object.keys(parsedHeaders))
        arrayResponse[key] = parsedHeaders[key];
    return isNullable && !fullResponse.parsedBody && !parsedHeaders && Object.getOwnPropertyNames(modelProperties).length === 0 ? null : arrayResponse;
  }
  return handleNullableResponseAndWrappableBody({
    body: fullResponse.parsedBody,
    headers: parsedHeaders,
    hasNullableType: isNullable,
    shouldWrapBody: isPrimitiveBody(fullResponse.parsedBody, expectedBodyTypeName)
  });
}
