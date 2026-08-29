// function: drainProportional
function drainProportional(node, pending, innerHeight) {
  let abs = Math.abs(pending), cap = Math.max(1, innerHeight - 1), step = Math.min(cap, Math.max(SCROLL_MIN_PER_FRAME, abs * 3 >> 2));
  if (abs <= step)
    return node.pendingScrollDelta = void 0, pending;
  let applied = pending > 0 ? step : -step;
  return node.pendingScrollDelta = pending - applied, applied;
}
