// function: getClientAssertion
async function getClientAssertion(clientAssertion, clientId, tokenEndpoint) {
  if (typeof clientAssertion === "string")
    return clientAssertion;
  else
    return clientAssertion({
      clientId,
      tokenEndpoint
    });
}
