// var: init_hook_engine
var init_hook_engine = __esm(() => {
  init_errors9();
  hookStorage = new AsyncLocalStorage3;
  effectScheduler = {
    queue(cb) {
      let store = getStore(), { index } = store;
      store.hooksEffect.push(() => {
        store.hooksCleanup[index]?.();
        let cleanFn = cb(readline());
        if (cleanFn != null && typeof cleanFn !== "function")
          throw new ValidationError("useEffect return value must be a cleanup function or nothing.");
        store.hooksCleanup[index] = cleanFn;
      });
    },
    run() {
      let store = getStore();
      withUpdates(() => {
        store.hooksEffect.forEach((effect) => {
          effect();
        }), store.hooksEffect.length = 0;
      })();
    },
    clearAll() {
      let store = getStore();
      store.hooksCleanup.forEach((cleanFn) => {
        cleanFn?.();
      }), store.hooksEffect.length = 0, store.hooksCleanup.length = 0;
    }
  };
});
