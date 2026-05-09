// function: addToInvertedIndex
function addToInvertedIndex(index2, record3, keyCount, analyzer) {
  let {
    i: docIdx,
    v: v2,
    $: fields
  } = record3;
  function addField(text2, keyIdx, subIdx) {
    let tokens = analyzer.tokenize(text2);
    if (!tokens.length)
      return;
    index2.fieldCount++;
    let termFreqs = /* @__PURE__ */ new Map;
    for (let token of tokens)
      termFreqs.set(token, (termFreqs.get(token) || 0) + 1);
    for (let [term, tf] of termFreqs) {
      let posting = {
        docIdx,
        keyIdx,
        subIdx,
        tf
      }, postings = index2.terms.get(term);
      if (!postings)
        postings = [], index2.terms.set(term, postings);
      postings.push(posting), index2.df.set(term, (index2.df.get(term) || 0) + 1);
    }
  }
  if (v2 !== void 0) {
    addField(v2, -1, -1);
    return;
  }
  if (fields)
    for (let keyIdx = 0;keyIdx < keyCount; keyIdx++) {
      let value = fields[keyIdx];
      if (!value)
        continue;
      if (Array.isArray(value))
        for (let sub of value)
          addField(sub.v, keyIdx, sub.i ?? -1);
      else
        addField(value.v, keyIdx, -1);
    }
}
