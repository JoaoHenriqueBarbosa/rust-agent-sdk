// function: fetchFromOrigin
async function fetchFromOrigin(branch) {
  let fetchArgs = branch ? ["fetch", "origin", `${branch}:${branch}`] : ["fetch", "origin"], {
    code: fetchCode,
    stderr: fetchStderr
  } = await execFileNoThrow(gitExe(), fetchArgs);
  if (fetchCode !== 0)
    if (branch && fetchStderr.includes("refspec")) {
      logForDebugging(`Specific branch fetch failed, trying to fetch ref: ${branch}`);
      let {
        code: refFetchCode,
        stderr: refFetchStderr
      } = await execFileNoThrow(gitExe(), ["fetch", "origin", branch]);
      if (refFetchCode !== 0)
        logError2(Error(`Failed to fetch from remote origin: ${refFetchStderr}`));
    } else
      logError2(Error(`Failed to fetch from remote origin: ${fetchStderr}`));
}
