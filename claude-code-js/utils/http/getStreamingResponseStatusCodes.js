// function: getStreamingResponseStatusCodes
function getStreamingResponseStatusCodes(operationSpec) {
  let result = /* @__PURE__ */ new Set;
  for (let statusCode in operationSpec.responses) {
    let operationResponse = operationSpec.responses[statusCode];
    if (operationResponse.bodyMapper && operationResponse.bodyMapper.type.name === MapperTypeNames.Stream)
      result.add(Number(statusCode));
  }
  return result;
}
