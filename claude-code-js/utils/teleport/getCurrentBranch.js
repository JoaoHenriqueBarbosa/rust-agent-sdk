// function: getCurrentBranch
async function getCurrentBranch() {
  let {
    stdout: currentBranch
  } = await execFileNoThrow(gitExe(), ["branch", "--show-current"]);
  return currentBranch.trim();
}
