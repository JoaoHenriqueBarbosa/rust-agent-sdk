// function: isTransientError
function isTransientError(error44) {
  return TRANSIENT_ERROR_TYPES.has(error44.type);
}
