// function: anymatch
function anymatch(matchers, testString) {
  if (matchers == null)
    throw TypeError("anymatch: specify first argument");
  let patterns = arrify(matchers).map((matcher) => createPattern(matcher));
  if (testString == null)
    return (testString2, stats) => {
      return matchPatterns(patterns, testString2, stats);
    };
  return matchPatterns(patterns, testString);
}
