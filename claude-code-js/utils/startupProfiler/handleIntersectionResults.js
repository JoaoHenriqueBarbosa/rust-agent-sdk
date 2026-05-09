// function: handleIntersectionResults
function handleIntersectionResults(result, left, right) {
  if (left.issues.length)
    result.issues.push(...left.issues);
  if (right.issues.length)
    result.issues.push(...right.issues);
  if (aborted(result))
    return result;
  let merged = mergeValues(left.value, right.value);
  if (!merged.valid)
    throw Error(`Unmergable intersection. Error path: ${JSON.stringify(merged.mergeErrorPath)}`);
  return result.value = merged.data, result;
}
