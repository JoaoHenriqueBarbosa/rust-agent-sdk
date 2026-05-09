// var: require_output_file
var require_output_file = __commonJS((exports, module) => {
  var u5 = require_universalify().fromCallback, fs14 = require_graceful_fs(), path16 = __require("path"), mkdir5 = require_mkdirs(), pathExists2 = require_path_exists().pathExists;
  function outputFile(file2, data, encoding, callback) {
    if (typeof encoding === "function")
      callback = encoding, encoding = "utf8";
    let dir = path16.dirname(file2);
    pathExists2(dir, (err2, itDoes) => {
      if (err2)
        return callback(err2);
      if (itDoes)
        return fs14.writeFile(file2, data, encoding, callback);
      mkdir5.mkdirs(dir, (err3) => {
        if (err3)
          return callback(err3);
        fs14.writeFile(file2, data, encoding, callback);
      });
    });
  }
  function outputFileSync(file2, ...args) {
    let dir = path16.dirname(file2);
    if (fs14.existsSync(dir))
      return fs14.writeFileSync(file2, ...args);
    mkdir5.mkdirsSync(dir), fs14.writeFileSync(file2, ...args);
  }
  module.exports = {
    outputFile: u5(outputFile),
    outputFileSync
  };
});
