// var: require_mtime_precision
var require_mtime_precision = __commonJS((exports, module) => {
  var cacheSymbol = Symbol();
  function probe(file2, fs4, callback) {
    let cachedPrecision = fs4[cacheSymbol];
    if (cachedPrecision)
      return fs4.stat(file2, (err, stat5) => {
        if (err)
          return callback(err);
        callback(null, stat5.mtime, cachedPrecision);
      });
    let mtime = new Date(Math.ceil(Date.now() / 1000) * 1000 + 5);
    fs4.utimes(file2, mtime, mtime, (err) => {
      if (err)
        return callback(err);
      fs4.stat(file2, (err2, stat5) => {
        if (err2)
          return callback(err2);
        let precision = stat5.mtime.getTime() % 1000 === 0 ? "s" : "ms";
        Object.defineProperty(fs4, cacheSymbol, { value: precision }), callback(null, stat5.mtime, precision);
      });
    });
  }
  function getMtime(precision) {
    let now = Date.now();
    if (precision === "s")
      now = Math.ceil(now / 1000) * 1000;
    return new Date(now);
  }
  exports.probe = probe;
  exports.getMtime = getMtime;
});
