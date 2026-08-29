// function: getProjectTempDir
function getProjectTempDir() {
  return join136(getClaudeTempDir(), sanitizePath2(getOriginalCwd())) + sep32;
}
