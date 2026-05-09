// var: require_copy2
var require_copy2 = __commonJS((exports, module) => {
  var u5 = require_universalify().fromCallback;
  module.exports = {
    copy: u5(require_copy()),
    copySync: require_copy_sync()
  };
});
