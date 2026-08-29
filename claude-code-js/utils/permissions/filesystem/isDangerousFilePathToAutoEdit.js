// function: isDangerousFilePathToAutoEdit
function isDangerousFilePathToAutoEdit(path25) {
  let pathSegments = expandPath(path25).split(sep32), fileName = pathSegments.at(-1);
  if (path25.startsWith("\\\\") || path25.startsWith("//"))
    return !0;
  for (let i5 = 0;i5 < pathSegments.length; i5++) {
    let segment = pathSegments[i5], normalizedSegment = normalizeCaseForComparison2(segment);
    for (let dir of DANGEROUS_DIRECTORIES2) {
      if (normalizedSegment !== normalizeCaseForComparison2(dir))
        continue;
      if (dir === ".claude") {
        let nextSegment = pathSegments[i5 + 1];
        if (nextSegment && normalizeCaseForComparison2(nextSegment) === "worktrees")
          break;
      }
      return !0;
    }
  }
  if (fileName) {
    let normalizedFileName = normalizeCaseForComparison2(fileName);
    if (DANGEROUS_FILES2.some((dangerousFile) => normalizeCaseForComparison2(dangerousFile) === normalizedFileName))
      return !0;
  }
  return !1;
}
