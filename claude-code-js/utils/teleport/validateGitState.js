// function: validateGitState
async function validateGitState() {
  if (!await getIsClean({
    ignoreUntracked: !0
  }))
    throw logEvent("tengu_teleport_error_git_not_clean", {}), new TeleportOperationError("Git working directory is not clean. Please commit or stash your changes before using --teleport.", source_default.red(`Error: Git working directory is not clean. Please commit or stash your changes before using --teleport.
`));
}
