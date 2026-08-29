// function: createPatternAlphabet
function createPatternAlphabet(pattern) {
  let mask = {};
  for (let i5 = 0, len = pattern.length;i5 < len; i5 += 1) {
    let char = pattern.charAt(i5);
    mask[char] = (mask[char] || 0) | 1 << len - i5 - 1;
  }
  return mask;
}
