// var: require_cross_spawn
var require_cross_spawn = __commonJS((exports, module) => {
  var cp = __require("child_process"), parse5 = require_parse(), enoent = require_enoent();
  function spawn(command, args, options) {
    let parsed = parse5(command, args, options), spawned = cp.spawn(parsed.command, parsed.args, parsed.options);
    return enoent.hookChildProcess(spawned, parsed), spawned;
  }
  function spawnSync(command, args, options) {
    let parsed = parse5(command, args, options), result = cp.spawnSync(parsed.command, parsed.args, parsed.options);
    return result.error = result.error || enoent.verifyENOENTSync(result.status, parsed), result;
  }
  module.exports = spawn;
  module.exports.spawn = spawn;
  module.exports.sync = spawnSync;
  module.exports._parse = parse5;
  module.exports._enoent = enoent;
});
