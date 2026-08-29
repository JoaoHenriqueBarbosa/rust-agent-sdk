// function: expandGlobPattern
function expandGlobPattern(globPath) {
  let normalizedPattern = normalizePathForSandbox(globPath), staticPrefix = normalizedPattern.split(/[*?[\]]/)[0];
  if (!staticPrefix || staticPrefix === "/")
    return logForDebugging2(`[Sandbox] Glob pattern too broad, skipping: ${globPath}`), [];
  let baseDir = staticPrefix.endsWith("/") ? staticPrefix.slice(0, -1) : path13.dirname(staticPrefix);
  if (!fs10.existsSync(baseDir))
    return logForDebugging2(`[Sandbox] Base directory for glob does not exist: ${baseDir}`), [];
  let regex2 = new RegExp(globToRegex(normalizedPattern)), results = [];
  try {
    let entries = fs10.readdirSync(baseDir, {
      recursive: !0,
      withFileTypes: !0
    });
    for (let entry of entries) {
      let parentDir = entry.parentPath ?? entry.path ?? baseDir, fullPath = path13.join(parentDir, entry.name);
      if (regex2.test(fullPath))
        results.push(fullPath);
    }
  } catch (err) {
    logForDebugging2(`[Sandbox] Error expanding glob pattern ${globPath}: ${err}`);
  }
  return results;
}
