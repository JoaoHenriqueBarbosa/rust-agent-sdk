// function: createFsWatchInstance
function createFsWatchInstance(path12, options, listener, errHandler, emitRaw) {
  let handleEvent = (rawEvent, evPath) => {
    if (listener(path12), emitRaw(rawEvent, evPath, { watchedPath: path12 }), evPath && path12 !== evPath)
      fsWatchBroadcast(sysPath.resolve(path12, evPath), KEY_LISTENERS, sysPath.join(path12, evPath));
  };
  try {
    return fs_watch(path12, {
      persistent: options.persistent
    }, handleEvent);
  } catch (error44) {
    errHandler(error44);
    return;
  }
}
