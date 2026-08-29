// function: fetchFeatures
async function fetchFeatures(instance) {
  let {
    apiHost,
    apiRequestHeaders
  } = instance.getApiHosts(), clientKey = instance.getClientKey(), remoteEval = "isRemoteEval" in instance && instance.isRemoteEval(), key3 = getKey(instance), cacheKey = getCacheKey(instance), promise3 = activeFetches.get(cacheKey);
  if (!promise3)
    promise3 = (remoteEval ? helpers2.fetchRemoteEvalCall({
      host: apiHost,
      clientKey,
      payload: {
        attributes: instance.getAttributes(),
        forcedVariations: instance.getForcedVariations(),
        forcedFeatures: Array.from(instance.getForcedFeatures().entries()),
        url: instance.getUrl()
      },
      headers: apiRequestHeaders
    }) : helpers2.fetchFeaturesCall({
      host: apiHost,
      clientKey,
      headers: apiRequestHeaders
    })).then((res) => {
      if (!res.ok)
        throw Error(`HTTP error: ${res.status}`);
      if (res.headers.get("x-sse-support") === "enabled")
        supportsSSE.add(key3);
      return res.json();
    }).then((data) => {
      return onNewFeatureData(key3, cacheKey, data), startAutoRefresh(instance), activeFetches.delete(cacheKey), {
        data,
        success: !0,
        source: "network"
      };
    }).catch((e) => {
      return instance.log("Error fetching features", {
        apiHost,
        clientKey,
        error: e ? e.message : null
      }), activeFetches.delete(cacheKey), {
        data: null,
        source: "error",
        success: !1,
        error: e
      };
    }), activeFetches.set(cacheKey, promise3);
  return promise3;
}
