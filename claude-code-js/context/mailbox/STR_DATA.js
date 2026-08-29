// var: STR_DATA
var STR_DATA = "data", STR_END = "end", STR_CLOSE = "close", EMPTY_FN = () => {}, pl, isWindows2, isMacos, isLinux, isFreeBSD, isIBMi, EVENTS, EV, THROTTLE_MODE_WATCH = "watch", statMethods, KEY_LISTENERS = "listeners", KEY_ERR = "errHandlers", KEY_RAW = "rawEmitters", HANDLER_KEYS, binaryExtensions, isBinaryPath = (filePath) => binaryExtensions.has(sysPath.extname(filePath).slice(1).toLowerCase()), foreach = (val, fn) => {
  if (val instanceof Set)
    val.forEach(fn);
  else
    fn(val);
}, addAndConvert = (main, prop, item) => {
  let container = main[prop];
  if (!(container instanceof Set))
    main[prop] = container = /* @__PURE__ */ new Set([container]);
  container.add(item);
}, clearItem = (cont) => (key) => {
  let set2 = cont[key];
  if (set2 instanceof Set)
    set2.clear();
  else
    delete cont[key];
}, delFromSet = (main, prop, item) => {
  let container = main[prop];
  if (container instanceof Set)
    container.delete(item);
  else if (container === item)
    delete main[prop];
}, isEmptySet = (val) => val instanceof Set ? val.size === 0 : !val, FsWatchInstances, fsWatchBroadcast = (fullPath, listenerType, val1, val2, val3) => {
  let cont = FsWatchInstances.get(fullPath);
  if (!cont)
    return;
  foreach(cont[listenerType], (listener) => {
    listener(val1, val2, val3);
  });
}, setFsWatchListener = (path12, fullPath, options, handlers) => {
  let { listener, errHandler, rawEmitter } = handlers, cont = FsWatchInstances.get(fullPath), watcher;
  if (!options.persistent) {
    if (watcher = createFsWatchInstance(path12, options, listener, errHandler, rawEmitter), !watcher)
      return;
    return watcher.close.bind(watcher);
  }
  if (cont)
    addAndConvert(cont, KEY_LISTENERS, listener), addAndConvert(cont, KEY_ERR, errHandler), addAndConvert(cont, KEY_RAW, rawEmitter);
  else {
    if (watcher = createFsWatchInstance(path12, options, fsWatchBroadcast.bind(null, fullPath, KEY_LISTENERS), errHandler, fsWatchBroadcast.bind(null, fullPath, KEY_RAW)), !watcher)
      return;
    watcher.on(EV.ERROR, async (error44) => {
      let broadcastErr = fsWatchBroadcast.bind(null, fullPath, KEY_ERR);
      if (cont)
        cont.watcherUnusable = !0;
      if (isWindows2 && error44.code === "EPERM")
        try {
          await (await open4(path12, "r")).close(), broadcastErr(error44);
        } catch (err) {}
      else
        broadcastErr(error44);
    }), cont = {
      listeners: listener,
      errHandlers: errHandler,
      rawEmitters: rawEmitter,
      watcher
    }, FsWatchInstances.set(fullPath, cont);
  }
  return () => {
    if (delFromSet(cont, KEY_LISTENERS, listener), delFromSet(cont, KEY_ERR, errHandler), delFromSet(cont, KEY_RAW, rawEmitter), isEmptySet(cont.listeners))
      cont.watcher.close(), FsWatchInstances.delete(fullPath), HANDLER_KEYS.forEach(clearItem(cont)), cont.watcher = void 0, Object.freeze(cont);
  };
}, FsWatchFileInstances, setFsWatchFileListener = (path12, fullPath, options, handlers) => {
  let { listener, rawEmitter } = handlers, cont = FsWatchFileInstances.get(fullPath), copts = cont && cont.options;
  if (copts && (copts.persistent < options.persistent || copts.interval > options.interval))
    unwatchFile3(fullPath), cont = void 0;
  if (cont)
    addAndConvert(cont, KEY_LISTENERS, listener), addAndConvert(cont, KEY_RAW, rawEmitter);
  else
    cont = {
      listeners: listener,
      rawEmitters: rawEmitter,
      options,
      watcher: watchFile3(fullPath, options, (curr, prev) => {
        foreach(cont.rawEmitters, (rawEmitter2) => {
          rawEmitter2(EV.CHANGE, fullPath, { curr, prev });
        });
        let currmtime = curr.mtimeMs;
        if (curr.size !== prev.size || currmtime > prev.mtimeMs || currmtime === 0)
          foreach(cont.listeners, (listener2) => listener2(path12, curr));
      })
    }, FsWatchFileInstances.set(fullPath, cont);
  return () => {
    if (delFromSet(cont, KEY_LISTENERS, listener), delFromSet(cont, KEY_RAW, rawEmitter), isEmptySet(cont.listeners))
      FsWatchFileInstances.delete(fullPath), unwatchFile3(fullPath), cont.options = cont.watcher = void 0, Object.freeze(cont);
  };
};
