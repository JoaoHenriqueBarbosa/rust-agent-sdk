// function: closeOpenDiffs
async function closeOpenDiffs(ideClient) {
  try {
    await callIdeRpc("closeAllDiffTabs", {}, ideClient);
  } catch (_) {}
}
