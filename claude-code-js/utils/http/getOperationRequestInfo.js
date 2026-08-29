// function: getOperationRequestInfo
function getOperationRequestInfo(request2) {
  if (hasOriginalRequest(request2))
    return getOperationRequestInfo(request2[originalRequestSymbol]);
  let info = state2.operationRequestMap.get(request2);
  if (!info)
    info = {}, state2.operationRequestMap.set(request2, info);
  return info;
}
