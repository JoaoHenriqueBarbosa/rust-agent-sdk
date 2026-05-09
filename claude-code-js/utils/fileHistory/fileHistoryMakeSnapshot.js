// function: fileHistoryMakeSnapshot
async function fileHistoryMakeSnapshot(updateFileHistoryState, messageId) {
  if (!fileHistoryEnabled())
    return;
  let captured;
  if (updateFileHistoryState((state3) => {
    return captured = state3, state3;
  }), !captured)
    return;
  let trackedFileBackups = {}, mostRecentSnapshot = captured.snapshots.at(-1);
  if (mostRecentSnapshot)
    logForDebugging(`FileHistory: Making snapshot for message ${messageId}`), await Promise.all(Array.from(captured.trackedFiles, async (trackingPath) => {
      try {
        let filePath = maybeExpandFilePath(trackingPath), latestBackup = mostRecentSnapshot.trackedFileBackups[trackingPath], nextVersion = latestBackup ? latestBackup.version + 1 : 1, fileStats;
        try {
          fileStats = await stat20(filePath);
        } catch (e) {
          if (!isENOENT(e))
            throw e;
        }
        if (!fileStats) {
          trackedFileBackups[trackingPath] = {
            backupFileName: null,
            version: nextVersion,
            backupTime: /* @__PURE__ */ new Date
          }, logEvent("tengu_file_history_backup_deleted_file", {
            version: nextVersion
          }), logForDebugging(`FileHistory: Missing tracked file: ${trackingPath}`);
          return;
        }
        if (latestBackup && latestBackup.backupFileName !== null && !await checkOriginFileChanged(filePath, latestBackup.backupFileName, fileStats)) {
          trackedFileBackups[trackingPath] = latestBackup;
          return;
        }
        trackedFileBackups[trackingPath] = await createBackup(filePath, nextVersion);
      } catch (error44) {
        logError2(error44), logEvent("tengu_file_history_backup_file_failed", {});
      }
    }));
  updateFileHistoryState((state3) => {
    try {
      let lastSnapshot = state3.snapshots.at(-1);
      if (lastSnapshot)
        for (let trackingPath of state3.trackedFiles) {
          if (trackingPath in trackedFileBackups)
            continue;
          let inherited = lastSnapshot.trackedFileBackups[trackingPath];
          if (inherited)
            trackedFileBackups[trackingPath] = inherited;
        }
      let newSnapshot = {
        messageId,
        trackedFileBackups,
        timestamp: /* @__PURE__ */ new Date
      }, allSnapshots = [...state3.snapshots, newSnapshot], updatedState = {
        ...state3,
        snapshots: allSnapshots.length > MAX_SNAPSHOTS ? allSnapshots.slice(-MAX_SNAPSHOTS) : allSnapshots,
        snapshotSequence: (state3.snapshotSequence ?? 0) + 1
      };
      return maybeDumpStateForDebug(updatedState), notifyVscodeSnapshotFilesUpdated(state3, updatedState).catch(logError2), recordFileHistorySnapshot(messageId, newSnapshot, !1).catch((error44) => {
        logError2(Error(`FileHistory: Failed to record snapshot: ${error44}`));
      }), logForDebugging(`FileHistory: Added snapshot for ${messageId}, tracking ${state3.trackedFiles.size} files`), logEvent("tengu_file_history_snapshot_success", {
        trackedFilesCount: state3.trackedFiles.size,
        snapshotCount: updatedState.snapshots.length
      }), updatedState;
    } catch (error44) {
      return logError2(error44), logEvent("tengu_file_history_snapshot_failed", {}), state3;
    }
  });
}
