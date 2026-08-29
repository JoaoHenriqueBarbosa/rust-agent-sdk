// function: fileHistoryRewind
async function fileHistoryRewind(updateFileHistoryState, messageId) {
  if (!fileHistoryEnabled())
    return;
  let captured;
  if (updateFileHistoryState((state3) => {
    return captured = state3, state3;
  }), !captured)
    return;
  let targetSnapshot = captured.snapshots.findLast((snapshot2) => snapshot2.messageId === messageId);
  if (!targetSnapshot)
    throw logError2(Error(`FileHistory: Snapshot for ${messageId} not found`)), logEvent("tengu_file_history_rewind_failed", {
      trackedFilesCount: captured.trackedFiles.size,
      snapshotFound: !1
    }), Error("The selected snapshot was not found");
  try {
    logForDebugging(`FileHistory: [Rewind] Rewinding to snapshot for ${messageId}`);
    let filesChanged = await applySnapshot(captured, targetSnapshot);
    logForDebugging(`FileHistory: [Rewind] Finished rewinding to ${messageId}`), logEvent("tengu_file_history_rewind_success", {
      trackedFilesCount: captured.trackedFiles.size,
      filesChangedCount: filesChanged.length
    });
  } catch (error44) {
    throw logError2(error44), logEvent("tengu_file_history_rewind_failed", {
      trackedFilesCount: captured.trackedFiles.size,
      snapshotFound: !0
    }), error44;
  }
}
