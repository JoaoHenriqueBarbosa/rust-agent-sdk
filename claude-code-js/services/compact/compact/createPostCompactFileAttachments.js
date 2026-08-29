// function: createPostCompactFileAttachments
async function createPostCompactFileAttachments(readFileState, toolUseContext, maxFiles, preservedMessages = []) {
  let preservedReadPaths = collectReadToolFilePaths(preservedMessages), recentFiles = Object.entries(readFileState).map(([filename, state3]) => ({ filename, ...state3 })).filter((file2) => !shouldExcludeFromPostCompactRestore(file2.filename, toolUseContext.agentId) && !preservedReadPaths.has(expandPath(file2.filename))).sort((a2, b) => b.timestamp - a2.timestamp).slice(0, maxFiles), results = await Promise.all(recentFiles.map(async (file2) => {
    let attachment = await generateFileAttachment(file2.filename, {
      ...toolUseContext,
      fileReadingLimits: {
        maxTokens: POST_COMPACT_MAX_TOKENS_PER_FILE
      }
    }, "tengu_post_compact_file_restore_success", "tengu_post_compact_file_restore_error", "compact");
    return attachment ? createAttachmentMessage(attachment) : null;
  })), usedTokens = 0;
  return results.filter((result) => {
    if (result === null)
      return !1;
    let attachmentTokens = roughTokenCountEstimation(jsonStringify(result));
    if (usedTokens + attachmentTokens <= POST_COMPACT_TOKEN_BUDGET)
      return usedTokens += attachmentTokens, !0;
    return !1;
  });
}
