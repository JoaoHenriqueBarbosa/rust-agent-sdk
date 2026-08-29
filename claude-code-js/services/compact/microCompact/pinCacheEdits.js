// function: pinCacheEdits
function pinCacheEdits(userMessageIndex, block) {
  if (cachedMCState)
    cachedMCState.pinnedEdits.push({ userMessageIndex, block });
}
