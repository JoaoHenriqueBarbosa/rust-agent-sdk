// function: generateFileAttachment
async function generateFileAttachment(filename, toolUseContext, successEventName, errorEventName, mode, options2) {
  let { offset, limit } = options2 ?? {}, appState = toolUseContext.getAppState();
  if (isFileReadDenied(filename, appState.toolPermissionContext))
    return null;
  if (mode === "at-mention" && !isFileWithinReadSizeLimit(filename, getDefaultFileReadingLimits().maxSizeBytes)) {
    let ext = parse17(filename).ext.toLowerCase();
    if (!isPDFExtension(ext))
      try {
        let stats = await getFsImplementation().stat(filename);
        return logEvent("tengu_attachment_file_too_large", {
          size_bytes: stats.size,
          mode
        }), null;
      } catch {}
  }
  if (mode === "at-mention") {
    let pdfRef = await tryGetPDFReference(filename);
    if (pdfRef)
      return pdfRef;
  }
  let existingFileState = toolUseContext.readFileState.get(filename);
  if (existingFileState && mode === "at-mention")
    try {
      let mtimeMs = await getFileModificationTimeAsync(filename);
      if (existingFileState.timestamp <= mtimeMs && mtimeMs === existingFileState.timestamp)
        return logEvent(successEventName, {}), {
          type: "already_read_file",
          filename,
          displayPath: relative19(getCwd(), filename),
          content: {
            type: "text",
            file: {
              filePath: filename,
              content: existingFileState.content,
              numLines: countCharInString(existingFileState.content, `
`) + 1,
              startLine: offset ?? 1,
              totalLines: countCharInString(existingFileState.content, `
`) + 1
            }
          }
        };
    } catch {}
  try {
    let fileInput = {
      file_path: filename,
      offset,
      limit
    };
    async function readTruncatedFile() {
      if (mode === "compact")
        return {
          type: "compact_file_reference",
          filename,
          displayPath: relative19(getCwd(), filename)
        };
      let appState2 = toolUseContext.getAppState();
      if (isFileReadDenied(filename, appState2.toolPermissionContext))
        return null;
      try {
        let truncatedInput = {
          file_path: filename,
          offset: offset ?? 1,
          limit: MAX_LINES_TO_READ
        }, result = await FileReadTool.call(truncatedInput, toolUseContext);
        return logEvent(successEventName, {}), {
          type: "file",
          filename,
          content: result.data,
          truncated: !0,
          displayPath: relative19(getCwd(), filename)
        };
      } catch {
        return logEvent(errorEventName, {}), null;
      }
    }
    if (!(await FileReadTool.validateInput(fileInput, toolUseContext)).result)
      return null;
    try {
      let result = await FileReadTool.call(fileInput, toolUseContext);
      return logEvent(successEventName, {}), {
        type: "file",
        filename,
        content: result.data,
        displayPath: relative19(getCwd(), filename)
      };
    } catch (error44) {
      if (error44 instanceof MaxFileReadTokenExceededError || error44 instanceof FileTooLargeError)
        return await readTruncatedFile();
      throw error44;
    }
  } catch {
    return logEvent(errorEventName, {}), null;
  }
}
