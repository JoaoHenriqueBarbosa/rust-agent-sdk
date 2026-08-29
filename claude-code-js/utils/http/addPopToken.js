// function: addPopToken
function addPopToken(parameters, cnfString) {
  if (cnfString)
    parameters.set(TOKEN_TYPE, AuthenticationScheme.POP), parameters.set(REQ_CNF, cnfString);
}
