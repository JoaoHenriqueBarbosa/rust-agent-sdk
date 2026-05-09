// function: parseFrontmatterPaths
function parseFrontmatterPaths(rawContent2) {
  let { frontmatter, content } = parseFrontmatter(rawContent2);
  if (!frontmatter.paths)
    return { content };
  let patterns = splitPathInFrontmatter(frontmatter.paths).map((pattern) => {
    return pattern.endsWith("/**") ? pattern.slice(0, -3) : pattern;
  }).filter((p4) => p4.length > 0);
  if (patterns.length === 0 || patterns.every((p4) => p4 === "**"))
    return { content };
  return { content, paths: patterns };
}
