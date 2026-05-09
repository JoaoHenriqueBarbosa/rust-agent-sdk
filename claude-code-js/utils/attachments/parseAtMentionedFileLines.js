// function: parseAtMentionedFileLines
function parseAtMentionedFileLines(mention) {
  let match = mention.match(/^([^#]+)(?:#L(\d+)(?:-(\d+))?)?(?:#[^#]*)?$/);
  if (!match)
    return { filename: mention };
  let [, filename, lineStartStr, lineEndStr] = match, lineStart = lineStartStr ? parseInt(lineStartStr, 10) : void 0, lineEnd = lineEndStr ? parseInt(lineEndStr, 10) : lineStart;
  return { filename: filename ?? mention, lineStart, lineEnd };
}
