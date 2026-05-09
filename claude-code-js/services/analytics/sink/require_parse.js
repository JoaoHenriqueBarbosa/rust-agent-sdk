// var: require_parse
var require_parse = __commonJS((exports, module) => {
  var path2 = __require("path"), resolveCommand = require_resolveCommand(), escape2 = require_escape(), readShebang = require_readShebang(), isWin = process.platform === "win32", isExecutableRegExp = /\.(?:com|exe)$/i, isCmdShimRegExp = /node_modules[\\/].bin[\\/][^\\/]+\.cmd$/i;
  function detectShebang(parsed) {
    parsed.file = resolveCommand(parsed);
    let shebang = parsed.file && readShebang(parsed.file);
    if (shebang)
      return parsed.args.unshift(parsed.file), parsed.command = shebang, resolveCommand(parsed);
    return parsed.file;
  }
  function parseNonShell(parsed) {
    if (!isWin)
      return parsed;
    let commandFile = detectShebang(parsed), needsShell = !isExecutableRegExp.test(commandFile);
    if (parsed.options.forceShell || needsShell) {
      let needsDoubleEscapeMetaChars = isCmdShimRegExp.test(commandFile);
      parsed.command = path2.normalize(parsed.command), parsed.command = escape2.command(parsed.command), parsed.args = parsed.args.map((arg) => escape2.argument(arg, needsDoubleEscapeMetaChars));
      let shellCommand = [parsed.command].concat(parsed.args).join(" ");
      parsed.args = ["/d", "/s", "/c", `"${shellCommand}"`], parsed.command = process.env.comspec || "cmd.exe", parsed.options.windowsVerbatimArguments = !0;
    }
    return parsed;
  }
  function parse5(command, args, options) {
    if (args && !Array.isArray(args))
      options = args, args = null;
    args = args ? args.slice(0) : [], options = Object.assign({}, options);
    let parsed = {
      command,
      args,
      options,
      file: void 0,
      original: {
        command,
        args
      }
    };
    return options.shell ? parsed : parseNonShell(parsed);
  }
  module.exports = parse5;
});
