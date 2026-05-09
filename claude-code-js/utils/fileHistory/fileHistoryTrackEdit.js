// function: fileHistoryTrackEdit
async function fileHistoryTrackEdit(updateFileHistoryState, filePath, messageId) {
  if (!fileHistoryEnabled())
    return;
  let trackingPath = maybeShortenFilePath(filePath), captured;
  if (updateFileHistoryState((state3) => {
    return captured = state3, state3;
  }), !captured)
    return;
  let mostRecent = captured.snapshots.at(-1);
  if (!mostRecent) {
    logError2(Error("FileHistory: Missing most recent snapshot")), logEvent("tengu_file_history_track_edit_failed", {});
    return;
  }
  if (mostRecent.trackedFileBackups[trackingPath])
    return;
  let backup;
  try {
    backup = await createBackup(filePath, 1);
  } catch (error44) {
    logError2(error44), logEvent("tengu_file_history_track_edit_failed", {});
    return;
  }
  let isAddingFile = backup.backupFileName === null;
  updateFileHistoryState((state3) => {
    try {
      let mostRecentSnapshot = state3.snapshots.at(-1);
      if (!mostRecentSnapshot || mostRecentSnapshot.trackedFileBackups[trackingPath])
        return state3;
      let updatedTrackedFiles = state3.trackedFiles.has(trackingPath) ? state3.trackedFiles : new Set(state3.trackedFiles).add(trackingPath), updatedMostRecentSnapshot = {
        ...mostRecentSnapshot,
        trackedFileBackups: {
          ...mostRecentSnapshot.trackedFileBackups,
          [trackingPath]: backup
        }
      }, updatedState = {
        ...state3,
        snapshots: (() => {
          let copy = state3.snapshots.slice();
          return copy[copy.length - 1] = updatedMostRecentSnapshot, copy;
        })(),
        trackedFiles: updatedTrackedFiles
      };
      return maybeDumpStateForDebug(updatedState), recordFileHistorySnapshot(messageId, updatedMostRecentSnapshot, !0).catch((error44) => {
        logError2(Error(`FileHistory: Failed to record snapshot: ${error44}`));
      }), logEvent("tengu_file_history_track_edit_success", {
        isNewFile: isAddingFile,
        version: backup.version
      }), logForDebugging(`FileHistory: Tracked file modification for ${filePath}`), updatedState;
    } catch (error44) {
      return logError2(error44), logEvent("tengu_file_history_track_edit_failed", {}), state3;
    }
  });
}
