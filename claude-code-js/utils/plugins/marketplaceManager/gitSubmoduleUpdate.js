// function: gitSubmoduleUpdate
async function gitSubmoduleUpdate(cwd2, credentialArgs, env5, sparsePaths) {
  if (sparsePaths && sparsePaths.length > 0)
    return;
  if (!await getFsImplementation().stat(join97(cwd2, ".gitmodules")).then(() => !0, () => !1))
    return;
  let result = await execFileNoThrowWithCwd(gitExe(), [
    "-c",
    "core.sshCommand=ssh -o BatchMode=yes -o StrictHostKeyChecking=yes",
    ...credentialArgs,
    "submodule",
    "update",
    "--init",
    "--recursive",
    "--depth",
    "1"
  ], { cwd: cwd2, timeout: getPluginGitTimeoutMs(), stdin: "ignore", env: env5 });
  if (result.code !== 0)
    logForDebugging(`git submodule update failed (non-fatal): ${result.stderr}`, { level: "warn" });
}
