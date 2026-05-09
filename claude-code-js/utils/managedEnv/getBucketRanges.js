// function: getBucketRanges
function getBucketRanges(numVariations, coverage, weights) {
  if (coverage = coverage === void 0 ? 1 : coverage, coverage < 0)
    console.error("Experiment.coverage must be greater than or equal to 0"), coverage = 0;
  else if (coverage > 1)
    console.error("Experiment.coverage must be less than or equal to 1"), coverage = 1;
  let equal = getEqualWeights(numVariations);
  if (weights = weights || equal, weights.length !== numVariations)
    console.error("Experiment.weights array must be the same length as Experiment.variations"), weights = equal;
  let totalWeight = weights.reduce((w2, sum) => sum + w2, 0);
  if (totalWeight < 0.99 || totalWeight > 1.01)
    console.error("Experiment.weights must add up to 1"), weights = equal;
  let cumulative = 0;
  return weights.map((w2) => {
    let start = cumulative;
    return cumulative += w2, [start, start + coverage * w2];
  });
}
