// function: gitPull
async function gitPull(cwd2, ref, options2) {
  logForDebugging(`git pull: cwd=${cwd2} ref=${ref ?? "default"}`);
  let env5 = { ...process.env, ...GIT_NO_PROMPT_ENV }, credentialArgs = options2?.disableCredentialHelper ? ["-c", "credential.helper="] : [];
  if (ref) {
    let fetchResult = await execFileNoThrowWithCwd(gitExe(), [...credentialArgs, "fetch", "origin", ref], { cwd: cwd2, timeout: getPluginGitTimeoutMs(), stdin: "ignore", env: env5 });
    if (fetchResult.code !== 0)
      return enhanceGitPullErrorMessages(fetchResult);
    let checkoutResult = await execFileNoThrowWithCwd(gitExe(), [...credentialArgs, "checkout", ref], { cwd: cwd2, timeout: getPluginGitTimeoutMs(), stdin: "ignore", env: env5 });
    if (checkoutResult.code !== 0)
      return enhanceGitPullErrorMessages(checkoutResult);
    let pullResult = await execFileNoThrowWithCwd(gitExe(), [...credentialArgs, "pull", "origin", ref], { cwd: cwd2, timeout: getPluginGitTimeoutMs(), stdin: "ignore", env: env5 });
    if (pullResult.code !== 0)
      return enhanceGitPullErrorMessages(pullResult);
    return await gitSubmoduleUpdate(cwd2, credentialArgs, env5, options2?.sparsePaths), pullResult;
  }
  let result = await execFileNoThrowWithCwd(gitExe(), [...credentialArgs, "pull", "origin", "HEAD"], { cwd: cwd2, timeout: getPluginGitTimeoutMs(), stdin: "ignore", env: env5 });
  if (result.code !== 0)
    return enhanceGitPullErrorMessages(result);
  return await gitSubmoduleUpdate(cwd2, credentialArgs, env5, options2?.sparsePaths), result;
}
