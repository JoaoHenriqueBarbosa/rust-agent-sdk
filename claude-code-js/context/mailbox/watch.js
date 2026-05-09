// function: watch
function watch(paths2, options = {}) {
  let watcher = new FSWatcher(options);
  return watcher.add(paths2), watcher;
}
