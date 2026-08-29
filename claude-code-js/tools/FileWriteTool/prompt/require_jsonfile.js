// var: require_jsonfile
var require_jsonfile = __commonJS((exports, module) => {
  var _fs;
  try {
    _fs = require_graceful_fs();
  } catch (_) {
    _fs = __require("fs");
  }
  var universalify = require_universalify(), { stringify: stringify2, stripBom } = require_utils2();
  async function _readFile(file2, options = {}) {
    if (typeof options === "string")
      options = { encoding: options };
    let fs14 = options.fs || _fs, shouldThrow = "throws" in options ? options.throws : !0, data = await universalify.fromCallback(fs14.readFile)(file2, options);
    data = stripBom(data);
    let obj;
    try {
      obj = JSON.parse(data, options ? options.reviver : null);
    } catch (err2) {
      if (shouldThrow)
        throw err2.message = `${file2}: ${err2.message}`, err2;
      else
        return null;
    }
    return obj;
  }
  var readFile13 = universalify.fromPromise(_readFile);
  function readFileSync14(file2, options = {}) {
    if (typeof options === "string")
      options = { encoding: options };
    let fs14 = options.fs || _fs, shouldThrow = "throws" in options ? options.throws : !0;
    try {
      let content = fs14.readFileSync(file2, options);
      return content = stripBom(content), JSON.parse(content, options.reviver);
    } catch (err2) {
      if (shouldThrow)
        throw err2.message = `${file2}: ${err2.message}`, err2;
      else
        return null;
    }
  }
  async function _writeFile(file2, obj, options = {}) {
    let fs14 = options.fs || _fs, str = stringify2(obj, options);
    await universalify.fromCallback(fs14.writeFile)(file2, str, options);
  }
  var writeFile5 = universalify.fromPromise(_writeFile);
  function writeFileSync4(file2, obj, options = {}) {
    let fs14 = options.fs || _fs, str = stringify2(obj, options);
    return fs14.writeFileSync(file2, str, options);
  }
  module.exports = {
    readFile: readFile13,
    readFileSync: readFileSync14,
    writeFile: writeFile5,
    writeFileSync: writeFileSync4
  };
});
