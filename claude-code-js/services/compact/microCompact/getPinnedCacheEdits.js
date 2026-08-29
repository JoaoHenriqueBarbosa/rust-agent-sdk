// function: getPinnedCacheEdits
function getPinnedCacheEdits() {
  if (!cachedMCState)
    return [];
  return cachedMCState.pinnedEdits;
}
