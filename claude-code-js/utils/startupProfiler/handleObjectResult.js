// function: handleObjectResult
function handleObjectResult(result, final, key) {
  if (result.issues.length)
    final.issues.push(...prefixIssues(key, result.issues));
  final.value[key] = result.value;
}
