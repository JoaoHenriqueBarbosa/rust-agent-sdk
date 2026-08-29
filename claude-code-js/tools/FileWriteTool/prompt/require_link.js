// var: require_link
var require_link = __commonJS((exports, module) => {
  var u5 = require_universalify().fromCallback, path16 = __require("path"), fs14 = require_graceful_fs(), mkdir5 = require_mkdirs(), pathExists2 = require_path_exists().pathExists, { areIdentical } = require_stat();
  function createLink(srcpath, dstpath, callback) {
    function makeLink(srcpath2, dstpath2) {
      fs14.link(srcpath2, dstpath2, (err2) => {
        if (err2)
          return callback(err2);
        callback(null);
      });
    }
    fs14.lstat(dstpath, (_, dstStat) => {
      fs14.lstat(srcpath, (err2, srcStat) => {
        if (err2)
          return err2.message = err2.message.replace("lstat", "ensureLink"), callback(err2);
        if (dstStat && areIdentical(srcStat, dstStat))
          return callback(null);
        let dir = path16.dirname(dstpath);
        pathExists2(dir, (err3, dirExists) => {
          if (err3)
            return callback(err3);
          if (dirExists)
            return makeLink(srcpath, dstpath);
          mkdir5.mkdirs(dir, (err4) => {
            if (err4)
              return callback(err4);
            makeLink(srcpath, dstpath);
          });
        });
      });
    });
  }
  function createLinkSync(srcpath, dstpath) {
    let dstStat;
    try {
      dstStat = fs14.lstatSync(dstpath);
    } catch {}
    try {
      let srcStat = fs14.lstatSync(srcpath);
      if (dstStat && areIdentical(srcStat, dstStat))
        return;
    } catch (err2) {
      throw err2.message = err2.message.replace("lstat", "ensureLink"), err2;
    }
    let dir = path16.dirname(dstpath);
    if (fs14.existsSync(dir))
      return fs14.linkSync(srcpath, dstpath);
    return mkdir5.mkdirsSync(dir), fs14.linkSync(srcpath, dstpath);
  }
  module.exports = {
    createLink: u5(createLink),
    createLinkSync
  };
});
