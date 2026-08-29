// var: require_commander
var require_commander = __commonJS((exports) => {
  var { Argument } = require_argument(), { Command: Command5 } = require_command(), { CommanderError, InvalidArgumentError } = require_error(), { Help } = require_help(), { Option } = require_option();
  exports.program = new Command5;
  exports.createCommand = (name3) => new Command5(name3);
  exports.createOption = (flags, description) => new Option(flags, description);
  exports.createArgument = (name3, description) => new Argument(name3, description);
  exports.Command = Command5;
  exports.Option = Option;
  exports.Argument = Argument;
  exports.Help = Help;
  exports.CommanderError = CommanderError;
  exports.InvalidArgumentError = InvalidArgumentError;
  exports.InvalidOptionArgumentError = InvalidArgumentError;
});
