// function: handleCheckPropertyResult
function handleCheckPropertyResult(result, payload, property2) {
  if (result.issues.length)
    payload.issues.push(...prefixIssues(property2, result.issues));
}
