// function: worktreePathFor
function worktreePathFor(repoRoot, slug) {
  return join138(worktreesDir(repoRoot), flattenSlug(slug));
}
