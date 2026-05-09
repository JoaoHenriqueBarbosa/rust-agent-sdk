// function: instrumentBrokerParams
function instrumentBrokerParams(parameters, correlationId, performanceClient) {
  if (!correlationId)
    return;
  let clientId = parameters.get(CLIENT_ID);
  if (clientId && parameters.has(BROKER_CLIENT_ID))
    performanceClient?.addFields({
      embeddedClientId: clientId,
      embeddedRedirectUri: parameters.get(REDIRECT_URI)
    }, correlationId);
}
