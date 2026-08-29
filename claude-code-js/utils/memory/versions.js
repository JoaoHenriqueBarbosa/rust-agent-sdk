// Original: src/utils/memory/versions.ts
function projectIsInGitRepo(cwd2) {
  return findGitRoot(cwd2) !== null;
}
var init_versions2 = __esm(() => {
  init_git();
});
