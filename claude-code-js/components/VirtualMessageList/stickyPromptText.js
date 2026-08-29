// function: stickyPromptText
function stickyPromptText(msg) {
  let cached3 = promptTextCache.get(msg);
  if (cached3 !== void 0)
    return cached3;
  let result = computeStickyPromptText(msg);
  return promptTextCache.set(msg, result), result;
}
