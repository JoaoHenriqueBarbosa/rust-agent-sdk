// var: init_gitAvailability
var init_gitAvailability = __esm(() => {
  init_memoize();
  init_which();
  checkGitAvailable = memoize_default(async () => {
    return isCommandAvailable2("git");
  });
});
