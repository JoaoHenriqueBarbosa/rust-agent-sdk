// function: getAutoMemBase
function getAutoMemBase() {
  return findCanonicalGitRoot(getProjectRoot()) ?? getProjectRoot();
}
