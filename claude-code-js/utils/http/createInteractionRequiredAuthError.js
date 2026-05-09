// function: createInteractionRequiredAuthError
function createInteractionRequiredAuthError(errorCode, errorMessage2) {
  return new InteractionRequiredAuthError(errorCode, errorMessage2);
}
