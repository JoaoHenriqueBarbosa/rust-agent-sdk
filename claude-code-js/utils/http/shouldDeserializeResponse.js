// function: shouldDeserializeResponse
function shouldDeserializeResponse(parsedResponse) {
  let request2 = parsedResponse.request, shouldDeserialize = getOperationRequestInfo(request2)?.shouldDeserialize, result;
  if (shouldDeserialize === void 0)
    result = !0;
  else if (typeof shouldDeserialize === "boolean")
    result = shouldDeserialize;
  else
    result = shouldDeserialize(parsedResponse);
  return result;
}
