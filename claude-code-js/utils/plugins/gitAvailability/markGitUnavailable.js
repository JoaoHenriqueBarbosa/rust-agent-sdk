// function: markGitUnavailable
function markGitUnavailable() {
  checkGitAvailable.cache?.set?.(void 0, Promise.resolve(!1));
}
