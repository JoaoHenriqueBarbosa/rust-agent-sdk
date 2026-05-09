// function: applySedEdit
async function applySedEdit(simulatedEdit, toolUseContext, parentMessage) {
  let {
    filePath,
    newContent
  } = simulatedEdit, absoluteFilePath = expandPath(filePath), fs17 = getFsImplementation(), encoding = detectFileEncoding(absoluteFilePath), originalContent;
  try {
    originalContent = await fs17.readFile(absoluteFilePath, {
      encoding
    });
  } catch (e) {
    if (isENOENT(e))
      return {
        data: {
          stdout: "",
          stderr: `sed: ${filePath}: No such file or directory
Exit code 1`,
          interrupted: !1
        }
      };
    throw e;
  }
  if (fileHistoryEnabled() && parentMessage)
    await fileHistoryTrackEdit(toolUseContext.updateFileHistoryState, absoluteFilePath, parentMessage.uuid);
  let endings = detectLineEndings(absoluteFilePath);
  return writeTextContent(absoluteFilePath, newContent, encoding, endings), notifyVscodeFileUpdated(absoluteFilePath, originalContent, newContent), toolUseContext.readFileState.set(absoluteFilePath, {
    content: newContent,
    timestamp: getFileModificationTime(absoluteFilePath),
    offset: void 0,
    limit: void 0
  }), {
    data: {
      stdout: "",
      stderr: "",
      interrupted: !1
    }
  };
}
