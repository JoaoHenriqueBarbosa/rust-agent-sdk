// function: normalizePatternsToPath
function normalizePatternsToPath(patternsByRoot, root3) {
  let result = new Set(patternsByRoot.get(null) ?? []);
  for (let [patternRoot, patterns] of patternsByRoot.entries()) {
    if (patternRoot === null)
      continue;
    for (let pattern of patterns) {
      let normalizedPattern = normalizePatternToPath({
        patternRoot,
        pattern,
        rootPath: root3
      });
      if (normalizedPattern)
        result.add(normalizedPattern);
    }
  }
  return Array.from(result);
}
