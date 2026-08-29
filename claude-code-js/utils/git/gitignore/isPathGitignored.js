// function: isPathGitignored
async function isPathGitignored(filePath, cwd2) {
  let { code } = await execFileNoThrowWithCwd("git", ["check-ignore", filePath], {
    preserveOutputOnError: !1,
    cwd: cwd2
  });
  return code === 0;
}
