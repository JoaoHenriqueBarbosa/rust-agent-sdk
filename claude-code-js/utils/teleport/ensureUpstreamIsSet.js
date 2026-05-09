// function: ensureUpstreamIsSet
async function ensureUpstreamIsSet(branchName) {
  let {
    code: upstreamCheckCode
  } = await execFileNoThrow(gitExe(), ["rev-parse", "--abbrev-ref", `${branchName}@{upstream}`]);
  if (upstreamCheckCode === 0) {
    logForDebugging(`Branch '${branchName}' already has upstream set`);
    return;
  }
  let {
    code: remoteCheckCode
  } = await execFileNoThrow(gitExe(), ["rev-parse", "--verify", `origin/${branchName}`]);
  if (remoteCheckCode === 0) {
    logForDebugging(`Setting upstream for '${branchName}' to 'origin/${branchName}'`);
    let {
      code: setUpstreamCode,
      stderr: setUpstreamStderr
    } = await execFileNoThrow(gitExe(), ["branch", "--set-upstream-to", `origin/${branchName}`, branchName]);
    if (setUpstreamCode !== 0)
      logForDebugging(`Failed to set upstream for '${branchName}': ${setUpstreamStderr}`);
    else
      logForDebugging(`Successfully set upstream for '${branchName}'`);
  } else
    logForDebugging(`Remote branch 'origin/${branchName}' does not exist, skipping upstream setup`);
}
