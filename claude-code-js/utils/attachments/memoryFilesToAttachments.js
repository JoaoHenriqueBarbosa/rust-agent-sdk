// function: memoryFilesToAttachments
function memoryFilesToAttachments(memoryFiles, toolUseContext, triggerFilePath) {
  let attachments = [], shouldFireHook2 = hasInstructionsLoadedHook();
  for (let memoryFile of memoryFiles) {
    if (toolUseContext.loadedNestedMemoryPaths?.has(memoryFile.path))
      continue;
    if (!toolUseContext.readFileState.has(memoryFile.path)) {
      if (attachments.push({
        type: "nested_memory",
        path: memoryFile.path,
        content: memoryFile,
        displayPath: relative19(getCwd(), memoryFile.path)
      }), toolUseContext.loadedNestedMemoryPaths?.add(memoryFile.path), toolUseContext.readFileState.set(memoryFile.path, {
        content: memoryFile.contentDiffersFromDisk ? memoryFile.rawContent ?? memoryFile.content : memoryFile.content,
        timestamp: Date.now(),
        offset: void 0,
        limit: void 0,
        isPartialView: memoryFile.contentDiffersFromDisk
      }), shouldFireHook2 && isInstructionsMemoryType2(memoryFile.type)) {
        let loadReason = memoryFile.globs ? "path_glob_match" : memoryFile.parent ? "include" : "nested_traversal";
        executeInstructionsLoadedHooks(memoryFile.path, memoryFile.type, loadReason, {
          globs: memoryFile.globs,
          triggerFilePath,
          parentFilePath: memoryFile.parent
        });
      }
    }
  }
  return attachments;
}
