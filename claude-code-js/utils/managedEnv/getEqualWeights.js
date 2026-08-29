// function: getEqualWeights
function getEqualWeights(n6) {
  if (n6 <= 0)
    return [];
  return Array(n6).fill(1 / n6);
}
