// function: fileHistoryRestoreStateFromLog
function fileHistoryRestoreStateFromLog(fileHistorySnapshots, onUpdateState) {
  if (!fileHistoryEnabled())
    return;
  let snapshots = [], trackedFiles = /* @__PURE__ */ new Set;
  for (let snapshot2 of fileHistorySnapshots) {
    let trackedFileBackups = {};
    for (let [path16, backup] of Object.entries(snapshot2.trackedFileBackups)) {
      let trackingPath = maybeShortenFilePath(path16);
      trackedFiles.add(trackingPath), trackedFileBackups[trackingPath] = backup;
    }
    snapshots.push({
      ...snapshot2,
      trackedFileBackups
    });
  }
  onUpdateState({
    snapshots,
    trackedFiles,
    snapshotSequence: snapshots.length
  });
}
