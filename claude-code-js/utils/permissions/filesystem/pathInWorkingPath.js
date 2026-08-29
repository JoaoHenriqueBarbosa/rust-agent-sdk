// function: pathInWorkingPath
function pathInWorkingPath(path25, workingPath) {
  let absolutePath = expandPath(path25), absoluteWorkingPath = expandPath(workingPath), normalizedPath = absolutePath.replace(/^\/private\/var\//, "/var/").replace(/^\/private\/tmp(\/|$)/, "/tmp$1"), normalizedWorkingPath = absoluteWorkingPath.replace(/^\/private\/var\//, "/var/").replace(/^\/private\/tmp(\/|$)/, "/tmp$1"), caseNormalizedPath = normalizeCaseForComparison2(normalizedPath), caseNormalizedWorkingPath = normalizeCaseForComparison2(normalizedWorkingPath), relative28 = relativePath(caseNormalizedWorkingPath, caseNormalizedPath);
  if (relative28 === "")
    return !0;
  if (containsPathTraversal(relative28))
    return !1;
  return !posix7.isAbsolute(relative28);
}
