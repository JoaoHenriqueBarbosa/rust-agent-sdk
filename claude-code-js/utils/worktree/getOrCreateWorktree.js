// function: getOrCreateWorktree
async function getOrCreateWorktree(repoRoot, slug, options2) {
  let worktreePath = worktreePathFor(repoRoot, slug), worktreeBranch = worktreeBranchName(slug), existingHead = await readWorktreeHeadSha(worktreePath);
  if (existingHead)
    return {
      worktreePath,
      worktreeBranch,
      headCommit: existingHead,
      existed: !0
    };
  await mkdir39(worktreesDir(repoRoot), { recursive: !0 });
  let fetchEnv = { ...process.env, ...GIT_NO_PROMPT_ENV2 }, baseBranch, baseSha = null;
  if (options2?.prNumber) {
    let { code: prFetchCode, stderr: prFetchStderr } = await execFileNoThrowWithCwd(gitExe(), ["fetch", "origin", `pull/${options2.prNumber}/head`], { cwd: repoRoot, stdin: "ignore", env: fetchEnv });
    if (prFetchCode !== 0)
      throw Error(`Failed to fetch PR #${options2.prNumber}: ${prFetchStderr.trim() || 'PR may not exist or the repository may not have a remote named "origin"'}`);
    baseBranch = "FETCH_HEAD";
  } else {
    let [defaultBranch, gitDir] = await Promise.all([
      getDefaultBranch(),
      resolveGitDir(repoRoot)
    ]), originRef = `origin/${defaultBranch}`, originSha = gitDir ? await resolveRef(gitDir, `refs/remotes/origin/${defaultBranch}`) : null;
    if (originSha)
      baseBranch = originRef, baseSha = originSha;
    else {
      let { code: fetchCode } = await execFileNoThrowWithCwd(gitExe(), ["fetch", "origin", defaultBranch], { cwd: repoRoot, stdin: "ignore", env: fetchEnv });
      baseBranch = fetchCode === 0 ? originRef : "HEAD";
    }
  }
  if (!baseSha) {
    let { stdout, code: shaCode } = await execFileNoThrowWithCwd(gitExe(), ["rev-parse", baseBranch], { cwd: repoRoot });
    if (shaCode !== 0)
      throw Error(`Failed to resolve base branch "${baseBranch}": git rev-parse failed`);
    baseSha = stdout.trim();
  }
  let sparsePaths = getInitialSettings().worktree?.sparsePaths, addArgs = ["worktree", "add"];
  if (sparsePaths?.length)
    addArgs.push("--no-checkout");
  addArgs.push("-B", worktreeBranch, worktreePath, baseBranch);
  let { code: createCode, stderr: createStderr } = await execFileNoThrowWithCwd(gitExe(), addArgs, { cwd: repoRoot });
  if (createCode !== 0)
    throw Error(`Failed to create worktree: ${createStderr}`);
  if (sparsePaths?.length) {
    let tearDown = async (msg) => {
      throw await execFileNoThrowWithCwd(gitExe(), ["worktree", "remove", "--force", worktreePath], { cwd: repoRoot }), Error(msg);
    }, { code: sparseCode, stderr: sparseErr } = await execFileNoThrowWithCwd(gitExe(), ["sparse-checkout", "set", "--cone", "--", ...sparsePaths], { cwd: worktreePath });
    if (sparseCode !== 0)
      await tearDown(`Failed to configure sparse-checkout: ${sparseErr}`);
    let { code: coCode, stderr: coErr } = await execFileNoThrowWithCwd(gitExe(), ["checkout", "HEAD"], { cwd: worktreePath });
    if (coCode !== 0)
      await tearDown(`Failed to checkout sparse worktree: ${coErr}`);
  }
  return {
    worktreePath,
    worktreeBranch,
    headCommit: baseSha,
    baseBranch,
    existed: !1
  };
}
