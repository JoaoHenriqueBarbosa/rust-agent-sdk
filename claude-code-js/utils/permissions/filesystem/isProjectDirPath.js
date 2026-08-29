// function: isProjectDirPath
function isProjectDirPath(absolutePath) {
  let projectDir = getProjectDir2(getCwd()), normalizedPath = normalize15(absolutePath);
  return normalizedPath === projectDir || normalizedPath.startsWith(projectDir + sep32);
}
