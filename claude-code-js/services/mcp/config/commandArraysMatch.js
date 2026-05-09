// function: commandArraysMatch
function commandArraysMatch(a2, b) {
  if (a2.length !== b.length)
    return !1;
  return a2.every((val, idx) => val === b[idx]);
}
