// function: normalizePathForSandbox
function normalizePathForSandbox(pathPattern) {
  let cwd2 = process.cwd(), normalizedPath = pathPattern;
  if (pathPattern === "~")
    normalizedPath = homedir14();
  else if (pathPattern.startsWith("~/"))
    normalizedPath = homedir14() + pathPattern.slice(1);
  else if (pathPattern.startsWith("./") || pathPattern.startsWith("../"))
    normalizedPath = path13.resolve(cwd2, pathPattern);
  else if (!path13.isAbsolute(pathPattern))
    normalizedPath = path13.resolve(cwd2, pathPattern);
  if (containsGlobChars(normalizedPath)) {
    let staticPrefix = normalizedPath.split(/[*?[\]]/)[0];
    if (staticPrefix && staticPrefix !== "/") {
      let baseDir = staticPrefix.endsWith("/") ? staticPrefix.slice(0, -1) : path13.dirname(staticPrefix);
      try {
        let resolvedBaseDir = fs10.realpathSync(baseDir);
        if (!isSymlinkOutsideBoundary(baseDir, resolvedBaseDir)) {
          let patternSuffix = normalizedPath.slice(baseDir.length);
          return resolvedBaseDir + patternSuffix;
        }
      } catch {}
    }
    return normalizedPath;
  }
  try {
    let resolvedPath5 = fs10.realpathSync(normalizedPath);
    if (isSymlinkOutsideBoundary(normalizedPath, resolvedPath5))
      ;
    else
      normalizedPath = resolvedPath5;
  } catch {}
  return normalizedPath;
}
