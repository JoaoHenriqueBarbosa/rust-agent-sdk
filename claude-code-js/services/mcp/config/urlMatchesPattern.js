// function: urlMatchesPattern
function urlMatchesPattern(url3, pattern) {
  return urlPatternToRegex(pattern).test(url3);
}
