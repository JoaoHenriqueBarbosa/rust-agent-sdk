// function: createAuthError
function createAuthError(code, additionalMessage) {
  return new AuthError(code, additionalMessage || getDefaultErrorMessage(code));
}
