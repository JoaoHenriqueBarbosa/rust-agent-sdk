// function: markScrollActivity
function markScrollActivity() {
  if (scrollDraining = !0, scrollDrainTimer)
    clearTimeout(scrollDrainTimer);
  scrollDrainTimer = setTimeout(() => {
    scrollDraining = !1, scrollDrainTimer = void 0;
  }, SCROLL_DRAIN_IDLE_MS), scrollDrainTimer.unref?.();
}
