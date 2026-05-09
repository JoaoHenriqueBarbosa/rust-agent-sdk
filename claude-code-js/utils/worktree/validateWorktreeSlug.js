// function: validateWorktreeSlug
function validateWorktreeSlug(slug) {
  if (slug.length > MAX_WORKTREE_SLUG_LENGTH)
    throw Error(`Invalid worktree name: must be ${MAX_WORKTREE_SLUG_LENGTH} characters or fewer (got ${slug.length})`);
  for (let segment of slug.split("/")) {
    if (segment === "." || segment === "..")
      throw Error(`Invalid worktree name "${slug}": must not contain "." or ".." path segments`);
    if (!VALID_WORKTREE_SLUG_SEGMENT.test(segment))
      throw Error(`Invalid worktree name "${slug}": each "/"-separated segment must be non-empty and contain only letters, digits, dots, underscores, and dashes`);
  }
}
