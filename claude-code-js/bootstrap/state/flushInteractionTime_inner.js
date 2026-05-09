// function: flushInteractionTime_inner
function flushInteractionTime_inner() {
  STATE.lastInteractionTime = Date.now(), interactionTimeDirty = !1;
}
