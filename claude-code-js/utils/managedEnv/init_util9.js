// var: init_util9
var init_util9 = __esm(() => {
  polyfills = {
    fetch: globalThis.fetch ? globalThis.fetch.bind(globalThis) : void 0,
    SubtleCrypto: globalThis.crypto ? globalThis.crypto.subtle : void 0,
    EventSource: globalThis.EventSource
  };
});
