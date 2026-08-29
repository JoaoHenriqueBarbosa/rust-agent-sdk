// function: addClientAssertion
function addClientAssertion(parameters, clientAssertion) {
  if (clientAssertion)
    parameters.set(CLIENT_ASSERTION, clientAssertion);
}
