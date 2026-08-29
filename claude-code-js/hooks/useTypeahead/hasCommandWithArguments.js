// function: hasCommandWithArguments
function hasCommandWithArguments(isAtEndWithWhitespace, value) {
  return !isAtEndWithWhitespace && value.includes(" ") && !value.endsWith(" ");
}
