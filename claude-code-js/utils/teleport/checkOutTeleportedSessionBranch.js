// function: checkOutTeleportedSessionBranch
async function checkOutTeleportedSessionBranch(branch) {
  try {
    let currentBranch = await getCurrentBranch();
    if (logForDebugging(`Current branch before teleport: '${currentBranch}'`), branch) {
      logForDebugging(`Switching to branch '${branch}'...`), await fetchFromOrigin(branch), await checkoutBranch(branch);
      let newBranch = await getCurrentBranch();
      logForDebugging(`Branch after checkout: '${newBranch}'`);
    } else
      logForDebugging("No branch specified, staying on current branch");
    return {
      branchName: await getCurrentBranch(),
      branchError: null
    };
  } catch (error44) {
    let branchName = await getCurrentBranch(), branchError = toError(error44);
    return {
      branchName,
      branchError
    };
  }
}
