// function: notifyVscodeSnapshotFilesUpdated
async function notifyVscodeSnapshotFilesUpdated(oldState, newState) {
  let oldSnapshot = oldState.snapshots.at(-1), newSnapshot = newState.snapshots.at(-1);
  if (!newSnapshot)
    return;
  for (let trackingPath of newState.trackedFiles) {
    let filePath = maybeExpandFilePath(trackingPath), oldBackup = oldSnapshot?.trackedFileBackups[trackingPath], newBackup = newSnapshot.trackedFileBackups[trackingPath];
    if (oldBackup?.backupFileName === newBackup?.backupFileName && oldBackup?.version === newBackup?.version)
      continue;
    let oldContent = null;
    if (oldBackup?.backupFileName) {
      let backupPath = resolveBackupPath(oldBackup.backupFileName);
      oldContent = await readFileAsyncOrNull(backupPath);
    }
    let newContent = null;
    if (newBackup?.backupFileName) {
      let backupPath = resolveBackupPath(newBackup.backupFileName);
      newContent = await readFileAsyncOrNull(backupPath);
    }
    if (oldContent !== newContent)
      notifyVscodeFileUpdated(filePath, oldContent, newContent);
  }
}
