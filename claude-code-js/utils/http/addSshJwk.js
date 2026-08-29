// function: addSshJwk
function addSshJwk(parameters, sshJwkString) {
  if (sshJwkString)
    parameters.set(TOKEN_TYPE, AuthenticationScheme.SSH), parameters.set(REQ_CNF, sshJwkString);
}
