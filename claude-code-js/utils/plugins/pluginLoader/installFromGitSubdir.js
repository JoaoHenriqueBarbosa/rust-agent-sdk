// function: installFromGitSubdir
async function installFromGitSubdir(url3, targetPath, subdirPath, ref, sha) {
  if (!await checkGitAvailable())
    throw Error("git-subdir plugin source requires git to be installed and on PATH. Install git (version 2.25 or later for sparse-checkout cone mode) and try again.");
  let gitUrl = resolveGitSubdirUrl(url3), cloneDir = `${targetPath}.clone`, cloneArgs = [
    "clone",
    "--depth",
    "1",
    "--filter=tree:0",
    "--no-checkout"
  ];
  if (ref)
    cloneArgs.push("--branch", ref);
  cloneArgs.push(gitUrl, cloneDir);
  let cloneResult = await execFileNoThrow(gitExe(), cloneArgs);
  if (cloneResult.code !== 0)
    throw Error(`Failed to clone repository for git-subdir source: ${cloneResult.stderr}`);
  try {
    let sparseResult = await execFileNoThrowWithCwd(gitExe(), ["sparse-checkout", "set", "--cone", "--", subdirPath], { cwd: cloneDir });
    if (sparseResult.code !== 0)
      throw Error(`git sparse-checkout set failed (git >= 2.25 required for cone mode): ${sparseResult.stderr}`);
    let resolvedSha;
    if (sha) {
      if ((await execFileNoThrowWithCwd(gitExe(), ["fetch", "--depth", "1", "origin", sha], { cwd: cloneDir })).code !== 0) {
        logForDebugging(`Shallow fetch of SHA ${sha} failed for git-subdir, falling back to unshallow fetch`);
        let unshallow = await execFileNoThrowWithCwd(gitExe(), ["fetch", "--unshallow"], { cwd: cloneDir });
        if (unshallow.code !== 0)
          throw Error(`Failed to fetch commit ${sha}: ${unshallow.stderr}`);
      }
      let checkout = await execFileNoThrowWithCwd(gitExe(), ["checkout", sha], { cwd: cloneDir });
      if (checkout.code !== 0)
        throw Error(`Failed to checkout commit ${sha}: ${checkout.stderr}`);
      resolvedSha = sha;
    } else {
      let [checkout, revParse] = await Promise.all([
        execFileNoThrowWithCwd(gitExe(), ["checkout", "HEAD"], {
          cwd: cloneDir
        }),
        execFileNoThrowWithCwd(gitExe(), ["rev-parse", "HEAD"], {
          cwd: cloneDir
        })
      ]);
      if (checkout.code !== 0)
        throw Error(`git checkout after sparse-checkout failed: ${checkout.stderr}`);
      if (revParse.code === 0)
        resolvedSha = revParse.stdout.trim();
    }
    let resolvedSubdir = validatePathWithinBase(cloneDir, subdirPath);
    try {
      await rename6(resolvedSubdir, targetPath);
    } catch (e) {
      if (isENOENT(e))
        throw Error(`Subdirectory '${subdirPath}' not found in repository ${gitUrl}${ref ? ` (ref: ${ref})` : ""}. Check that the path is correct and exists at the specified ref/sha.`);
      throw e;
    }
    let refMsg = ref ? ` ref=${ref}` : "", shaMsg = resolvedSha ? ` sha=${resolvedSha}` : "";
    return logForDebugging(`Extracted subdir ${subdirPath} from ${gitUrl}${refMsg}${shaMsg} to ${targetPath}`), resolvedSha;
  } finally {
    await rm11(cloneDir, { recursive: !0, force: !0 });
  }
}
