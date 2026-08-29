// var: init_checkEnvironment
var init_checkEnvironment = __esm(() => {
  isBrowser = typeof window < "u" && typeof window.document < "u", isWebWorker = typeof self === "object" && typeof self?.importScripts === "function" && (self.constructor?.name === "DedicatedWorkerGlobalScope" || self.constructor?.name === "ServiceWorkerGlobalScope" || self.constructor?.name === "SharedWorkerGlobalScope"), isDeno = typeof Deno < "u" && typeof Deno.version < "u" && typeof Deno.version.deno < "u", isBun = typeof Bun < "u" && typeof Bun.version < "u", isNodeLike = typeof globalThis.process < "u" && Boolean(globalThis.process.version) && Boolean(globalThis.process.versions?.node), isReactNative2 = typeof navigator < "u" && navigator?.product === "ReactNative";
});
