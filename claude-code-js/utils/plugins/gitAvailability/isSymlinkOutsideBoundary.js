// function: isSymlinkOutsideBoundary
function isSymlinkOutsideBoundary(originalPath, resolvedPath5) {
  let normalizedOriginal = path13.normalize(originalPath), normalizedResolved = path13.normalize(resolvedPath5);
  if (normalizedResolved === normalizedOriginal)
    return !1;
  if (normalizedOriginal.startsWith("/tmp/") && normalizedResolved === "/private" + normalizedOriginal)
    return !1;
  if (normalizedOriginal.startsWith("/var/") && normalizedResolved === "/private" + normalizedOriginal)
    return !1;
  if (normalizedOriginal.startsWith("/private/tmp/") && normalizedResolved === normalizedOriginal)
    return !1;
  if (normalizedOriginal.startsWith("/private/var/") && normalizedResolved === normalizedOriginal)
    return !1;
  if (normalizedResolved === "/")
    return !0;
  if (normalizedResolved.split("/").filter(Boolean).length <= 1)
    return !0;
  if (normalizedOriginal.startsWith(normalizedResolved + "/"))
    return !0;
  let canonicalOriginal = normalizedOriginal;
  if (normalizedOriginal.startsWith("/tmp/"))
    canonicalOriginal = "/private" + normalizedOriginal;
  else if (normalizedOriginal.startsWith("/var/"))
    canonicalOriginal = "/private" + normalizedOriginal;
  if (canonicalOriginal !== normalizedOriginal && canonicalOriginal.startsWith(normalizedResolved + "/"))
    return !0;
  let resolvedStartsWithOriginal = normalizedResolved.startsWith(normalizedOriginal + "/"), resolvedStartsWithCanonical = canonicalOriginal !== normalizedOriginal && normalizedResolved.startsWith(canonicalOriginal + "/");
  if (normalizedResolved !== normalizedOriginal && !(canonicalOriginal !== normalizedOriginal && normalizedResolved === canonicalOriginal) && !resolvedStartsWithOriginal && !resolvedStartsWithCanonical)
    return !0;
  return !1;
}
