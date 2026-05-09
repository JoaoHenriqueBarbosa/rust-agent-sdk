// function: performPostCreationSetup
async function performPostCreationSetup(repoRoot, worktreePath) {
  let localSettingsRelativePath = getRelativeSettingsFilePathForSource("localSettings"), sourceSettingsLocal = join138(repoRoot, localSettingsRelativePath);
  try {
    let destSettingsLocal = join138(worktreePath, localSettingsRelativePath);
    await mkdirRecursive(dirname59(destSettingsLocal)), await copyFile11(sourceSettingsLocal, destSettingsLocal), logForDebugging(`Copied settings.local.json to worktree: ${destSettingsLocal}`);
  } catch (e) {
    if (getErrnoCode(e) !== "ENOENT")
      logForDebugging(`Failed to copy settings.local.json: ${e.message}`, { level: "warn" });
  }
  let huskyPath = join138(repoRoot, ".husky"), gitHooksPath = join138(repoRoot, ".git", "hooks"), hooksPath = null;
  for (let candidatePath of [huskyPath, gitHooksPath])
    try {
      if ((await stat41(candidatePath)).isDirectory()) {
        hooksPath = candidatePath;
        break;
      }
    } catch {}
  if (hooksPath) {
    let gitDir = await resolveGitDir(repoRoot), configDir = gitDir ? await getCommonDir(gitDir) ?? gitDir : null;
    if ((configDir ? await parseGitConfigValue(configDir, "core", null, "hooksPath") : null) !== hooksPath) {
      let { code: configCode, stderr: configError } = await execFileNoThrowWithCwd(gitExe(), ["config", "core.hooksPath", hooksPath], { cwd: worktreePath });
      if (configCode === 0)
        logForDebugging(`Configured worktree to use hooks from main repository: ${hooksPath}`);
      else
        logForDebugging(`Failed to configure hooks path: ${configError}`, {
          level: "error"
        });
    }
  }
  let dirsToSymlink = getInitialSettings().worktree?.symlinkDirectories ?? [];
  if (dirsToSymlink.length > 0)
    await symlinkDirectories(repoRoot, worktreePath, dirsToSymlink);
  await copyWorktreeIncludeFiles(repoRoot, worktreePath);
}
