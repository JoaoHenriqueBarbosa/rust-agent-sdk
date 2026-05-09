// function: consumePendingCacheEdits
function consumePendingCacheEdits() {
  let edits = pendingCacheEdits;
  return pendingCacheEdits = null, edits;
}
