// function: copyWorktreeIncludeFiles
async function copyWorktreeIncludeFiles(repoRoot, worktreePath) {
  let includeContent;
  try {
    includeContent = await readFile52(join138(repoRoot, ".worktreeinclude"), "utf-8");
  } catch {
    return [];
  }
  let patterns = includeContent.split(/\r?\n/).map((line) => line.trim()).filter((line) => line.length > 0 && !line.startsWith("#"));
  if (patterns.length === 0)
    return [];
  let gitignored = await execFileNoThrowWithCwd(gitExe(), ["ls-files", "--others", "--ignored", "--exclude-standard", "--directory"], { cwd: repoRoot });
  if (gitignored.code !== 0 || !gitignored.stdout.trim())
    return [];
  let entries2 = gitignored.stdout.trim().split(`
`).filter(Boolean), matcher = import_ignore6.default().add(includeContent), collapsedDirs = entries2.filter((e) => e.endsWith("/")), files3 = entries2.filter((e) => !e.endsWith("/") && matcher.ignores(e)), dirsToExpand = collapsedDirs.filter((dir) => {
    if (patterns.some((p4) => {
      let normalized = p4.startsWith("/") ? p4.slice(1) : p4;
      if (normalized.startsWith(dir))
        return !0;
      let globIdx = normalized.search(/[*?[]/);
      if (globIdx > 0) {
        let literalPrefix = normalized.slice(0, globIdx);
        if (dir.startsWith(literalPrefix))
          return !0;
      }
      return !1;
    }))
      return !0;
    if (matcher.ignores(dir.slice(0, -1)))
      return !0;
    return !1;
  });
  if (dirsToExpand.length > 0) {
    let expanded = await execFileNoThrowWithCwd(gitExe(), [
      "ls-files",
      "--others",
      "--ignored",
      "--exclude-standard",
      "--",
      ...dirsToExpand
    ], { cwd: repoRoot });
    if (expanded.code === 0 && expanded.stdout.trim()) {
      for (let f of expanded.stdout.trim().split(`
`).filter(Boolean))
        if (matcher.ignores(f))
          files3.push(f);
    }
  }
  let copied = [];
  for (let relativePath2 of files3) {
    let srcPath = join138(repoRoot, relativePath2), destPath = join138(worktreePath, relativePath2);
    try {
      await mkdir39(dirname59(destPath), { recursive: !0 }), await copyFile11(srcPath, destPath), copied.push(relativePath2);
    } catch (e) {
      logForDebugging(`Failed to copy ${relativePath2} to worktree: ${e.message}`, { level: "warn" });
    }
  }
  if (copied.length > 0)
    logForDebugging(`Copied ${copied.length} files from .worktreeinclude: ${copied.join(", ")}`);
  return copied;
}
