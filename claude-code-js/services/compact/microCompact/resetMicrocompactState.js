// function: resetMicrocompactState
function resetMicrocompactState() {
  if (cachedMCState && cachedMCModule)
    cachedMCModule.resetCachedMCState(cachedMCState);
  pendingCacheEdits = null;
}
