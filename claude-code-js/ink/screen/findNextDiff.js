// function: findNextDiff
function findNextDiff(a2, b, w0, count3) {
  for (let i4 = 0;i4 < count3; i4++, w0 += 2) {
    let w1 = w0 | 1;
    if (a2[w0] !== b[w0] || a2[w1] !== b[w1])
      return i4;
  }
  return count3;
}
