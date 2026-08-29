// function: serializationPolicy
function serializationPolicy(options = {}) {
  let stringifyXML = options.stringifyXML;
  return {
    name: serializationPolicyName,
    async sendRequest(request2, next) {
      let operationInfo = getOperationRequestInfo(request2), operationSpec = operationInfo?.operationSpec, operationArguments = operationInfo?.operationArguments;
      if (operationSpec && operationArguments)
        serializeHeaders(request2, operationArguments, operationSpec), serializeRequestBody(request2, operationArguments, operationSpec, stringifyXML);
      return next(request2);
    }
  };
}
