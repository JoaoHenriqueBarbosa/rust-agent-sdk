// function: pushToKillRing
function pushToKillRing(text2, direction = "append") {
  if (text2.length > 0) {
    if (lastActionWasKill && killRing.length > 0)
      if (direction === "prepend")
        killRing[0] = text2 + killRing[0];
      else
        killRing[0] = killRing[0] + text2;
    else if (killRing.unshift(text2), killRing.length > KILL_RING_MAX_SIZE)
      killRing.pop();
    lastActionWasKill = !0, lastActionWasYank = !1;
  }
}
