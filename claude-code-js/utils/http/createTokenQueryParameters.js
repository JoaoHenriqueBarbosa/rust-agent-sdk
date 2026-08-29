// function: createTokenQueryParameters
function createTokenQueryParameters(request2, clientId, redirectUri, performanceClient) {
  let parameters = /* @__PURE__ */ new Map;
  if (request2.embeddedClientId)
    addBrokerParameters(parameters, clientId, redirectUri);
  if (request2.extraQueryParameters)
    addExtraParameters(parameters, request2.extraQueryParameters);
  return addCorrelationId(parameters, request2.correlationId), instrumentBrokerParams(parameters, request2.correlationId, performanceClient), mapToQueryString(parameters);
}
