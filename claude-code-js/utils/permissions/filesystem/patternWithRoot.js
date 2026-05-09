// function: patternWithRoot
function patternWithRoot(pattern, source) {
  if (pattern.startsWith(`${DIR_SEP}${DIR_SEP}`)) {
    let patternWithoutDoubleSlash = pattern.slice(1);
    if (getPlatform() === "windows" && patternWithoutDoubleSlash.match(/^\/[a-z]\//i)) {
      let driveLetter = patternWithoutDoubleSlash[1]?.toUpperCase() ?? "C", pathAfterDrive = patternWithoutDoubleSlash.slice(2), driveRoot = `${driveLetter}:\\`;
      return {
        relativePattern: pathAfterDrive.startsWith("/") ? pathAfterDrive.slice(1) : pathAfterDrive,
        root: driveRoot
      };
    }
    return {
      relativePattern: patternWithoutDoubleSlash,
      root: DIR_SEP
    };
  } else if (pattern.startsWith(`~${DIR_SEP}`))
    return {
      relativePattern: pattern.slice(1),
      root: homedir34().normalize("NFC")
    };
  else if (pattern.startsWith(DIR_SEP))
    return {
      relativePattern: pattern,
      root: rootPathForSource(source)
    };
  let normalizedPattern = pattern;
  if (pattern.startsWith(`.${DIR_SEP}`))
    normalizedPattern = pattern.slice(2);
  return {
    relativePattern: normalizedPattern,
    root: null
  };
}
