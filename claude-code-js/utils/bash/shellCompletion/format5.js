// function: format5
function format5(results, docs, {
  includeMatches = Config2.includeMatches,
  includeScore = Config2.includeScore
} = {}) {
  let transformers = [];
  if (includeMatches)
    transformers.push(transformMatches);
  if (includeScore)
    transformers.push(transformScore);
  return results.map((result) => {
    let {
      idx
    } = result, data = {
      item: docs[idx],
      refIndex: idx
    };
    if (transformers.length)
      transformers.forEach((transformer) => {
        transformer(result, data);
      });
    return data;
  });
}
