// function: hasExactErrorMessage
function hasExactErrorMessage(error2, message) {
  return error2 instanceof Error && error2.message === message;
}
