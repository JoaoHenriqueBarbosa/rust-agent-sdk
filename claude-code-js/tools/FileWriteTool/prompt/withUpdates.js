// function: withUpdates
function withUpdates(fn) {
  let wrapped = (...args) => {
    let store = getStore(), shouldUpdate = !1, oldHandleChange = store.handleChange;
    store.handleChange = () => {
      shouldUpdate = !0;
    };
    let returnValue = fn(...args);
    if (shouldUpdate)
      oldHandleChange();
    return store.handleChange = oldHandleChange, returnValue;
  };
  return AsyncResource.bind(wrapped);
}
