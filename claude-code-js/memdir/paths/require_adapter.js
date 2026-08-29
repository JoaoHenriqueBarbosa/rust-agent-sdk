// var: require_adapter
var require_adapter = __commonJS((exports, module) => {
  var fs4 = require_graceful_fs();
  function createSyncFs(fs5) {
    let methods = ["mkdir", "realpath", "stat", "rmdir", "utimes"], newFs = { ...fs5 };
    return methods.forEach((method) => {
      newFs[method] = (...args) => {
        let callback = args.pop(), ret;
        try {
          ret = fs5[`${method}Sync`](...args);
        } catch (err) {
          return callback(err);
        }
        callback(null, ret);
      };
    }), newFs;
  }
  function toPromise(method) {
    return (...args) => new Promise((resolve8, reject) => {
      args.push((err, result) => {
        if (err)
          reject(err);
        else
          resolve8(result);
      }), method(...args);
    });
  }
  function toSync(method) {
    return (...args) => {
      let err, result;
      if (args.push((_err, _result) => {
        err = _err, result = _result;
      }), method(...args), err)
        throw err;
      return result;
    };
  }
  function toSyncOptions(options) {
    if (options = { ...options }, options.fs = createSyncFs(options.fs || fs4), typeof options.retries === "number" && options.retries > 0 || options.retries && typeof options.retries.retries === "number" && options.retries.retries > 0)
      throw Object.assign(Error("Cannot use retries with the sync api"), { code: "ESYNC" });
    return options;
  }
  module.exports = {
    toPromise,
    toSync,
    toSyncOptions
  };
});
