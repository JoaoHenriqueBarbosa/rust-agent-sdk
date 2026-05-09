// function: findAvailableIDE
async function findAvailableIDE() {
  if (currentIDESearch)
    currentIDESearch.abort();
  currentIDESearch = createAbortController();
  let signal = currentIDESearch.signal;
  await cleanupStaleIdeLockfiles();
  let startTime = Date.now();
  while (Date.now() - startTime < 30000 && !signal.aborted) {
    if (getIsScrollDraining()) {
      await sleep3(1000, signal);
      continue;
    }
    let ides = await detectIDEs(!1);
    if (signal.aborted)
      return null;
    if (ides.length === 1)
      return ides[0];
    await sleep3(1000, signal);
  }
  return null;
}
