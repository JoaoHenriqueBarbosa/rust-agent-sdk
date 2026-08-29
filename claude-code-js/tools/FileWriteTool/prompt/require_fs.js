// var: require_fs
var require_fs = __commonJS((exports) => {
  var u5 = require_universalify().fromCallback, fs14 = require_graceful_fs(), api2 = [
    "access",
    "appendFile",
    "chmod",
    "chown",
    "close",
    "copyFile",
    "fchmod",
    "fchown",
    "fdatasync",
    "fstat",
    "fsync",
    "ftruncate",
    "futimes",
    "lchmod",
    "lchown",
    "link",
    "lstat",
    "mkdir",
    "mkdtemp",
    "open",
    "opendir",
    "readdir",
    "readFile",
    "readlink",
    "realpath",
    "rename",
    "rm",
    "rmdir",
    "stat",
    "symlink",
    "truncate",
    "unlink",
    "utimes",
    "writeFile"
  ].filter((key2) => {
    return typeof fs14[key2] === "function";
  });
  Object.assign(exports, fs14);
  api2.forEach((method) => {
    exports[method] = u5(fs14[method]);
  });
  exports.exists = function(filename, callback) {
    if (typeof callback === "function")
      return fs14.exists(filename, callback);
    return new Promise((resolve20) => {
      return fs14.exists(filename, resolve20);
    });
  };
  exports.read = function(fd2, buffer, offset, length, position, callback) {
    if (typeof callback === "function")
      return fs14.read(fd2, buffer, offset, length, position, callback);
    return new Promise((resolve20, reject2) => {
      fs14.read(fd2, buffer, offset, length, position, (err2, bytesRead, buffer2) => {
        if (err2)
          return reject2(err2);
        resolve20({ bytesRead, buffer: buffer2 });
      });
    });
  };
  exports.write = function(fd2, buffer, ...args) {
    if (typeof args[args.length - 1] === "function")
      return fs14.write(fd2, buffer, ...args);
    return new Promise((resolve20, reject2) => {
      fs14.write(fd2, buffer, ...args, (err2, bytesWritten, buffer2) => {
        if (err2)
          return reject2(err2);
        resolve20({ bytesWritten, buffer: buffer2 });
      });
    });
  };
  if (typeof fs14.writev === "function")
    exports.writev = function(fd2, buffers, ...args) {
      if (typeof args[args.length - 1] === "function")
        return fs14.writev(fd2, buffers, ...args);
      return new Promise((resolve20, reject2) => {
        fs14.writev(fd2, buffers, ...args, (err2, bytesWritten, buffers2) => {
          if (err2)
            return reject2(err2);
          resolve20({ bytesWritten, buffers: buffers2 });
        });
      });
    };
  if (typeof fs14.realpath.native === "function")
    exports.realpath.native = u5(fs14.realpath.native);
  else
    process.emitWarning("fs.realpath.native is not a function. Is fs being monkey-patched?", "Warning", "fs-extra-WARN0003");
});
