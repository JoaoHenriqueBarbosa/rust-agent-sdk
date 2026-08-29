// function: fileHistoryCanRestore
function fileHistoryCanRestore(state3, messageId) {
  if (!fileHistoryEnabled())
    return !1;
  return state3.snapshots.some((snapshot2) => snapshot2.messageId === messageId);
}
