// function: containsAnyPlaceholder
function containsAnyPlaceholder(value) {
  return value.includes(CMDSUB_PLACEHOLDER) || value.includes(VAR_PLACEHOLDER);
}
