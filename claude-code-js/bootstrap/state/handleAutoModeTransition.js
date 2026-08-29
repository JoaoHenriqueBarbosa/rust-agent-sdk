// function: handleAutoModeTransition
function handleAutoModeTransition(fromMode, toMode) {
  if (fromMode === "auto" && toMode === "plan" || fromMode === "plan" && toMode === "auto")
    return;
  let fromIsAuto = fromMode === "auto", toIsAuto = toMode === "auto";
  if (toIsAuto && !fromIsAuto)
    STATE.needsAutoModeExitAttachment = !1;
  if (fromIsAuto && !toIsAuto)
    STATE.needsAutoModeExitAttachment = !0;
}
