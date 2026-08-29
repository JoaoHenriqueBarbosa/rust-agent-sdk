// function: flushInteractionTime
function flushInteractionTime() {
  if (interactionTimeDirty)
    flushInteractionTime_inner();
}
