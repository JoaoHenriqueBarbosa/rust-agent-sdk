// function: processAtMentionedFiles
async function processAtMentionedFiles(input, toolUseContext) {
  let files2 = extractAtMentionedFiles(input);
  if (files2.length === 0)
    return [];
  let appState = toolUseContext.getAppState();
  return (await Promise.all(files2.map(async (file2) => {
    try {
      let { filename, lineStart, lineEnd } = parseAtMentionedFileLines(file2), absoluteFilename = expandPath(filename);
      if (isFileReadDenied(absoluteFilename, appState.toolPermissionContext))
        return null;
      try {
        if ((await stat29(absoluteFilename)).isDirectory())
          try {
            let entries2 = await readdir15(absoluteFilename, {
              withFileTypes: !0
            }), MAX_DIR_ENTRIES = 1000, truncated = entries2.length > 1000, names = entries2.slice(0, 1000).map((e) => e.name);
            if (truncated)
              names.push(`\u2026 and ${entries2.length - 1000} more entries`);
            let stdout = names.join(`
`);
            return logEvent("tengu_at_mention_extracting_directory_success", {}), {
              type: "directory",
              path: absoluteFilename,
              content: stdout,
              displayPath: relative19(getCwd(), absoluteFilename)
            };
          } catch {
            return null;
          }
      } catch {}
      return await generateFileAttachment(absoluteFilename, toolUseContext, "tengu_at_mention_extracting_filename_success", "tengu_at_mention_extracting_filename_error", "at-mention", {
        offset: lineStart,
        limit: lineEnd && lineStart ? lineEnd - lineStart + 1 : void 0
      });
    } catch {
      logEvent("tengu_at_mention_extracting_filename_error", {});
    }
  }))).filter(Boolean);
}
