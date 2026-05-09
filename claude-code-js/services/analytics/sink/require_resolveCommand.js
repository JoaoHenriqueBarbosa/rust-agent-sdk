// var: require_resolveCommand
var require_resolveCommand = __commonJS((exports, module) => {
  var path2 = __require("path"), which = require_which(), getPathKey = require_path_key();
  function resolveCommandAttempt(parsed, withoutPathExt) {
    let env2 = parsed.options.env || process.env, cwd2 = process.cwd(), hasCustomCwd = parsed.options.cwd != null, shouldSwitchCwd = hasCustomCwd && process.chdir !== void 0 && !process.chdir.disabled;
    if (shouldSwitchCwd)
      try {
        process.chdir(parsed.options.cwd);
      } catch (err) {}
    let resolved;
    try {
      resolved = which.sync(parsed.command, {
        path: env2[getPathKey({ env: env2 })],
        pathExt: withoutPathExt ? path2.delimiter : void 0
      });
    } catch (e) {} finally {
      if (shouldSwitchCwd)
        process.chdir(cwd2);
    }
    if (resolved)
      resolved = path2.resolve(hasCustomCwd ? parsed.options.cwd : "", resolved);
    return resolved;
  }
  function resolveCommand(parsed) {
    return resolveCommandAttempt(parsed) || resolveCommandAttempt(parsed, !0);
  }
  module.exports = resolveCommand;
});
