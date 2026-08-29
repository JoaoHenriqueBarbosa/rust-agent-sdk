// function: symlinkDirectories
async function symlinkDirectories(repoRootPath, worktreePath, dirsToSymlink) {
  for (let dir of dirsToSymlink) {
    if (containsPathTraversal(dir)) {
      logForDebugging(`Skipping symlink for "${dir}": path traversal detected`, { level: "warn" });
      continue;
    }
    let sourcePath = join138(repoRootPath, dir), destPath = join138(worktreePath, dir);
    try {
      await symlink5(sourcePath, destPath, "dir"), logForDebugging(`Symlinked ${dir} from main repository to worktree to avoid disk bloat`);
    } catch (error44) {
      let code = getErrnoCode(error44);
      if (code !== "ENOENT" && code !== "EEXIST")
        logForDebugging(`Failed to symlink ${dir} (${code ?? "unknown"}): ${errorMessage(error44)}`, { level: "warn" });
    }
  }
}
