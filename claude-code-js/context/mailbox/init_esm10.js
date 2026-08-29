// var: init_esm10
var init_esm10 = __esm(() => {
  init_esm9();
  init_handler();
  /*! chokidar - MIT License (c) 2012 Paul Miller (paulmillr.com) */
  BACK_SLASH_RE = /\\/g, DOUBLE_SLASH_RE = /\/\//, DOT_RE = /\..*\.(sw[px])$|~$|\.subl.*\.tmp/, REPLACER_RE = /^\.[/\\]/;
  EMPTY_SET = Object.freeze(/* @__PURE__ */ new Set);
  FSWatcher = class FSWatcher extends EventEmitter4 {
    constructor(_opts = {}) {
      super();
      this.closed = !1, this._closers = /* @__PURE__ */ new Map, this._ignoredPaths = /* @__PURE__ */ new Set, this._throttled = /* @__PURE__ */ new Map, this._streams = /* @__PURE__ */ new Set, this._symlinkPaths = /* @__PURE__ */ new Map, this._watched = /* @__PURE__ */ new Map, this._pendingWrites = /* @__PURE__ */ new Map, this._pendingUnlinks = /* @__PURE__ */ new Map, this._readyCount = 0, this._readyEmitted = !1;
      let awf = _opts.awaitWriteFinish, DEF_AWF = { stabilityThreshold: 2000, pollInterval: 100 }, opts = {
        persistent: !0,
        ignoreInitial: !1,
        ignorePermissionErrors: !1,
        interval: 100,
        binaryInterval: 300,
        followSymlinks: !0,
        usePolling: !1,
        atomic: !0,
        ..._opts,
        ignored: _opts.ignored ? arrify(_opts.ignored) : arrify([]),
        awaitWriteFinish: awf === !0 ? DEF_AWF : typeof awf === "object" ? { ...DEF_AWF, ...awf } : !1
      };
      if (isIBMi)
        opts.usePolling = !0;
      if (opts.atomic === void 0)
        opts.atomic = !opts.usePolling;
      let envPoll = process.env.CHOKIDAR_USEPOLLING;
      if (envPoll !== void 0) {
        let envLower = envPoll.toLowerCase();
        if (envLower === "false" || envLower === "0")
          opts.usePolling = !1;
        else if (envLower === "true" || envLower === "1")
          opts.usePolling = !0;
        else
          opts.usePolling = !!envLower;
      }
      let envInterval = process.env.CHOKIDAR_INTERVAL;
      if (envInterval)
        opts.interval = Number.parseInt(envInterval, 10);
      let readyCalls = 0;
      this._emitReady = () => {
        if (readyCalls++, readyCalls >= this._readyCount)
          this._emitReady = EMPTY_FN, this._readyEmitted = !0, process.nextTick(() => this.emit(EVENTS.READY));
      }, this._emitRaw = (...args) => this.emit(EVENTS.RAW, ...args), this._boundRemove = this._remove.bind(this), this.options = opts, this._nodeFsHandler = new NodeFsHandler(this), Object.freeze(opts);
    }
    _addIgnoredPath(matcher) {
      if (isMatcherObject(matcher)) {
        for (let ignored of this._ignoredPaths)
          if (isMatcherObject(ignored) && ignored.path === matcher.path && ignored.recursive === matcher.recursive)
            return;
      }
      this._ignoredPaths.add(matcher);
    }
    _removeIgnoredPath(matcher) {
      if (this._ignoredPaths.delete(matcher), typeof matcher === "string") {
        for (let ignored of this._ignoredPaths)
          if (isMatcherObject(ignored) && ignored.path === matcher)
            this._ignoredPaths.delete(ignored);
      }
    }
    add(paths_, _origAdd, _internal) {
      let { cwd: cwd2 } = this.options;
      this.closed = !1, this._closePromise = void 0;
      let paths2 = unifyPaths(paths_);
      if (cwd2)
        paths2 = paths2.map((path12) => {
          return getAbsolutePath(path12, cwd2);
        });
      if (paths2.forEach((path12) => {
        this._removeIgnoredPath(path12);
      }), this._userIgnored = void 0, !this._readyCount)
        this._readyCount = 0;
      return this._readyCount += paths2.length, Promise.all(paths2.map(async (path12) => {
        let res = await this._nodeFsHandler._addToNodeFs(path12, !_internal, void 0, 0, _origAdd);
        if (res)
          this._emitReady();
        return res;
      })).then((results) => {
        if (this.closed)
          return;
        results.forEach((item) => {
          if (item)
            this.add(sysPath2.dirname(item), sysPath2.basename(_origAdd || item));
        });
      }), this;
    }
    unwatch(paths_) {
      if (this.closed)
        return this;
      let paths2 = unifyPaths(paths_), { cwd: cwd2 } = this.options;
      return paths2.forEach((path12) => {
        if (!sysPath2.isAbsolute(path12) && !this._closers.has(path12)) {
          if (cwd2)
            path12 = sysPath2.join(cwd2, path12);
          path12 = sysPath2.resolve(path12);
        }
        if (this._closePath(path12), this._addIgnoredPath(path12), this._watched.has(path12))
          this._addIgnoredPath({
            path: path12,
            recursive: !0
          });
        this._userIgnored = void 0;
      }), this;
    }
    close() {
      if (this._closePromise)
        return this._closePromise;
      this.closed = !0, this.removeAllListeners();
      let closers = [];
      return this._closers.forEach((closerList) => closerList.forEach((closer) => {
        let promise2 = closer();
        if (promise2 instanceof Promise)
          closers.push(promise2);
      })), this._streams.forEach((stream10) => stream10.destroy()), this._userIgnored = void 0, this._readyCount = 0, this._readyEmitted = !1, this._watched.forEach((dirent) => dirent.dispose()), this._closers.clear(), this._watched.clear(), this._streams.clear(), this._symlinkPaths.clear(), this._throttled.clear(), this._closePromise = closers.length ? Promise.all(closers).then(() => {
        return;
      }) : Promise.resolve(), this._closePromise;
    }
    getWatched() {
      let watchList = {};
      return this._watched.forEach((entry, dir) => {
        let index = (this.options.cwd ? sysPath2.relative(this.options.cwd, dir) : dir) || ONE_DOT;
        watchList[index] = entry.getChildren().sort();
      }), watchList;
    }
    emitWithAll(event, args) {
      if (this.emit(event, ...args), event !== EVENTS.ERROR)
        this.emit(EVENTS.ALL, event, ...args);
    }
    async _emit(event, path12, stats) {
      if (this.closed)
        return;
      let opts = this.options;
      if (isWindows2)
        path12 = sysPath2.normalize(path12);
      if (opts.cwd)
        path12 = sysPath2.relative(opts.cwd, path12);
      let args = [path12];
      if (stats != null)
        args.push(stats);
      let awf = opts.awaitWriteFinish, pw;
      if (awf && (pw = this._pendingWrites.get(path12)))
        return pw.lastChange = /* @__PURE__ */ new Date, this;
      if (opts.atomic) {
        if (event === EVENTS.UNLINK)
          return this._pendingUnlinks.set(path12, [event, ...args]), setTimeout(() => {
            this._pendingUnlinks.forEach((entry, path13) => {
              this.emit(...entry), this.emit(EVENTS.ALL, ...entry), this._pendingUnlinks.delete(path13);
            });
          }, typeof opts.atomic === "number" ? opts.atomic : 100), this;
        if (event === EVENTS.ADD && this._pendingUnlinks.has(path12))
          event = EVENTS.CHANGE, this._pendingUnlinks.delete(path12);
      }
      if (awf && (event === EVENTS.ADD || event === EVENTS.CHANGE) && this._readyEmitted) {
        let awfEmit = (err, stats2) => {
          if (err)
            event = EVENTS.ERROR, args[0] = err, this.emitWithAll(event, args);
          else if (stats2) {
            if (args.length > 1)
              args[1] = stats2;
            else
              args.push(stats2);
            this.emitWithAll(event, args);
          }
        };
        return this._awaitWriteFinish(path12, awf.stabilityThreshold, event, awfEmit), this;
      }
      if (event === EVENTS.CHANGE) {
        if (!this._throttle(EVENTS.CHANGE, path12, 50))
          return this;
      }
      if (opts.alwaysStat && stats === void 0 && (event === EVENTS.ADD || event === EVENTS.ADD_DIR || event === EVENTS.CHANGE)) {
        let fullPath = opts.cwd ? sysPath2.join(opts.cwd, path12) : path12, stats2;
        try {
          stats2 = await stat9(fullPath);
        } catch (err) {}
        if (!stats2 || this.closed)
          return;
        args.push(stats2);
      }
      return this.emitWithAll(event, args), this;
    }
    _handleError(error44) {
      let code = error44 && error44.code;
      if (error44 && code !== "ENOENT" && code !== "ENOTDIR" && (!this.options.ignorePermissionErrors || code !== "EPERM" && code !== "EACCES"))
        this.emit(EVENTS.ERROR, error44);
      return error44 || this.closed;
    }
    _throttle(actionType, path12, timeout) {
      if (!this._throttled.has(actionType))
        this._throttled.set(actionType, /* @__PURE__ */ new Map);
      let action = this._throttled.get(actionType);
      if (!action)
        throw Error("invalid throttle");
      let actionPath = action.get(path12);
      if (actionPath)
        return actionPath.count++, !1;
      let timeoutObject, clear = () => {
        let item = action.get(path12), count3 = item ? item.count : 0;
        if (action.delete(path12), clearTimeout(timeoutObject), item)
          clearTimeout(item.timeoutObject);
        return count3;
      };
      timeoutObject = setTimeout(clear, timeout);
      let thr = { timeoutObject, clear, count: 0 };
      return action.set(path12, thr), thr;
    }
    _incrReadyCount() {
      return this._readyCount++;
    }
    _awaitWriteFinish(path12, threshold, event, awfEmit) {
      let awf = this.options.awaitWriteFinish;
      if (typeof awf !== "object")
        return;
      let pollInterval = awf.pollInterval, timeoutHandler, fullPath = path12;
      if (this.options.cwd && !sysPath2.isAbsolute(path12))
        fullPath = sysPath2.join(this.options.cwd, path12);
      let now2 = /* @__PURE__ */ new Date, writes = this._pendingWrites;
      function awaitWriteFinishFn(prevStat) {
        statcb(fullPath, (err, curStat) => {
          if (err || !writes.has(path12)) {
            if (err && err.code !== "ENOENT")
              awfEmit(err);
            return;
          }
          let now3 = Number(/* @__PURE__ */ new Date);
          if (prevStat && curStat.size !== prevStat.size)
            writes.get(path12).lastChange = now3;
          let pw = writes.get(path12);
          if (now3 - pw.lastChange >= threshold)
            writes.delete(path12), awfEmit(void 0, curStat);
          else
            timeoutHandler = setTimeout(awaitWriteFinishFn, pollInterval, curStat);
        });
      }
      if (!writes.has(path12))
        writes.set(path12, {
          lastChange: now2,
          cancelWait: () => {
            return writes.delete(path12), clearTimeout(timeoutHandler), event;
          }
        }), timeoutHandler = setTimeout(awaitWriteFinishFn, pollInterval);
    }
    _isIgnored(path12, stats) {
      if (this.options.atomic && DOT_RE.test(path12))
        return !0;
      if (!this._userIgnored) {
        let { cwd: cwd2 } = this.options, ignored = (this.options.ignored || []).map(normalizeIgnored(cwd2)), list = [...[...this._ignoredPaths].map(normalizeIgnored(cwd2)), ...ignored];
        this._userIgnored = anymatch(list, void 0);
      }
      return this._userIgnored(path12, stats);
    }
    _isntIgnored(path12, stat10) {
      return !this._isIgnored(path12, stat10);
    }
    _getWatchHelpers(path12) {
      return new WatchHelper(path12, this.options.followSymlinks, this);
    }
    _getWatchedDir(directory) {
      let dir = sysPath2.resolve(directory);
      if (!this._watched.has(dir))
        this._watched.set(dir, new DirEntry(dir, this._boundRemove));
      return this._watched.get(dir);
    }
    _hasReadPermissions(stats) {
      if (this.options.ignorePermissionErrors)
        return !0;
      return Boolean(Number(stats.mode) & 256);
    }
    _remove(directory, item, isDirectory) {
      let path12 = sysPath2.join(directory, item), fullPath = sysPath2.resolve(path12);
      if (isDirectory = isDirectory != null ? isDirectory : this._watched.has(path12) || this._watched.has(fullPath), !this._throttle("remove", path12, 100))
        return;
      if (!isDirectory && this._watched.size === 1)
        this.add(directory, item, !0);
      this._getWatchedDir(path12).getChildren().forEach((nested) => this._remove(path12, nested));
      let parent = this._getWatchedDir(directory), wasTracked = parent.has(item);
      if (parent.remove(item), this._symlinkPaths.has(fullPath))
        this._symlinkPaths.delete(fullPath);
      let relPath = path12;
      if (this.options.cwd)
        relPath = sysPath2.relative(this.options.cwd, path12);
      if (this.options.awaitWriteFinish && this._pendingWrites.has(relPath)) {
        if (this._pendingWrites.get(relPath).cancelWait() === EVENTS.ADD)
          return;
      }
      this._watched.delete(path12), this._watched.delete(fullPath);
      let eventName = isDirectory ? EVENTS.UNLINK_DIR : EVENTS.UNLINK;
      if (wasTracked && !this._isIgnored(path12))
        this._emit(eventName, path12);
      this._closePath(path12);
    }
    _closePath(path12) {
      this._closeFile(path12);
      let dir = sysPath2.dirname(path12);
      this._getWatchedDir(dir).remove(sysPath2.basename(path12));
    }
    _closeFile(path12) {
      let closers = this._closers.get(path12);
      if (!closers)
        return;
      closers.forEach((closer) => closer()), this._closers.delete(path12);
    }
    _addPathCloser(path12, closer) {
      if (!closer)
        return;
      let list = this._closers.get(path12);
      if (!list)
        list = [], this._closers.set(path12, list);
      list.push(closer);
    }
    _readdirp(root2, opts) {
      if (this.closed)
        return;
      let options = { type: EVENTS.ALL, alwaysStat: !0, lstat: !0, ...opts, depth: 0 }, stream10 = readdirp(root2, options);
      return this._streams.add(stream10), stream10.once(STR_CLOSE, () => {
        stream10 = void 0;
      }), stream10.once(STR_END, () => {
        if (stream10)
          this._streams.delete(stream10), stream10 = void 0;
      }), stream10;
    }
  };
  esm_default = { watch, FSWatcher };
});
