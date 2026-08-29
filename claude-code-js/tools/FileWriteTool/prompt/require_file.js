// var: require_file
var require_file = __commonJS((exports, module) => {
  var u5 = require_universalify().fromCallback, path16 = __require("path"), fs14 = require_graceful_fs(), mkdir5 = require_mkdirs();
  function createFile(file2, callback) {
    function makeFile2() {
      fs14.writeFile(file2, "", (err2) => {
        if (err2)
          return callback(err2);
        callback();
      });
    }
    fs14.stat(file2, (err2, stats) => {
      if (!err2 && stats.isFile())
        return callback();
      let dir = path16.dirname(file2);
      fs14.stat(dir, (err3, stats2) => {
        if (err3) {
          if (err3.code === "ENOENT")
            return mkdir5.mkdirs(dir, (err4) => {
              if (err4)
                return callback(err4);
              makeFile2();
            });
          return callback(err3);
        }
        if (stats2.isDirectory())
          makeFile2();
        else
          fs14.readdir(dir, (err4) => {
            if (err4)
              return callback(err4);
          });
      });
    });
  }
  function createFileSync(file2) {
    let stats;
    try {
      stats = fs14.statSync(file2);
    } catch {}
    if (stats && stats.isFile())
      return;
    let dir = path16.dirname(file2);
    try {
      if (!fs14.statSync(dir).isDirectory())
        fs14.readdirSync(dir);
    } catch (err2) {
      if (err2 && err2.code === "ENOENT")
        mkdir5.mkdirsSync(dir);
      else
        throw err2;
    }
    fs14.writeFileSync(file2, "");
  }
  module.exports = {
    createFile: u5(createFile),
    createFileSync
  };
});
