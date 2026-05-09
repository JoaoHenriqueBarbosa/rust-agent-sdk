// var: require_escape
var require_escape = __commonJS((exports, module) => {
  var metaCharsRegExp = /([()\][%!^"`<>&|;, *?])/g;
  function escapeCommand(arg) {
    return arg = arg.replace(metaCharsRegExp, "^$1"), arg;
  }
  function escapeArgument(arg, doubleEscapeMetaChars) {
    if (arg = `${arg}`, arg = arg.replace(/(?=(\\+?)?)\1"/g, "$1$1\\\""), arg = arg.replace(/(?=(\\+?)?)\1$/, "$1$1"), arg = `"${arg}"`, arg = arg.replace(metaCharsRegExp, "^$1"), doubleEscapeMetaChars)
      arg = arg.replace(metaCharsRegExp, "^$1");
    return arg;
  }
  exports.command = escapeCommand;
  exports.argument = escapeArgument;
});
