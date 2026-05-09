// var: require_empty
var require_empty = __commonJS((exports, module) => {
  var u5 = require_universalify().fromPromise, fs14 = require_fs(), path16 = __require("path"), mkdir5 = require_mkdirs(), remove = require_remove(), emptyDir = u5(async function(dir) {
    let items;
    try {
      items = await fs14.readdir(dir);
    } catch {
      return mkdir5.mkdirs(dir);
    }
    return Promise.all(items.map((item) => remove.remove(path16.join(dir, item))));
  });
  function emptyDirSync(dir) {
    let items;
    try {
      items = fs14.readdirSync(dir);
    } catch {
      return mkdir5.mkdirsSync(dir);
    }
    items.forEach((item) => {
      item = path16.join(dir, item), remove.removeSync(item);
    });
  }
  module.exports = {
    emptyDirSync,
    emptydirSync: emptyDirSync,
    emptyDir,
    emptydir: emptyDir
  };
});
