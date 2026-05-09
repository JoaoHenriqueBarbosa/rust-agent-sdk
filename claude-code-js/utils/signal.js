// Original: src/utils/signal.ts
function createSignal() {
  let listeners = /* @__PURE__ */ new Set;
  return {
    subscribe(listener) {
      return listeners.add(listener), () => {
        listeners.delete(listener);
      };
    },
    emit(...args) {
      for (let listener of listeners)
        listener(...args);
    },
    clear() {
      listeners.clear();
    }
  };
}
