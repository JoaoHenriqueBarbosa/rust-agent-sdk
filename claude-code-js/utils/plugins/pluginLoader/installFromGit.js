// function: installFromGit
async function installFromGit(gitUrl, targetPath, ref, sha) {
  let safeUrl = validateGitUrl(gitUrl);
  await gitClone2(safeUrl, targetPath, ref, sha);
  let refMessage = ref ? ` (ref: ${ref})` : "";
  logForDebugging(`Cloned repository from ${safeUrl}${refMessage} to ${targetPath}`);
}
