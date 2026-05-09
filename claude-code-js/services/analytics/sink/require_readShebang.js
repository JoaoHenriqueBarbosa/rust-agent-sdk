// var: require_readShebang
var require_readShebang = __commonJS((exports, module) => {
  var fs2 = __require("fs"), shebangCommand = require_shebang_command();
  function readShebang(command) {
    let buffer = Buffer.alloc(150), fd;
    try {
      fd = fs2.openSync(command, "r"), fs2.readSync(fd, buffer, 0, 150, 0), fs2.closeSync(fd);
    } catch (e) {}
    return shebangCommand(buffer.toString());
  }
  module.exports = readShebang;
});
