// function: handleRewindFiles
async function handleRewindFiles(userMessageId, appState, setAppState, dryRun) {
  if (!fileHistoryEnabled())
    return { canRewind: !1, error: "File rewinding is not enabled." };
  if (!fileHistoryCanRestore(appState.fileHistory, userMessageId))
    return {
      canRewind: !1,
      error: "No file checkpoint found for this message."
    };
  if (dryRun) {
    let diffStats = await fileHistoryGetDiffStats(appState.fileHistory, userMessageId);
    return {
      canRewind: !0,
      filesChanged: diffStats?.filesChanged,
      insertions: diffStats?.insertions,
      deletions: diffStats?.deletions
    };
  }
  try {
    await fileHistoryRewind((updater) => setAppState((prev) => ({
      ...prev,
      fileHistory: updater(prev.fileHistory)
    })), userMessageId);
  } catch (error44) {
    return {
      canRewind: !1,
      error: `Failed to rewind: ${errorMessage(error44)}`
    };
  }
  return { canRewind: !0 };
}
