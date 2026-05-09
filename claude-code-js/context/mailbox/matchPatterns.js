// function: matchPatterns
function matchPatterns(patterns, testString, stats) {
  let path12 = normalizePath(testString);
  for (let index = 0;index < patterns.length; index++) {
    let pattern = patterns[index];
    if (pattern(path12, stats))
      return !0;
  }
  return !1;
}
