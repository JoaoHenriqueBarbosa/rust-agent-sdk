// function: handleOptionalObjectResult
function handleOptionalObjectResult(result, final, key, input) {
  if (result.issues.length)
    if (input[key] === void 0)
      if (key in input)
        final.value[key] = void 0;
      else
        final.value[key] = result.value;
    else
      final.issues.push(...prefixIssues(key, result.issues));
  else if (result.value === void 0) {
    if (key in input)
      final.value[key] = void 0;
  } else
    final.value[key] = result.value;
}
