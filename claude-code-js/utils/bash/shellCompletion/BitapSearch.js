// class: BitapSearch
class BitapSearch {
  constructor(pattern, {
    location = Config2.location,
    threshold = Config2.threshold,
    distance = Config2.distance,
    includeMatches = Config2.includeMatches,
    findAllMatches = Config2.findAllMatches,
    minMatchCharLength = Config2.minMatchCharLength,
    isCaseSensitive = Config2.isCaseSensitive,
    ignoreDiacritics = Config2.ignoreDiacritics,
    ignoreLocation = Config2.ignoreLocation
  } = {}) {
    if (this.options = {
      location,
      threshold,
      distance,
      includeMatches,
      findAllMatches,
      minMatchCharLength,
      isCaseSensitive,
      ignoreDiacritics,
      ignoreLocation
    }, pattern = isCaseSensitive ? pattern : pattern.toLowerCase(), pattern = ignoreDiacritics ? stripDiacritics(pattern) : pattern, this.pattern = pattern, this.chunks = [], !this.pattern.length)
      return;
    let addChunk = (pattern2, startIndex) => {
      this.chunks.push({
        pattern: pattern2,
        alphabet: createPatternAlphabet(pattern2),
        startIndex
      });
    }, len = this.pattern.length;
    if (len > MAX_BITS) {
      let i5 = 0, remainder = len % MAX_BITS, end = len - remainder;
      while (i5 < end)
        addChunk(this.pattern.substr(i5, MAX_BITS), i5), i5 += MAX_BITS;
      if (remainder) {
        let startIndex = len - MAX_BITS;
        addChunk(this.pattern.substr(startIndex), startIndex);
      }
    } else
      addChunk(this.pattern, 0);
  }
  searchIn(text2) {
    let {
      isCaseSensitive,
      ignoreDiacritics,
      includeMatches
    } = this.options;
    if (text2 = isCaseSensitive ? text2 : text2.toLowerCase(), text2 = ignoreDiacritics ? stripDiacritics(text2) : text2, this.pattern === text2) {
      let result2 = {
        isMatch: !0,
        score: 0
      };
      if (includeMatches)
        result2.indices = [[0, text2.length - 1]];
      return result2;
    }
    let {
      location,
      distance,
      threshold,
      findAllMatches,
      minMatchCharLength,
      ignoreLocation
    } = this.options, allIndices = [], totalScore = 0, hasMatches = !1;
    this.chunks.forEach(({
      pattern,
      alphabet,
      startIndex
    }) => {
      let {
        isMatch,
        score,
        indices
      } = search(text2, pattern, alphabet, {
        location: location + startIndex,
        distance,
        threshold,
        findAllMatches,
        minMatchCharLength,
        includeMatches,
        ignoreLocation
      });
      if (isMatch)
        hasMatches = !0;
      if (totalScore += score, isMatch && indices)
        allIndices.push(...indices);
    });
    let result = {
      isMatch: hasMatches,
      score: hasMatches ? totalScore / this.chunks.length : 1
    };
    if (hasMatches && includeMatches)
      result.indices = mergeIndices(allIndices);
    return result;
  }
}
