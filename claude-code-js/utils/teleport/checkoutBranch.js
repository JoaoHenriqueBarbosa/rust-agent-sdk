// function: checkoutBranch
async function checkoutBranch(branchName) {
  let {
    code: checkoutCode,
    stderr: checkoutStderr
  } = await execFileNoThrow(gitExe(), ["checkout", branchName]);
  if (checkoutCode !== 0) {
    logForDebugging(`Local checkout failed, trying to checkout from origin: ${checkoutStderr}`);
    let result = await execFileNoThrow(gitExe(), ["checkout", "-b", branchName, "--track", `origin/${branchName}`]);
    if (checkoutCode = result.code, checkoutStderr = result.stderr, checkoutCode !== 0) {
      logForDebugging(`Remote checkout with -b failed, trying without -b: ${checkoutStderr}`);
      let finalResult = await execFileNoThrow(gitExe(), ["checkout", "--track", `origin/${branchName}`]);
      checkoutCode = finalResult.code, checkoutStderr = finalResult.stderr;
    }
  }
  if (checkoutCode !== 0)
    throw logEvent("tengu_teleport_error_branch_checkout_failed", {}), new TeleportOperationError(`Failed to checkout branch '${branchName}': ${checkoutStderr}`, source_default.red(`Failed to checkout branch '${branchName}'
`));
  await ensureUpstreamIsSet(branchName);
}
