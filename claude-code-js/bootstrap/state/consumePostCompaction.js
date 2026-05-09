// function: consumePostCompaction
function consumePostCompaction() {
  let was = STATE.pendingPostCompaction;
  return STATE.pendingPostCompaction = !1, was;
}
