// function: generateWriteRules
function generateWriteRules(config8, logTag, allowGitConfig = !1) {
  if (!config8)
    return ["(allow file-write*)"];
  let rules = [];
  for (let pathPattern of config8.allowOnly || []) {
    let normalizedPath = normalizePathForSandbox(pathPattern);
    if (containsGlobChars(normalizedPath)) {
      let regexPattern = globToRegex(normalizedPath);
      rules.push("(allow file-write*", `  (regex ${escapePath(regexPattern)})`, `  (with message "${logTag}"))`);
    } else
      rules.push("(allow file-write*", `  (subpath ${escapePath(normalizedPath)})`, `  (with message "${logTag}"))`);
  }
  let denyPaths = [
    ...config8.denyWithinAllow || [],
    ...macGetMandatoryDenyPatterns(allowGitConfig)
  ];
  for (let pathPattern of denyPaths) {
    let normalizedPath = normalizePathForSandbox(pathPattern);
    if (containsGlobChars(normalizedPath)) {
      let regexPattern = globToRegex(normalizedPath);
      rules.push("(deny file-write*", `  (regex ${escapePath(regexPattern)})`, `  (with message "${logTag}"))`);
    } else
      rules.push("(deny file-write*", `  (subpath ${escapePath(normalizedPath)})`, `  (with message "${logTag}"))`);
  }
  return rules.push(...generateMoveBlockingRules(denyPaths, logTag)), rules;
}
