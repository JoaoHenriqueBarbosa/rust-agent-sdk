// function: withPointer
function withPointer(cb) {
  let store = getStore(), { index } = store, pointer = {
    get() {
      return store.hooks[index];
    },
    set(value) {
      store.hooks[index] = value;
    },
    initialized: index in store.hooks
  }, returnValue = cb(pointer);
  return store.index++, returnValue;
}
