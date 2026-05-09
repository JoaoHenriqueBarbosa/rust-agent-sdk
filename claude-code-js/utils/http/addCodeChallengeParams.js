// function: addCodeChallengeParams
function addCodeChallengeParams(parameters, codeChallenge, codeChallengeMethod) {
  if (codeChallenge && codeChallengeMethod)
    parameters.set(CODE_CHALLENGE, codeChallenge), parameters.set(CODE_CHALLENGE_METHOD, codeChallengeMethod);
  else
    throw createClientConfigurationError(pkceParamsMissing);
}
