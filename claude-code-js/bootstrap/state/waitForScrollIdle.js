// function: waitForScrollIdle
async function waitForScrollIdle() {
  while (scrollDraining)
    await new Promise((r) => setTimeout(r, SCROLL_DRAIN_IDLE_MS).unref?.());
}
