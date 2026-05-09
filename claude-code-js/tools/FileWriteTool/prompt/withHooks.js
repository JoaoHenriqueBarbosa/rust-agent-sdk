// function: withHooks
function withHooks(rl, cb) {
  let store = createStore2(rl);
  return hookStorage.run(store, () => {
    function cycle(render2) {
      store.handleChange = () => {
        store.index = 0, render2();
      }, store.handleChange();
    }
    return cb(cycle);
  });
}
