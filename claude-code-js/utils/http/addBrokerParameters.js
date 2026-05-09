// function: addBrokerParameters
function addBrokerParameters(parameters, brokerClientId, brokerRedirectUri) {
  if (!parameters.has(BROKER_CLIENT_ID))
    parameters.set(BROKER_CLIENT_ID, brokerClientId);
  if (!parameters.has(BROKER_REDIRECT_URI))
    parameters.set(BROKER_REDIRECT_URI, brokerRedirectUri);
}
