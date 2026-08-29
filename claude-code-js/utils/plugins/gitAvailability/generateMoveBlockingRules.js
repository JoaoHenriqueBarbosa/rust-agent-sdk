// function: generateMoveBlockingRules
function generateMoveBlockingRules(pathPatterns, logTag) {
  let rules = [];
  for (let pathPattern of pathPatterns) {
    let normalizedPath = normalizePathForSandbox(pathPattern);
    if (containsGlobChars(normalizedPath)) {
      let regexPattern = globToRegex(normalizedPath);
      rules.push("(deny file-write-unlink", `  (regex ${escapePath(regexPattern)})`, `  (with message "${logTag}"))`);
      let staticPrefix = normalizedPath.split(/[*?[\]]/)[0];
      if (staticPrefix && staticPrefix !== "/") {
        let baseDir = staticPrefix.endsWith("/") ? staticPrefix.slice(0, -1) : path15.dirname(staticPrefix);
        rules.push("(deny file-write-unlink", `  (literal ${escapePath(baseDir)})`, `  (with message "${logTag}"))`);
        for (let ancestorDir of getAncestorDirectories(baseDir))
          rules.push("(deny file-write-unlink", `  (literal ${escapePath(ancestorDir)})`, `  (with message "${logTag}"))`);
      }
    } else {
      rules.push("(deny file-write-unlink", `  (subpath ${escapePath(normalizedPath)})`, `  (with message "${logTag}"))`);
      for (let ancestorDir of getAncestorDirectories(normalizedPath))
        rules.push("(deny file-write-unlink", `  (literal ${escapePath(ancestorDir)})`, `  (with message "${logTag}"))`);
    }
  }
  return rules;
}
