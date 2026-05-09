// Original: src/state/store.ts
function createStore(initialState, onChange) {
  let state3 = initialState, listeners = /* @__PURE__ */ new Set;
  return {
    getState: () => state3,
    setState: (updater) => {
      let prev = state3, next = updater(prev);
      if (Object.is(next, prev))
        return;
      state3 = next, onChange?.({ newState: next, oldState: prev });
      for (let listener of listeners)
        listener();
    },
    subscribe: (listener) => {
      return listeners.add(listener), () => listeners.delete(listener);
    }
  };
}
