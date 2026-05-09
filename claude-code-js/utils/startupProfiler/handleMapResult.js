// function: handleMapResult
function handleMapResult(keyResult, valueResult, final, key, input, inst, ctx) {
  if (keyResult.issues.length)
    if (propertyKeyTypes.has(typeof key))
      final.issues.push(...prefixIssues(key, keyResult.issues));
    else
      final.issues.push({
        origin: "map",
        code: "invalid_key",
        input,
        inst,
        issues: keyResult.issues.map((iss) => finalizeIssue(iss, ctx, config()))
      });
  if (valueResult.issues.length)
    if (propertyKeyTypes.has(typeof key))
      final.issues.push(...prefixIssues(key, valueResult.issues));
    else
      final.issues.push({
        origin: "map",
        code: "invalid_element",
        input,
        inst,
        key,
        issues: valueResult.issues.map((iss) => finalizeIssue(iss, ctx, config()))
      });
  final.value.set(keyResult.value, valueResult.value);
}
