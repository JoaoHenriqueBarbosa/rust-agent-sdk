// var: require_utimes
var require_utimes = __commonJS((exports, module) => {
  var fs14 = require_graceful_fs();
  function utimesMillis(path16, atime, mtime, callback) {
    fs14.open(path16, "r+", (err2, fd2) => {
      if (err2)
        return callback(err2);
      fs14.futimes(fd2, atime, mtime, (futimesErr) => {
        fs14.close(fd2, (closeErr) => {
          if (callback)
            callback(futimesErr || closeErr);
        });
      });
    });
  }
  function utimesMillisSync(path16, atime, mtime) {
    let fd2 = fs14.openSync(path16, "r+");
    return fs14.futimesSync(fd2, atime, mtime), fs14.closeSync(fd2);
  }
  module.exports = {
    utimesMillis,
    utimesMillisSync
  };
});
