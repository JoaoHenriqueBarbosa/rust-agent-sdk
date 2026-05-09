// function: getChangedFiles
async function getChangedFiles(toolUseContext) {
  let filePaths = cacheKeys(toolUseContext.readFileState);
  if (filePaths.length === 0)
    return [];
  let appState = toolUseContext.getAppState();
  return (await Promise.all(filePaths.map(async (filePath) => {
    let fileState = toolUseContext.readFileState.get(filePath);
    if (!fileState)
      return null;
    if (fileState.offset !== void 0 || fileState.limit !== void 0)
      return null;
    let normalizedPath = expandPath(filePath);
    if (isFileReadDenied(normalizedPath, appState.toolPermissionContext))
      return null;
    try {
      if (await getFileModificationTimeAsync(normalizedPath) <= fileState.timestamp)
        return null;
      let fileInput = { file_path: normalizedPath };
      if (!(await FileReadTool.validateInput(fileInput, toolUseContext)).result)
        return null;
      let result = await FileReadTool.call(fileInput, toolUseContext);
      if (result.data.type === "text") {
        let snippet = getSnippetForTwoFileDiff(fileState.content, result.data.file.content);
        if (snippet === "")
          return null;
        return {
          type: "edited_text_file",
          filename: normalizedPath,
          snippet
        };
      }
      if (result.data.type === "image")
        try {
          let data = await readImageWithTokenBudget(normalizedPath);
          return {
            type: "edited_image_file",
            filename: normalizedPath,
            content: data
          };
        } catch (compressionError) {
          return logError2(compressionError), logEvent("tengu_watched_file_compression_failed", {
            file: normalizedPath
          }), null;
        }
      return null;
    } catch (err2) {
      if (isENOENT(err2))
        toolUseContext.readFileState.delete(filePath);
      return null;
    }
  }))).filter((result) => result != null);
}
