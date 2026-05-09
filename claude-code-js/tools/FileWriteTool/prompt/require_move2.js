// var: require_move2
var require_move2 = __commonJS((exports, module) => {
  var u5 = require_universalify().fromCallback;
  module.exports = {
    move: u5(require_move()),
    moveSync: require_move_sync()
  };
});
