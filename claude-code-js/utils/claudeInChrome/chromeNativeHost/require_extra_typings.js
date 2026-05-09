// var: require_extra_typings
var require_extra_typings = __commonJS((exports, module) => {
  var commander = require_commander();
  exports = module.exports = {};
  exports.program = new commander.Command;
  exports.Argument = commander.Argument;
  exports.Command = commander.Command;
  exports.CommanderError = commander.CommanderError;
  exports.Help = commander.Help;
  exports.InvalidArgumentError = commander.InvalidArgumentError;
  exports.InvalidOptionArgumentError = commander.InvalidArgumentError;
  exports.Option = commander.Option;
  exports.createCommand = (name3) => new commander.Command(name3);
  exports.createOption = (flags, description) => new commander.Option(flags, description);
  exports.createArgument = (name3, description) => new commander.Argument(name3, description);
});
