// function: parseQuery
function parseQuery(pattern, options2 = {}) {
  return pattern.replace(/\\\|/g, ESCAPED_PIPE).split(OR_TOKEN).map((item) => {
    let restored = item.replace(/\u0000/g, "|"), query3 = tokenize6(restored.trim()).filter((item2) => item2 && !!item2.trim()), results = [];
    for (let i5 = 0, len = query3.length;i5 < len; i5 += 1) {
      let queryItem = query3[i5], found = !1, idx = -1;
      while (!found && ++idx < searchersLen) {
        let searcher = searchers[idx], token = searcher.isMultiMatch(queryItem);
        if (token)
          results.push(new searcher(token, options2)), found = !0;
      }
      if (found)
        continue;
      idx = -1;
      while (++idx < searchersLen) {
        let searcher = searchers[idx], token = searcher.isSingleMatch(queryItem);
        if (token) {
          results.push(new searcher(token, options2));
          break;
        }
      }
    }
    return results;
  });
}
