// var: init_utils2
var init_utils2 = __esm(() => {
  hasBrowserEnv = typeof window < "u" && typeof document < "u", _navigator = typeof navigator === "object" && navigator || void 0, hasStandardBrowserEnv = hasBrowserEnv && (!_navigator || ["ReactNative", "NativeScript", "NS"].indexOf(_navigator.product) < 0), hasStandardBrowserWebWorkerEnv = (() => {
    return typeof WorkerGlobalScope < "u" && self instanceof WorkerGlobalScope && typeof self.importScripts === "function";
  })(), origin = hasBrowserEnv && window.location.href || "http://localhost";
});
