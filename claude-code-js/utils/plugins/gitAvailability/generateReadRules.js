// function: generateReadRules
function generateReadRules(config8, logTag, writeAllowPaths) {
  if (!config8)
    return ["(allow file-read*)"];
  let rules = [], deniesRoot = !1;
  rules.push("(allow file-read*)");
  for (let pathPattern of config8.denyOnly || []) {
    let normalizedPath = normalizePathForSandbox(pathPattern);
    if (normalizedPath === "/")
      deniesRoot = !0;
    if (containsGlobChars(normalizedPath)) {
      let regexPattern = globToRegex(normalizedPath);
      rules.push("(deny file-read*", `  (regex ${escapePath(regexPattern)})`, `  (with message "${logTag}"))`);
    } else
      rules.push("(deny file-read*", `  (subpath ${escapePath(normalizedPath)})`, `  (with message "${logTag}"))`);
  }
  if (deniesRoot)
    rules.push('(allow file-read* (literal "/"))');
  for (let pathPattern of config8.allowWithinDeny || []) {
    let normalizedPath = normalizePathForSandbox(pathPattern);
    if (containsGlobChars(normalizedPath)) {
      let regexPattern = globToRegex(normalizedPath);
      rules.push("(allow file-read*", `  (regex ${escapePath(regexPattern)})`, `  (with message "${logTag}"))`);
    } else
      rules.push("(allow file-read*", `  (subpath ${escapePath(normalizedPath)})`, `  (with message "${logTag}"))`);
  }
  if (config8.denyOnly.length > 0)
    rules.push("(allow file-read-metadata", "  (vnode-type DIRECTORY))");
  if (rules.push(...generateMoveBlockingRules(config8.denyOnly || [], logTag)), writeAllowPaths && writeAllowPaths.length > 0)
    for (let pathPattern of writeAllowPaths) {
      let normalizedPath = normalizePathForSandbox(pathPattern);
      if (containsGlobChars(normalizedPath)) {
        let regexPattern = globToRegex(normalizedPath);
        rules.push("(allow file-write-unlink", `  (regex ${escapePath(regexPattern)})`, `  (with message "${logTag}"))`);
      } else
        rules.push("(allow file-write-unlink", `  (subpath ${escapePath(normalizedPath)})`, `  (with message "${logTag}"))`);
    }
  return rules;
}
