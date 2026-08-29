// class: NodeFsHandler
class NodeFsHandler {
  constructor(fsW) {
    this.fsw = fsW, this._boundHandleError = (error44) => fsW._handleError(error44);
  }
  _watchWithNodeFs(path12, listener) {
    let opts = this.fsw.options, directory = sysPath.dirname(path12), basename6 = sysPath.basename(path12);
    this.fsw._getWatchedDir(directory).add(basename6);
    let absolutePath = sysPath.resolve(path12), options = {
      persistent: opts.persistent
    };
    if (!listener)
      listener = EMPTY_FN;
    let closer;
    if (opts.usePolling) {
      let enableBin = opts.interval !== opts.binaryInterval;
      options.interval = enableBin && isBinaryPath(basename6) ? opts.binaryInterval : opts.interval, closer = setFsWatchFileListener(path12, absolutePath, options, {
        listener,
        rawEmitter: this.fsw._emitRaw
      });
    } else
      closer = setFsWatchListener(path12, absolutePath, options, {
        listener,
        errHandler: this._boundHandleError,
        rawEmitter: this.fsw._emitRaw
      });
    return closer;
  }
  _handleFile(file2, stats, initialAdd) {
    if (this.fsw.closed)
      return;
    let dirname15 = sysPath.dirname(file2), basename6 = sysPath.basename(file2), parent = this.fsw._getWatchedDir(dirname15), prevStats = stats;
    if (parent.has(basename6))
      return;
    let listener = async (path12, newStats) => {
      if (!this.fsw._throttle(THROTTLE_MODE_WATCH, file2, 5))
        return;
      if (!newStats || newStats.mtimeMs === 0)
        try {
          let newStats2 = await stat8(file2);
          if (this.fsw.closed)
            return;
          let { atimeMs: at, mtimeMs: mt } = newStats2;
          if (!at || at <= mt || mt !== prevStats.mtimeMs)
            this.fsw._emit(EV.CHANGE, file2, newStats2);
          if ((isMacos || isLinux || isFreeBSD) && prevStats.ino !== newStats2.ino) {
            this.fsw._closeFile(path12), prevStats = newStats2;
            let closer2 = this._watchWithNodeFs(file2, listener);
            if (closer2)
              this.fsw._addPathCloser(path12, closer2);
          } else
            prevStats = newStats2;
        } catch (error44) {
          this.fsw._remove(dirname15, basename6);
        }
      else if (parent.has(basename6)) {
        let { atimeMs: at, mtimeMs: mt } = newStats;
        if (!at || at <= mt || mt !== prevStats.mtimeMs)
          this.fsw._emit(EV.CHANGE, file2, newStats);
        prevStats = newStats;
      }
    }, closer = this._watchWithNodeFs(file2, listener);
    if (!(initialAdd && this.fsw.options.ignoreInitial) && this.fsw._isntIgnored(file2)) {
      if (!this.fsw._throttle(EV.ADD, file2, 0))
        return;
      this.fsw._emit(EV.ADD, file2, stats);
    }
    return closer;
  }
  async _handleSymlink(entry, directory, path12, item) {
    if (this.fsw.closed)
      return;
    let full = entry.fullPath, dir = this.fsw._getWatchedDir(directory);
    if (!this.fsw.options.followSymlinks) {
      this.fsw._incrReadyCount();
      let linkPath;
      try {
        linkPath = await fsrealpath(path12);
      } catch (e) {
        return this.fsw._emitReady(), !0;
      }
      if (this.fsw.closed)
        return;
      if (dir.has(item)) {
        if (this.fsw._symlinkPaths.get(full) !== linkPath)
          this.fsw._symlinkPaths.set(full, linkPath), this.fsw._emit(EV.CHANGE, path12, entry.stats);
      } else
        dir.add(item), this.fsw._symlinkPaths.set(full, linkPath), this.fsw._emit(EV.ADD, path12, entry.stats);
      return this.fsw._emitReady(), !0;
    }
    if (this.fsw._symlinkPaths.has(full))
      return !0;
    this.fsw._symlinkPaths.set(full, !0);
  }
  _handleRead(directory, initialAdd, wh, target, dir, depth, throttler) {
    if (directory = sysPath.join(directory, ""), throttler = this.fsw._throttle("readdir", directory, 1000), !throttler)
      return;
    let previous = this.fsw._getWatchedDir(wh.path), current = /* @__PURE__ */ new Set, stream10 = this.fsw._readdirp(directory, {
      fileFilter: (entry) => wh.filterPath(entry),
      directoryFilter: (entry) => wh.filterDir(entry)
    });
    if (!stream10)
      return;
    return stream10.on(STR_DATA, async (entry) => {
      if (this.fsw.closed) {
        stream10 = void 0;
        return;
      }
      let item = entry.path, path12 = sysPath.join(directory, item);
      if (current.add(item), entry.stats.isSymbolicLink() && await this._handleSymlink(entry, directory, path12, item))
        return;
      if (this.fsw.closed) {
        stream10 = void 0;
        return;
      }
      if (item === target || !target && !previous.has(item))
        this.fsw._incrReadyCount(), path12 = sysPath.join(dir, sysPath.relative(dir, path12)), this._addToNodeFs(path12, initialAdd, wh, depth + 1);
    }).on(EV.ERROR, this._boundHandleError), new Promise((resolve12, reject) => {
      if (!stream10)
        return reject();
      stream10.once(STR_END, () => {
        if (this.fsw.closed) {
          stream10 = void 0;
          return;
        }
        let wasThrottled = throttler ? throttler.clear() : !1;
        if (resolve12(void 0), previous.getChildren().filter((item) => {
          return item !== directory && !current.has(item);
        }).forEach((item) => {
          this.fsw._remove(directory, item);
        }), stream10 = void 0, wasThrottled)
          this._handleRead(directory, !1, wh, target, dir, depth, throttler);
      });
    });
  }
  async _handleDir(dir, stats, initialAdd, depth, target, wh, realpath4) {
    let parentDir = this.fsw._getWatchedDir(sysPath.dirname(dir)), tracked = parentDir.has(sysPath.basename(dir));
    if (!(initialAdd && this.fsw.options.ignoreInitial) && !target && !tracked)
      this.fsw._emit(EV.ADD_DIR, dir, stats);
    parentDir.add(sysPath.basename(dir)), this.fsw._getWatchedDir(dir);
    let throttler, closer, oDepth = this.fsw.options.depth;
    if ((oDepth == null || depth <= oDepth) && !this.fsw._symlinkPaths.has(realpath4)) {
      if (!target) {
        if (await this._handleRead(dir, initialAdd, wh, target, dir, depth, throttler), this.fsw.closed)
          return;
      }
      closer = this._watchWithNodeFs(dir, (dirPath, stats2) => {
        if (stats2 && stats2.mtimeMs === 0)
          return;
        this._handleRead(dirPath, !1, wh, target, dir, depth, throttler);
      });
    }
    return closer;
  }
  async _addToNodeFs(path12, initialAdd, priorWh, depth, target) {
    let ready = this.fsw._emitReady;
    if (this.fsw._isIgnored(path12) || this.fsw.closed)
      return ready(), !1;
    let wh = this.fsw._getWatchHelpers(path12);
    if (priorWh)
      wh.filterPath = (entry) => priorWh.filterPath(entry), wh.filterDir = (entry) => priorWh.filterDir(entry);
    try {
      let stats = await statMethods[wh.statMethod](wh.watchPath);
      if (this.fsw.closed)
        return;
      if (this.fsw._isIgnored(wh.watchPath, stats))
        return ready(), !1;
      let follow = this.fsw.options.followSymlinks, closer;
      if (stats.isDirectory()) {
        let absPath = sysPath.resolve(path12), targetPath = follow ? await fsrealpath(path12) : path12;
        if (this.fsw.closed)
          return;
        if (closer = await this._handleDir(wh.watchPath, stats, initialAdd, depth, target, wh, targetPath), this.fsw.closed)
          return;
        if (absPath !== targetPath && targetPath !== void 0)
          this.fsw._symlinkPaths.set(absPath, targetPath);
      } else if (stats.isSymbolicLink()) {
        let targetPath = follow ? await fsrealpath(path12) : path12;
        if (this.fsw.closed)
          return;
        let parent = sysPath.dirname(wh.watchPath);
        if (this.fsw._getWatchedDir(parent).add(wh.watchPath), this.fsw._emit(EV.ADD, wh.watchPath, stats), closer = await this._handleDir(parent, stats, initialAdd, depth, path12, wh, targetPath), this.fsw.closed)
          return;
        if (targetPath !== void 0)
          this.fsw._symlinkPaths.set(sysPath.resolve(path12), targetPath);
      } else
        closer = this._handleFile(wh.watchPath, stats, initialAdd);
      if (ready(), closer)
        this.fsw._addPathCloser(path12, closer);
      return !1;
    } catch (error44) {
      if (this.fsw._handleError(error44))
        return ready(), path12;
    }
  }
}
