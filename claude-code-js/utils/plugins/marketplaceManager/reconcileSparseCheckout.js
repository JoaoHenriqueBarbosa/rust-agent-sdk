// function: reconcileSparseCheckout
async function reconcileSparseCheckout(cwd2, sparsePaths) {
  let env5 = { ...process.env, ...GIT_NO_PROMPT_ENV };
  if (sparsePaths && sparsePaths.length > 0)
    return execFileNoThrowWithCwd(gitExe(), ["sparse-checkout", "set", "--cone", "--", ...sparsePaths], { cwd: cwd2, timeout: getPluginGitTimeoutMs(), stdin: "ignore", env: env5 });
  let check3 = await execFileNoThrowWithCwd(gitExe(), ["config", "--get", "core.sparseCheckout"], { cwd: cwd2, stdin: "ignore", env: env5 });
  if (check3.code === 0 && check3.stdout.trim() === "true")
    return {
      code: 1,
      stderr: "sparsePaths removed from config but repository is sparse; re-cloning for full checkout"
    };
  return { code: 0, stderr: "" };
}
