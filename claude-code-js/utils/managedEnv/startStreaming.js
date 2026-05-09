// function: startStreaming
function startStreaming(instance, options2) {
  if (options2.streaming) {
    if (!instance.getClientKey())
      throw Error("Must specify clientKey to enable streaming");
    if (options2.payload)
      startAutoRefresh(instance, !0);
    subscribe2(instance);
  }
}
