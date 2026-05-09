// var: require_suggestSimilar
var require_suggestSimilar = __commonJS((exports) => {
  function editDistance(a2, b) {
    if (Math.abs(a2.length - b.length) > 3)
      return Math.max(a2.length, b.length);
    let d = [];
    for (let i5 = 0;i5 <= a2.length; i5++)
      d[i5] = [i5];
    for (let j4 = 0;j4 <= b.length; j4++)
      d[0][j4] = j4;
    for (let j4 = 1;j4 <= b.length; j4++)
      for (let i5 = 1;i5 <= a2.length; i5++) {
        let cost2 = 1;
        if (a2[i5 - 1] === b[j4 - 1])
          cost2 = 0;
        else
          cost2 = 1;
        if (d[i5][j4] = Math.min(d[i5 - 1][j4] + 1, d[i5][j4 - 1] + 1, d[i5 - 1][j4 - 1] + cost2), i5 > 1 && j4 > 1 && a2[i5 - 1] === b[j4 - 2] && a2[i5 - 2] === b[j4 - 1])
          d[i5][j4] = Math.min(d[i5][j4], d[i5 - 2][j4 - 2] + 1);
      }
    return d[a2.length][b.length];
  }
  function suggestSimilar(word, candidates) {
    if (!candidates || candidates.length === 0)
      return "";
    candidates = Array.from(new Set(candidates));
    let searchingOptions = word.startsWith("--");
    if (searchingOptions)
      word = word.slice(2), candidates = candidates.map((candidate) => candidate.slice(2));
    let similar = [], bestDistance = 3, minSimilarity = 0.4;
    if (candidates.forEach((candidate) => {
      if (candidate.length <= 1)
        return;
      let distance = editDistance(word, candidate), length = Math.max(word.length, candidate.length);
      if ((length - distance) / length > minSimilarity) {
        if (distance < bestDistance)
          bestDistance = distance, similar = [candidate];
        else if (distance === bestDistance)
          similar.push(candidate);
      }
    }), similar.sort((a2, b) => a2.localeCompare(b)), searchingOptions)
      similar = similar.map((candidate) => `--${candidate}`);
    if (similar.length > 1)
      return `
(Did you mean one of ${similar.join(", ")}?)`;
    if (similar.length === 1)
      return `
(Did you mean ${similar[0]}?)`;
    return "";
  }
  exports.suggestSimilar = suggestSimilar;
});
