// function: handleReadonlyResult
function handleReadonlyResult(payload) {
  return payload.value = Object.freeze(payload.value), payload;
}
