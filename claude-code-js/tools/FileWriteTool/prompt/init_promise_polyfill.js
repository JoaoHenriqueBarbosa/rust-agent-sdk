// var: init_promise_polyfill
var init_promise_polyfill = __esm(() => {
  PromisePolyfill = class PromisePolyfill extends Promise {
    static withResolver() {
      let resolve19, reject2;
      return { promise: new Promise((res, rej) => {
        resolve19 = res, reject2 = rej;
      }), resolve: resolve19, reject: reject2 };
    }
  };
});
