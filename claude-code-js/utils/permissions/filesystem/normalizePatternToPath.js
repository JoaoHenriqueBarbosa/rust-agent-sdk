// function: normalizePatternToPath
function normalizePatternToPath({
  patternRoot,
  pattern,
  rootPath
}) {
  let fullPattern = posix7.join(patternRoot, pattern);
  if (patternRoot === rootPath)
    return prependDirSep(pattern);
  else if (fullPattern.startsWith(`${rootPath}${DIR_SEP}`)) {
    let relativePart = fullPattern.slice(rootPath.length);
    return prependDirSep(relativePart);
  } else {
    let relativePath2 = posix7.relative(rootPath, patternRoot);
    if (!relativePath2 || relativePath2.startsWith(`..${DIR_SEP}`) || relativePath2 === "..")
      return null;
    else {
      let relativePattern = posix7.join(relativePath2, pattern);
      return prependDirSep(relativePattern);
    }
  }
}
