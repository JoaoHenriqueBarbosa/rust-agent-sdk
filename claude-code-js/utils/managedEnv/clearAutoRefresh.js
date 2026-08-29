// function: clearAutoRefresh
function clearAutoRefresh() {
  supportsSSE.clear(), streams.forEach(destroyChannel), subscribedInstances.clear(), helpers2.stopIdleListener();
}
