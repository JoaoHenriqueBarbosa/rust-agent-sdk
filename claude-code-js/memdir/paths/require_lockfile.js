// var: require_lockfile
var require_lockfile = __commonJS((exports, module) => {
  var path9 = __require("path"), fs4 = require_graceful_fs(), retry5 = require_retry(), onExit2 = require_signal_exit(), mtimePrecision = require_mtime_precision(), locks = {};
  function getLockFile(file2, options) {
    return options.lockfilePath || `${file2}.lock`;
  }
  function resolveCanonicalPath(file2, options, callback) {
    if (!options.realpath)
      return callback(null, path9.resolve(file2));
    options.fs.realpath(file2, callback);
  }
  function acquireLock(file2, options, callback) {
    let lockfilePath = getLockFile(file2, options);
    options.fs.mkdir(lockfilePath, (err) => {
      if (!err)
        return mtimePrecision.probe(lockfilePath, options.fs, (err2, mtime, mtimePrecision2) => {
          if (err2)
            return options.fs.rmdir(lockfilePath, () => {}), callback(err2);
          callback(null, mtime, mtimePrecision2);
        });
      if (err.code !== "EEXIST")
        return callback(err);
      if (options.stale <= 0)
        return callback(Object.assign(Error("Lock file is already being held"), { code: "ELOCKED", file: file2 }));
      options.fs.stat(lockfilePath, (err2, stat5) => {
        if (err2) {
          if (err2.code === "ENOENT")
            return acquireLock(file2, { ...options, stale: 0 }, callback);
          return callback(err2);
        }
        if (!isLockStale(stat5, options))
          return callback(Object.assign(Error("Lock file is already being held"), { code: "ELOCKED", file: file2 }));
        removeLock(file2, options, (err3) => {
          if (err3)
            return callback(err3);
          acquireLock(file2, { ...options, stale: 0 }, callback);
        });
      });
    });
  }
  function isLockStale(stat5, options) {
    return stat5.mtime.getTime() < Date.now() - options.stale;
  }
  function removeLock(file2, options, callback) {
    options.fs.rmdir(getLockFile(file2, options), (err) => {
      if (err && err.code !== "ENOENT")
        return callback(err);
      callback();
    });
  }
  function updateLock(file2, options) {
    let lock2 = locks[file2];
    if (lock2.updateTimeout)
      return;
    if (lock2.updateDelay = lock2.updateDelay || options.update, lock2.updateTimeout = setTimeout(() => {
      lock2.updateTimeout = null, options.fs.stat(lock2.lockfilePath, (err, stat5) => {
        let isOverThreshold = lock2.lastUpdate + options.stale < Date.now();
        if (err) {
          if (err.code === "ENOENT" || isOverThreshold)
            return setLockAsCompromised(file2, lock2, Object.assign(err, { code: "ECOMPROMISED" }));
          return lock2.updateDelay = 1000, updateLock(file2, options);
        }
        if (lock2.mtime.getTime() !== stat5.mtime.getTime())
          return setLockAsCompromised(file2, lock2, Object.assign(Error("Unable to update lock within the stale threshold"), { code: "ECOMPROMISED" }));
        let mtime = mtimePrecision.getMtime(lock2.mtimePrecision);
        options.fs.utimes(lock2.lockfilePath, mtime, mtime, (err2) => {
          let isOverThreshold2 = lock2.lastUpdate + options.stale < Date.now();
          if (lock2.released)
            return;
          if (err2) {
            if (err2.code === "ENOENT" || isOverThreshold2)
              return setLockAsCompromised(file2, lock2, Object.assign(err2, { code: "ECOMPROMISED" }));
            return lock2.updateDelay = 1000, updateLock(file2, options);
          }
          lock2.mtime = mtime, lock2.lastUpdate = Date.now(), lock2.updateDelay = null, updateLock(file2, options);
        });
      });
    }, lock2.updateDelay), lock2.updateTimeout.unref)
      lock2.updateTimeout.unref();
  }
  function setLockAsCompromised(file2, lock2, err) {
    if (lock2.released = !0, lock2.updateTimeout)
      clearTimeout(lock2.updateTimeout);
    if (locks[file2] === lock2)
      delete locks[file2];
    lock2.options.onCompromised(err);
  }
  function lock(file2, options, callback) {
    options = {
      stale: 1e4,
      update: null,
      realpath: !0,
      retries: 0,
      fs: fs4,
      onCompromised: (err) => {
        throw err;
      },
      ...options
    }, options.retries = options.retries || 0, options.retries = typeof options.retries === "number" ? { retries: options.retries } : options.retries, options.stale = Math.max(options.stale || 0, 2000), options.update = options.update == null ? options.stale / 2 : options.update || 0, options.update = Math.max(Math.min(options.update, options.stale / 2), 1000), resolveCanonicalPath(file2, options, (err, file3) => {
      if (err)
        return callback(err);
      let operation = retry5.operation(options.retries);
      operation.attempt(() => {
        acquireLock(file3, options, (err2, mtime, mtimePrecision2) => {
          if (operation.retry(err2))
            return;
          if (err2)
            return callback(operation.mainError());
          let lock2 = locks[file3] = {
            lockfilePath: getLockFile(file3, options),
            mtime,
            mtimePrecision: mtimePrecision2,
            options,
            lastUpdate: Date.now()
          };
          updateLock(file3, options), callback(null, (releasedCallback) => {
            if (lock2.released)
              return releasedCallback && releasedCallback(Object.assign(Error("Lock is already released"), { code: "ERELEASED" }));
            unlock(file3, { ...options, realpath: !1 }, releasedCallback);
          });
        });
      });
    });
  }
  function unlock(file2, options, callback) {
    options = {
      fs: fs4,
      realpath: !0,
      ...options
    }, resolveCanonicalPath(file2, options, (err, file3) => {
      if (err)
        return callback(err);
      let lock2 = locks[file3];
      if (!lock2)
        return callback(Object.assign(Error("Lock is not acquired/owned by you"), { code: "ENOTACQUIRED" }));
      lock2.updateTimeout && clearTimeout(lock2.updateTimeout), lock2.released = !0, delete locks[file3], removeLock(file3, options, callback);
    });
  }
  function check2(file2, options, callback) {
    options = {
      stale: 1e4,
      realpath: !0,
      fs: fs4,
      ...options
    }, options.stale = Math.max(options.stale || 0, 2000), resolveCanonicalPath(file2, options, (err, file3) => {
      if (err)
        return callback(err);
      options.fs.stat(getLockFile(file3, options), (err2, stat5) => {
        if (err2)
          return err2.code === "ENOENT" ? callback(null, !1) : callback(err2);
        return callback(null, !isLockStale(stat5, options));
      });
    });
  }
  function getLocks() {
    return locks;
  }
  onExit2(() => {
    for (let file2 in locks) {
      let options = locks[file2].options;
      try {
        options.fs.rmdirSync(getLockFile(file2, options));
      } catch (e) {}
    }
  });
  exports.lock = lock;
  exports.unlock = unlock;
  exports.check = check2;
  exports.getLocks = getLocks;
});
