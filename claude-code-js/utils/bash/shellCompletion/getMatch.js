// function: getMatch
function getMatch(pattern, exp) {
  let matches2 = pattern.match(exp);
  return matches2 ? matches2[1] : null;
}
