// function: updateLastInteractionTime
function updateLastInteractionTime(immediate) {
  if (immediate)
    flushInteractionTime_inner();
  else
    interactionTimeDirty = !0;
}
