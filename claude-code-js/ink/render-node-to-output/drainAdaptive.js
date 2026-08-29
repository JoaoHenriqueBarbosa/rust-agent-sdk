// function: drainAdaptive
function drainAdaptive(node, pending, innerHeight) {
  let sign2 = pending > 0 ? 1 : -1, abs = Math.abs(pending), applied = 0;
  if (abs > SCROLL_MAX_PENDING)
    applied += sign2 * (abs - SCROLL_MAX_PENDING), abs = SCROLL_MAX_PENDING;
  let step = abs <= SCROLL_INSTANT_THRESHOLD ? abs : abs < SCROLL_HIGH_PENDING ? SCROLL_STEP_MED : SCROLL_STEP_HIGH;
  applied += sign2 * step;
  let rem = abs - step, cap = Math.max(1, innerHeight - 1), totalAbs = Math.abs(applied);
  if (totalAbs > cap) {
    let excess = totalAbs - cap;
    return node.pendingScrollDelta = sign2 * (rem + excess), sign2 * cap;
  }
  return node.pendingScrollDelta = rem > 0 ? sign2 * rem : void 0, applied;
}
