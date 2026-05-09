// function: parseMemoryFileContent
function parseMemoryFileContent(rawContent2, filePath, type, includeBasePath) {
  let ext = extname4(filePath).toLowerCase();
  if (ext && !TEXT_FILE_EXTENSIONS.has(ext))
    return logForDebugging(`Skipping non-text file in @include: ${filePath}`), { info: null, includePaths: [] };
  let { content: withoutFrontmatter, paths: paths2 } = parseFrontmatterPaths(rawContent2), hasComment = withoutFrontmatter.includes("<!--"), tokens = hasComment || includeBasePath !== void 0 ? new _Lexer({ gfm: !1 }).lex(withoutFrontmatter) : void 0, strippedContent = hasComment && tokens ? stripHtmlCommentsFromTokens(tokens).content : withoutFrontmatter, includePaths = tokens && includeBasePath !== void 0 ? extractIncludePathsFromTokens(tokens, includeBasePath) : [], finalContent = strippedContent;
  if (type === "AutoMem" || type === "TeamMem")
    finalContent = truncateEntrypointContent(strippedContent).content;
  let contentDiffersFromDisk = finalContent !== rawContent2;
  return {
    info: {
      path: filePath,
      type,
      content: finalContent,
      globs: paths2,
      contentDiffersFromDisk,
      rawContent: contentDiffersFromDisk ? rawContent2 : void 0
    },
    includePaths
  };
}
