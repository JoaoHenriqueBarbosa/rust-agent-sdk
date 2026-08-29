// function: handleSetResult
function handleSetResult(result, final) {
  if (result.issues.length)
    final.issues.push(...result.issues);
  final.value.add(result.value);
}
