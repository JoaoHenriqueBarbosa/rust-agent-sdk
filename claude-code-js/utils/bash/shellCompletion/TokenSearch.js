// class: TokenSearch
class TokenSearch {
  static condition(_, options2) {
    return options2.useTokenSearch;
  }
  constructor(pattern, options2) {
    this.options = options2, this.analyzer = createAnalyzer({
      isCaseSensitive: options2.isCaseSensitive,
      ignoreDiacritics: options2.ignoreDiacritics
    });
    let queryTerms = this.analyzer.tokenize(pattern), invertedIndex = options2._invertedIndex, {
      df,
      fieldCount
    } = invertedIndex;
    this.termSearchers = [], this.idfWeights = [];
    for (let term of queryTerms) {
      this.termSearchers.push(new BitapSearch(term, {
        location: options2.location,
        threshold: options2.threshold,
        distance: options2.distance,
        includeMatches: options2.includeMatches,
        findAllMatches: options2.findAllMatches,
        minMatchCharLength: options2.minMatchCharLength,
        isCaseSensitive: options2.isCaseSensitive,
        ignoreDiacritics: options2.ignoreDiacritics,
        ignoreLocation: !0
      }));
      let docFreq = df.get(term) || 0, idf = Math.log(1 + (fieldCount - docFreq + 0.5) / (docFreq + 0.5));
      this.idfWeights.push(idf);
    }
  }
  searchIn(text2) {
    if (!this.termSearchers.length)
      return {
        isMatch: !1,
        score: 1
      };
    let allIndices = [], weightedScore = 0, maxPossibleScore = 0, matchedCount = 0;
    for (let i5 = 0;i5 < this.termSearchers.length; i5++) {
      let result = this.termSearchers[i5].searchIn(text2), idf = this.idfWeights[i5];
      if (maxPossibleScore += idf, result.isMatch) {
        if (matchedCount++, weightedScore += idf * (1 - result.score), result.indices)
          allIndices.push(...result.indices);
      }
    }
    if (matchedCount === 0)
      return {
        isMatch: !1,
        score: 1
      };
    let normalized = maxPossibleScore > 0 ? 1 - weightedScore / maxPossibleScore : 0, searchResult = {
      isMatch: !0,
      score: Math.max(0.001, normalized)
    };
    if (this.options.includeMatches && allIndices.length)
      searchResult.indices = mergeIndices(allIndices);
    return searchResult;
  }
}
