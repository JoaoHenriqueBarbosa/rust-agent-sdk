// var: init_feature_repository
var init_feature_repository = __esm(() => {
  init_util9();
  cacheSettings = {
    staleTTL: 60000,
    maxAge: 14400000,
    cacheKey: "gbFeaturesCache",
    backgroundSync: !0,
    maxEntries: 10,
    disableIdleStreams: !1,
    idleStreamInterval: 20000,
    disableCache: !1
  }, polyfills2 = getPolyfills(), helpers2 = {
    fetchFeaturesCall: ({
      host,
      clientKey,
      headers
    }) => {
      return polyfills2.fetch(`${host}/api/features/${clientKey}`, {
        headers
      });
    },
    fetchRemoteEvalCall: ({
      host,
      clientKey,
      payload,
      headers
    }) => {
      let options2 = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...headers
        },
        body: JSON.stringify(payload)
      };
      return polyfills2.fetch(`${host}/api/eval/${clientKey}`, options2);
    },
    eventSourceCall: ({
      host,
      clientKey,
      headers
    }) => {
      if (headers)
        return new polyfills2.EventSource(`${host}/sub/${clientKey}`, {
          headers
        });
      return new polyfills2.EventSource(`${host}/sub/${clientKey}`);
    },
    startIdleListener: () => {
      let idleTimeout;
      if (!(typeof window < "u" && typeof document < "u"))
        return;
      let onVisibilityChange = () => {
        if (document.visibilityState === "visible")
          window.clearTimeout(idleTimeout), onVisible();
        else if (document.visibilityState === "hidden")
          idleTimeout = window.setTimeout(onHidden, cacheSettings.idleStreamInterval);
      };
      return document.addEventListener("visibilitychange", onVisibilityChange), () => document.removeEventListener("visibilitychange", onVisibilityChange);
    },
    stopIdleListener: () => {}
  };
  try {
    if (globalThis.localStorage)
      polyfills2.localStorage = globalThis.localStorage;
  } catch (e) {}
  subscribedInstances = /* @__PURE__ */ new Map, cache7 = /* @__PURE__ */ new Map, activeFetches = /* @__PURE__ */ new Map, streams = /* @__PURE__ */ new Map, supportsSSE = /* @__PURE__ */ new Set;
});
