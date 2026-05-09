// function: computeScore
function computeScore(results, {
  ignoreFieldNorm = Config2.ignoreFieldNorm
}) {
  results.forEach((result) => {
    result.score = computeScoreSingle(result.matches, {
      ignoreFieldNorm
    });
  });
}
