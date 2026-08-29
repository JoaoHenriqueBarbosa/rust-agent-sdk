// class: ExtendedSearch
class ExtendedSearch {
  constructor(pattern, {
    isCaseSensitive = Config2.isCaseSensitive,
    ignoreDiacritics = Config2.ignoreDiacritics,
    includeMatches = Config2.includeMatches,
    minMatchCharLength = Config2.minMatchCharLength,
    ignoreLocation = Config2.ignoreLocation,
    findAllMatches = Config2.findAllMatches,
    location = Config2.location,
    threshold = Config2.threshold,
    distance = Config2.distance
  } = {}) {
    this.query = null, this.options = {
      isCaseSensitive,
      ignoreDiacritics,
      includeMatches,
      minMatchCharLength,
      findAllMatches,
      ignoreLocation,
      location,
      threshold,
      distance
    }, pattern = isCaseSensitive ? pattern : pattern.toLowerCase(), pattern = ignoreDiacritics ? stripDiacritics(pattern) : pattern, this.pattern = pattern, this.query = parseQuery(this.pattern, this.options);
  }
  static condition(_, options2) {
    return options2.useExtendedSearch;
  }
  searchIn(text2) {
    let query3 = this.query;
    if (!query3)
      return {
        isMatch: !1,
        score: 1
      };
    let {
      includeMatches,
      isCaseSensitive,
      ignoreDiacritics
    } = this.options;
    text2 = isCaseSensitive ? text2 : text2.toLowerCase(), text2 = ignoreDiacritics ? stripDiacritics(text2) : text2;
    let numMatches = 0, allIndices = [], totalScore = 0, hasInverse = !1;
    for (let i5 = 0, qLen = query3.length;i5 < qLen; i5 += 1) {
      let searchers2 = query3[i5];
      allIndices.length = 0, numMatches = 0, hasInverse = !1;
      for (let j4 = 0, pLen = searchers2.length;j4 < pLen; j4 += 1) {
        let searcher = searchers2[j4], {
          isMatch,
          indices,
          score
        } = searcher.search(text2);
        if (isMatch) {
          numMatches += 1, totalScore += score;
          let type = searcher.constructor.type;
          if (type.startsWith("inverse"))
            hasInverse = !0;
          if (includeMatches)
            if (MultiMatchSet.has(type))
              allIndices.push(...indices);
            else
              allIndices.push(indices);
        } else {
          totalScore = 0, numMatches = 0, allIndices.length = 0, hasInverse = !1;
          break;
        }
      }
      if (numMatches) {
        let result = {
          isMatch: !0,
          score: totalScore / numMatches
        };
        if (hasInverse)
          result.hasInverse = !0;
        if (includeMatches)
          result.indices = mergeIndices(allIndices);
        return result;
      }
    }
    return {
      isMatch: !1,
      score: 1
    };
  }
}
