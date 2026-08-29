// var: require_rimraf
var require_rimraf = __commonJS((exports, module) => {
  var fs14 = require_graceful_fs(), path16 = __require("path"), assert3 = __require("assert"), isWindows3 = process.platform === "win32";
  function defaults2(options) {
    [
      "unlink",
      "chmod",
      "stat",
      "lstat",
      "rmdir",
      "readdir"
    ].forEach((m4) => {
      options[m4] = options[m4] || fs14[m4], m4 = m4 + "Sync", options[m4] = options[m4] || fs14[m4];
    }), options.maxBusyTries = options.maxBusyTries || 3;
  }
  function rimraf(p4, options, cb) {
    let busyTries = 0;
    if (typeof options === "function")
      cb = options, options = {};
    assert3(p4, "rimraf: missing path"), assert3.strictEqual(typeof p4, "string", "rimraf: path should be a string"), assert3.strictEqual(typeof cb, "function", "rimraf: callback function required"), assert3(options, "rimraf: invalid options argument provided"), assert3.strictEqual(typeof options, "object", "rimraf: options should be object"), defaults2(options), rimraf_(p4, options, function CB(er) {
      if (er) {
        if ((er.code === "EBUSY" || er.code === "ENOTEMPTY" || er.code === "EPERM") && busyTries < options.maxBusyTries) {
          busyTries++;
          let time3 = busyTries * 100;
          return setTimeout(() => rimraf_(p4, options, CB), time3);
        }
        if (er.code === "ENOENT")
          er = null;
      }
      cb(er);
    });
  }
  function rimraf_(p4, options, cb) {
    assert3(p4), assert3(options), assert3(typeof cb === "function"), options.lstat(p4, (er, st) => {
      if (er && er.code === "ENOENT")
        return cb(null);
      if (er && er.code === "EPERM" && isWindows3)
        return fixWinEPERM(p4, options, er, cb);
      if (st && st.isDirectory())
        return rmdir(p4, options, er, cb);
      options.unlink(p4, (er2) => {
        if (er2) {
          if (er2.code === "ENOENT")
            return cb(null);
          if (er2.code === "EPERM")
            return isWindows3 ? fixWinEPERM(p4, options, er2, cb) : rmdir(p4, options, er2, cb);
          if (er2.code === "EISDIR")
            return rmdir(p4, options, er2, cb);
        }
        return cb(er2);
      });
    });
  }
  function fixWinEPERM(p4, options, er, cb) {
    assert3(p4), assert3(options), assert3(typeof cb === "function"), options.chmod(p4, 438, (er2) => {
      if (er2)
        cb(er2.code === "ENOENT" ? null : er);
      else
        options.stat(p4, (er3, stats) => {
          if (er3)
            cb(er3.code === "ENOENT" ? null : er);
          else if (stats.isDirectory())
            rmdir(p4, options, er, cb);
          else
            options.unlink(p4, cb);
        });
    });
  }
  function fixWinEPERMSync(p4, options, er) {
    let stats;
    assert3(p4), assert3(options);
    try {
      options.chmodSync(p4, 438);
    } catch (er2) {
      if (er2.code === "ENOENT")
        return;
      else
        throw er;
    }
    try {
      stats = options.statSync(p4);
    } catch (er3) {
      if (er3.code === "ENOENT")
        return;
      else
        throw er;
    }
    if (stats.isDirectory())
      rmdirSync3(p4, options, er);
    else
      options.unlinkSync(p4);
  }
  function rmdir(p4, options, originalEr, cb) {
    assert3(p4), assert3(options), assert3(typeof cb === "function"), options.rmdir(p4, (er) => {
      if (er && (er.code === "ENOTEMPTY" || er.code === "EEXIST" || er.code === "EPERM"))
        rmkids(p4, options, cb);
      else if (er && er.code === "ENOTDIR")
        cb(originalEr);
      else
        cb(er);
    });
  }
  function rmkids(p4, options, cb) {
    assert3(p4), assert3(options), assert3(typeof cb === "function"), options.readdir(p4, (er, files) => {
      if (er)
        return cb(er);
      let n5 = files.length, errState;
      if (n5 === 0)
        return options.rmdir(p4, cb);
      files.forEach((f) => {
        rimraf(path16.join(p4, f), options, (er2) => {
          if (errState)
            return;
          if (er2)
            return cb(errState = er2);
          if (--n5 === 0)
            options.rmdir(p4, cb);
        });
      });
    });
  }
  function rimrafSync(p4, options) {
    let st;
    options = options || {}, defaults2(options), assert3(p4, "rimraf: missing path"), assert3.strictEqual(typeof p4, "string", "rimraf: path should be a string"), assert3(options, "rimraf: missing options"), assert3.strictEqual(typeof options, "object", "rimraf: options should be object");
    try {
      st = options.lstatSync(p4);
    } catch (er) {
      if (er.code === "ENOENT")
        return;
      if (er.code === "EPERM" && isWindows3)
        fixWinEPERMSync(p4, options, er);
    }
    try {
      if (st && st.isDirectory())
        rmdirSync3(p4, options, null);
      else
        options.unlinkSync(p4);
    } catch (er) {
      if (er.code === "ENOENT")
        return;
      else if (er.code === "EPERM")
        return isWindows3 ? fixWinEPERMSync(p4, options, er) : rmdirSync3(p4, options, er);
      else if (er.code !== "EISDIR")
        throw er;
      rmdirSync3(p4, options, er);
    }
  }
  function rmdirSync3(p4, options, originalEr) {
    assert3(p4), assert3(options);
    try {
      options.rmdirSync(p4);
    } catch (er) {
      if (er.code === "ENOTDIR")
        throw originalEr;
      else if (er.code === "ENOTEMPTY" || er.code === "EEXIST" || er.code === "EPERM")
        rmkidsSync(p4, options);
      else if (er.code !== "ENOENT")
        throw er;
    }
  }
  function rmkidsSync(p4, options) {
    if (assert3(p4), assert3(options), options.readdirSync(p4).forEach((f) => rimrafSync(path16.join(p4, f), options)), isWindows3) {
      let startTime = Date.now();
      do
        try {
          return options.rmdirSync(p4, options);
        } catch {}
      while (Date.now() - startTime < 500);
    } else
      return options.rmdirSync(p4, options);
  }
  module.exports = rimraf;
  rimraf.sync = rimrafSync;
});
