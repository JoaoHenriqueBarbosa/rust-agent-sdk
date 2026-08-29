// function: buildInvertedIndex
function buildInvertedIndex(records, keyCount, analyzer) {
  let terms = /* @__PURE__ */ new Map, df = /* @__PURE__ */ new Map, fieldCount = 0;
  function addField(text2, docIdx, keyIdx, subIdx) {
    let tokens = analyzer.tokenize(text2);
    if (!tokens.length)
      return;
    fieldCount++;
    let termFreqs = /* @__PURE__ */ new Map;
    for (let token of tokens)
      termFreqs.set(token, (termFreqs.get(token) || 0) + 1);
    for (let [term, tf] of termFreqs) {
      let posting = {
        docIdx,
        keyIdx,
        subIdx,
        tf
      }, postings = terms.get(term);
      if (!postings)
        postings = [], terms.set(term, postings);
      postings.push(posting), df.set(term, (df.get(term) || 0) + 1);
    }
  }
  for (let record3 of records) {
    let {
      i: docIdx,
      v: v2,
      $: fields
    } = record3;
    if (v2 !== void 0) {
      addField(v2, docIdx, -1, -1);
      continue;
    }
    if (fields)
      for (let keyIdx = 0;keyIdx < keyCount; keyIdx++) {
        let value = fields[keyIdx];
        if (!value)
          continue;
        if (Array.isArray(value))
          for (let sub of value)
            addField(sub.v, docIdx, keyIdx, sub.i ?? -1);
        else
          addField(value.v, docIdx, keyIdx, -1);
      }
  }
  return {
    terms,
    fieldCount,
    df
  };
}
