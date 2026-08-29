// function: makeInvalidResult
function makeInvalidResult(command12, message, errorId) {
  return {
    ...INVALID_RESULT_BASE,
    errors: [{ message, errorId }],
    originalCommand: command12
  };
}
