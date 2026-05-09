// function: startAutoRefresh
function startAutoRefresh(instance, forceSSE = !1) {
  let key3 = getKey(instance), cacheKey = getCacheKey(instance), {
    streamingHost,
    streamingHostRequestHeaders
  } = instance.getApiHosts(), clientKey = instance.getClientKey();
  if (forceSSE)
    supportsSSE.add(key3);
  if (cacheSettings.backgroundSync && supportsSSE.has(key3) && polyfills2.EventSource) {
    if (streams.has(key3))
      return;
    let channel = {
      src: null,
      host: streamingHost,
      clientKey,
      headers: streamingHostRequestHeaders,
      cb: (event) => {
        try {
          if (event.type === "features-updated") {
            let instances2 = subscribedInstances.get(key3);
            instances2 && instances2.forEach((instance2) => {
              fetchFeatures(instance2);
            });
          } else if (event.type === "features") {
            let json2 = JSON.parse(event.data);
            onNewFeatureData(key3, cacheKey, json2);
          }
          channel.errors = 0;
        } catch (e) {
          instance.log("SSE Error", {
            streamingHost,
            clientKey,
            error: e ? e.message : null
          }), onSSEError(channel);
        }
      },
      errors: 0,
      state: "active"
    };
    streams.set(key3, channel), enableChannel(channel);
  }
}
