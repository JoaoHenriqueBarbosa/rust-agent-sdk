// function: addClientAssertionType
function addClientAssertionType(parameters, clientAssertionType) {
  if (clientAssertionType)
    parameters.set(CLIENT_ASSERTION_TYPE, clientAssertionType);
}
