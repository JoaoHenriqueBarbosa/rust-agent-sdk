// function: isNewCommandContext
function isNewCommandContext(tokens, currentTokenIndex) {
  if (currentTokenIndex === 0)
    return !0;
  let prevToken = tokens[currentTokenIndex - 1];
  return prevToken !== void 0 && isCommandOperator(prevToken);
}
