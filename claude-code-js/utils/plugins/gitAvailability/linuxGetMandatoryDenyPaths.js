// function: linuxGetMandatoryDenyPaths
async function linuxGetMandatoryDenyPaths(ripgrepConfig = { command: "rg" }, maxDepth = DEFAULT_MANDATORY_DENY_SEARCH_DEPTH, allowGitConfig = !1, abortSignal) {
  let cwd2 = process.cwd(), fallbackController = new AbortController, signal = abortSignal ?? fallbackController.signal, dangerousDirectories = getDangerousDirectories(), denyPaths = [
    ...DANGEROUS_FILES.map((f) => path14.resolve(cwd2, f)),
    ...dangerousDirectories.map((d) => path14.resolve(cwd2, d))
  ], dotGitPath = path14.resolve(cwd2, ".git"), dotGitIsDirectory = !1;
  try {
    dotGitIsDirectory = fs12.statSync(dotGitPath).isDirectory();
  } catch {}
  if (dotGitIsDirectory) {
    if (denyPaths.push(path14.resolve(cwd2, ".git/hooks")), !allowGitConfig)
      denyPaths.push(path14.resolve(cwd2, ".git/config"));
  }
  let iglobArgs = [];
  for (let fileName of DANGEROUS_FILES)
    iglobArgs.push("--iglob", fileName);
  for (let dirName of dangerousDirectories)
    iglobArgs.push("--iglob", `**/${dirName}/**`);
  if (iglobArgs.push("--iglob", "**/.git/hooks/**"), !allowGitConfig)
    iglobArgs.push("--iglob", "**/.git/config");
  let matches = [];
  try {
    matches = await ripGrep2([
      "--files",
      "--hidden",
      "--max-depth",
      String(maxDepth),
      ...iglobArgs,
      "-g",
      "!**/node_modules/**"
    ], cwd2, signal, ripgrepConfig);
  } catch (error44) {
    logForDebugging2(`[Sandbox] ripgrep scan failed: ${error44}`);
  }
  for (let match of matches) {
    let absolutePath = path14.resolve(cwd2, match), foundDir = !1;
    for (let dirName of [...dangerousDirectories, ".git"]) {
      let normalizedDirName = normalizeCaseForComparison(dirName), segments = absolutePath.split(path14.sep), dirIndex = segments.findIndex((s2) => normalizeCaseForComparison(s2) === normalizedDirName);
      if (dirIndex !== -1) {
        if (dirName === ".git") {
          let gitDir = segments.slice(0, dirIndex + 1).join(path14.sep);
          if (match.includes(".git/hooks"))
            denyPaths.push(path14.join(gitDir, "hooks"));
          else if (match.includes(".git/config"))
            denyPaths.push(path14.join(gitDir, "config"));
        } else
          denyPaths.push(segments.slice(0, dirIndex + 1).join(path14.sep));
        foundDir = !0;
        break;
      }
    }
    if (!foundDir)
      denyPaths.push(absolutePath);
  }
  return [...new Set(denyPaths)];
}
