// function: pathInOriginalCwd
function pathInOriginalCwd(path16) {
  return pathInWorkingPath(path16, getOriginalCwd());
}
