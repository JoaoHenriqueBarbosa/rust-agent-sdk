// function: search
function search(text2, pattern, patternAlphabet, {
  location = Config2.location,
  distance = Config2.distance,
  threshold = Config2.threshold,
  findAllMatches = Config2.findAllMatches,
  minMatchCharLength = Config2.minMatchCharLength,
  includeMatches = Config2.includeMatches,
  ignoreLocation = Config2.ignoreLocation
} = {}) {
  if (pattern.length > MAX_BITS)
    throw Error(PATTERN_LENGTH_TOO_LARGE(MAX_BITS));
  let patternLen = pattern.length, textLen = text2.length, expectedLocation = Math.max(0, Math.min(location, textLen)), currentThreshold = threshold, bestLocation = expectedLocation, calcScore = (errors8, currentLocation) => {
    let accuracy = errors8 / patternLen;
    if (ignoreLocation)
      return accuracy;
    let proximity = Math.abs(expectedLocation - currentLocation);
    if (!distance)
      return proximity ? 1 : accuracy;
    return accuracy + proximity / distance;
  }, computeMatches = minMatchCharLength > 1 || includeMatches, matchMask = computeMatches ? Array(textLen) : [], index2;
  while ((index2 = text2.indexOf(pattern, bestLocation)) > -1) {
    let score = calcScore(0, index2);
    if (currentThreshold = Math.min(score, currentThreshold), bestLocation = index2 + patternLen, computeMatches) {
      let i5 = 0;
      while (i5 < patternLen)
        matchMask[index2 + i5] = 1, i5 += 1;
    }
  }
  bestLocation = -1;
  let lastBitArr = [], finalScore = 1, binMax = patternLen + textLen, mask = 1 << patternLen - 1;
  for (let i5 = 0;i5 < patternLen; i5 += 1) {
    let binMin = 0, binMid = binMax;
    while (binMin < binMid) {
      if (calcScore(i5, expectedLocation + binMid) <= currentThreshold)
        binMin = binMid;
      else
        binMax = binMid;
      binMid = Math.floor((binMax - binMin) / 2 + binMin);
    }
    binMax = binMid;
    let start = Math.max(1, expectedLocation - binMid + 1), finish = findAllMatches ? textLen : Math.min(expectedLocation + binMid, textLen) + patternLen, bitArr = Array(finish + 2);
    bitArr[finish + 1] = (1 << i5) - 1;
    for (let j4 = finish;j4 >= start; j4 -= 1) {
      let currentLocation = j4 - 1, charMatch = patternAlphabet[text2[currentLocation]];
      if (computeMatches)
        matchMask[currentLocation] = +!!charMatch;
      if (bitArr[j4] = (bitArr[j4 + 1] << 1 | 1) & charMatch, i5)
        bitArr[j4] |= (lastBitArr[j4 + 1] | lastBitArr[j4]) << 1 | 1 | lastBitArr[j4 + 1];
      if (bitArr[j4] & mask) {
        if (finalScore = calcScore(i5, currentLocation), finalScore <= currentThreshold) {
          if (currentThreshold = finalScore, bestLocation = currentLocation, bestLocation <= expectedLocation)
            break;
          start = Math.max(1, 2 * expectedLocation - bestLocation);
        }
      }
    }
    if (calcScore(i5 + 1, expectedLocation) > currentThreshold)
      break;
    lastBitArr = bitArr;
  }
  let result = {
    isMatch: bestLocation >= 0,
    score: Math.max(0.001, finalScore)
  };
  if (computeMatches) {
    let indices = convertMaskToIndices(matchMask, minMatchCharLength);
    if (!indices.length)
      result.isMatch = !1;
    else if (includeMatches)
      result.indices = indices;
  }
  return result;
}
