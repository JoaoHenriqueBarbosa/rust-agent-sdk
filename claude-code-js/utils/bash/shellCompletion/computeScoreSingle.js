// function: computeScoreSingle
function computeScoreSingle(matches2, {
  ignoreFieldNorm = Config2.ignoreFieldNorm
}) {
  let totalScore = 1;
  return matches2.forEach(({
    key: key3,
    norm: norm2,
    score
  }) => {
    let weight = key3 ? key3.weight : null;
    totalScore *= Math.pow(score === 0 && weight ? Number.EPSILON : score, (weight || 1) * (ignoreFieldNorm ? 1 : norm2));
  }), totalScore;
}
