// function: isSessionPlanFile
function isSessionPlanFile(absolutePath) {
  let expectedPrefix = join136(getPlansDirectory(), getPlanSlug()), normalizedPath = normalize15(absolutePath);
  return normalizedPath.startsWith(expectedPrefix) && normalizedPath.endsWith(".md");
}
