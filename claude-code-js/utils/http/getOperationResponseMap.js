// function: getOperationResponseMap
function getOperationResponseMap(parsedResponse) {
  let result, request2 = parsedResponse.request, operationInfo = getOperationRequestInfo(request2), operationSpec = operationInfo?.operationSpec;
  if (operationSpec)
    if (!operationInfo?.operationResponseGetter)
      result = operationSpec.responses[parsedResponse.status];
    else
      result = operationInfo?.operationResponseGetter(operationSpec, parsedResponse);
  return result;
}
