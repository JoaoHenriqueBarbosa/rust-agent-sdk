// class: Fuse
class Fuse {
  constructor(docs, options2, index2) {
    this.options = {
      ...Config2,
      ...options2
    }, this.options.useExtendedSearch, this.options.useTokenSearch, this._keyStore = new KeyStore(this.options.keys), this._docs = docs, this._myIndex = null, this._invertedIndex = null, this.setCollection(docs, index2), this._lastQuery = null, this._lastSearcher = null;
  }
  _getSearcher(query3) {
    if (this._lastQuery === query3)
      return this._lastSearcher;
    let opts = this._invertedIndex ? {
      ...this.options,
      _invertedIndex: this._invertedIndex
    } : this.options, searcher = createSearcher(query3, opts);
    return this._lastQuery = query3, this._lastSearcher = searcher, searcher;
  }
  setCollection(docs, index2) {
    if (this._docs = docs, index2 && !(index2 instanceof FuseIndex))
      throw Error(INCORRECT_INDEX_TYPE);
    if (this._myIndex = index2 || createIndex(this.options.keys, this._docs, {
      getFn: this.options.getFn,
      fieldNormWeight: this.options.fieldNormWeight
    }), this.options.useTokenSearch) {
      let analyzer = createAnalyzer({
        isCaseSensitive: this.options.isCaseSensitive,
        ignoreDiacritics: this.options.ignoreDiacritics
      });
      this._invertedIndex = buildInvertedIndex(this._myIndex.records, this._myIndex.keys.length, analyzer);
    }
  }
  add(doc2) {
    if (!isDefined2(doc2))
      return;
    if (this._docs.push(doc2), this._myIndex.add(doc2), this._invertedIndex) {
      let record3 = this._myIndex.records[this._myIndex.records.length - 1], analyzer = createAnalyzer({
        isCaseSensitive: this.options.isCaseSensitive,
        ignoreDiacritics: this.options.ignoreDiacritics
      });
      addToInvertedIndex(this._invertedIndex, record3, this._myIndex.keys.length, analyzer);
    }
  }
  remove(predicate = () => !1) {
    let results = [], indicesToRemove = [];
    for (let i5 = 0, len = this._docs.length;i5 < len; i5 += 1)
      if (predicate(this._docs[i5], i5))
        results.push(this._docs[i5]), indicesToRemove.push(i5);
    if (indicesToRemove.length) {
      if (this._invertedIndex)
        for (let idx of indicesToRemove)
          removeFromInvertedIndex(this._invertedIndex, idx);
      for (let i5 = indicesToRemove.length - 1;i5 >= 0; i5 -= 1)
        this._docs.splice(indicesToRemove[i5], 1);
      this._myIndex.removeAll(indicesToRemove);
    }
    return results;
  }
  removeAt(idx) {
    if (this._invertedIndex)
      removeFromInvertedIndex(this._invertedIndex, idx);
    let doc2 = this._docs.splice(idx, 1)[0];
    return this._myIndex.removeAt(idx), doc2;
  }
  getIndex() {
    return this._myIndex;
  }
  search(query3, options2) {
    let {
      limit = -1
    } = options2 || {}, {
      includeMatches,
      includeScore,
      shouldSort,
      sortFn,
      ignoreFieldNorm
    } = this.options;
    if (isString2(query3) && !query3.trim()) {
      let docs = this._docs.map((item, idx) => ({
        item,
        refIndex: idx
      }));
      if (isNumber3(limit) && limit > -1)
        docs = docs.slice(0, limit);
      return docs;
    }
    let useHeap = isNumber3(limit) && limit > 0 && isString2(query3), results;
    if (useHeap) {
      let heap = new MaxHeap(limit);
      if (isString2(this._docs[0]))
        this._searchStringList(query3, {
          heap,
          ignoreFieldNorm
        });
      else
        this._searchObjectList(query3, {
          heap,
          ignoreFieldNorm
        });
      results = heap.extractSorted(sortFn);
    } else {
      if (results = isString2(query3) ? isString2(this._docs[0]) ? this._searchStringList(query3) : this._searchObjectList(query3) : this._searchLogical(query3), computeScore(results, {
        ignoreFieldNorm
      }), shouldSort)
        results.sort(sortFn);
      if (isNumber3(limit) && limit > -1)
        results = results.slice(0, limit);
    }
    return format5(results, this._docs, {
      includeMatches,
      includeScore
    });
  }
  _searchStringList(query3, {
    heap,
    ignoreFieldNorm
  } = {}) {
    let searcher = this._getSearcher(query3), {
      records
    } = this._myIndex, results = heap ? null : [];
    return records.forEach(({
      v: text2,
      i: idx,
      n: norm2
    }) => {
      if (!isDefined2(text2))
        return;
      let {
        isMatch,
        score,
        indices
      } = searcher.searchIn(text2);
      if (isMatch) {
        let result = {
          item: text2,
          idx,
          matches: [{
            score,
            value: text2,
            norm: norm2,
            indices
          }]
        };
        if (heap) {
          if (result.score = computeScoreSingle(result.matches, {
            ignoreFieldNorm
          }), heap.shouldInsert(result.score))
            heap.insert(result);
        } else
          results.push(result);
      }
    }), results;
  }
  _searchLogical(query3) {
    let expression = parse18(query3, this.options), evaluate = (node2, item, idx) => {
      if (!("children" in node2)) {
        let {
          keyId,
          searcher
        } = node2, matches2;
        if (keyId === null)
          matches2 = [], this._myIndex.keys.forEach((key3, keyIndex) => {
            matches2.push(...this._findMatches({
              key: key3,
              value: item[keyIndex],
              searcher
            }));
          });
        else
          matches2 = this._findMatches({
            key: this._keyStore.get(keyId),
            value: this._myIndex.getValueForItemAtKeyId(item, keyId),
            searcher
          });
        if (matches2 && matches2.length)
          return [{
            idx,
            item,
            matches: matches2
          }];
        return [];
      }
      let {
        children,
        operator
      } = node2, res = [];
      for (let i5 = 0, len = children.length;i5 < len; i5 += 1) {
        let child = children[i5], result = evaluate(child, item, idx);
        if (result.length)
          res.push(...result);
        else if (operator === LogicalOperator.AND)
          return [];
      }
      return res;
    }, records = this._myIndex.records, resultMap = /* @__PURE__ */ new Map, results = [];
    return records.forEach(({
      $: item,
      i: idx
    }) => {
      if (isDefined2(item)) {
        let expResults = evaluate(expression, item, idx);
        if (expResults.length) {
          if (!resultMap.has(idx))
            resultMap.set(idx, {
              idx,
              item,
              matches: []
            }), results.push(resultMap.get(idx));
          expResults.forEach(({
            matches: matches2
          }) => {
            resultMap.get(idx).matches.push(...matches2);
          });
        }
      }
    }), results;
  }
  _searchObjectList(query3, {
    heap,
    ignoreFieldNorm
  } = {}) {
    let searcher = this._getSearcher(query3), {
      keys: keys3,
      records
    } = this._myIndex, results = heap ? null : [];
    return records.forEach(({
      $: item,
      i: idx
    }) => {
      if (!isDefined2(item))
        return;
      let matches2 = [], anyKeyFailed = !1, hasInverse = !1;
      if (keys3.forEach((key3, keyIndex) => {
        let keyMatches = this._findMatches({
          key: key3,
          value: item[keyIndex],
          searcher
        });
        if (keyMatches.length) {
          if (matches2.push(...keyMatches), keyMatches[0].hasInverse)
            hasInverse = !0;
        } else
          anyKeyFailed = !0;
      }), hasInverse && anyKeyFailed)
        return;
      if (matches2.length) {
        let result = {
          idx,
          item,
          matches: matches2
        };
        if (heap) {
          if (result.score = computeScoreSingle(result.matches, {
            ignoreFieldNorm
          }), heap.shouldInsert(result.score))
            heap.insert(result);
        } else
          results.push(result);
      }
    }), results;
  }
  _findMatches({
    key: key3,
    value,
    searcher
  }) {
    if (!isDefined2(value))
      return [];
    let matches2 = [];
    if (isArray8(value))
      value.forEach(({
        v: text2,
        i: idx,
        n: norm2
      }) => {
        if (!isDefined2(text2))
          return;
        let {
          isMatch,
          score,
          indices,
          hasInverse
        } = searcher.searchIn(text2);
        if (isMatch)
          matches2.push({
            score,
            key: key3,
            value: text2,
            idx,
            norm: norm2,
            indices,
            hasInverse
          });
      });
    else {
      let {
        v: text2,
        n: norm2
      } = value, {
        isMatch,
        score,
        indices,
        hasInverse
      } = searcher.searchIn(text2);
      if (isMatch)
        matches2.push({
          score,
          key: key3,
          value: text2,
          norm: norm2,
          indices,
          hasInverse
        });
    }
    return matches2;
  }
}
