// var: require_png_sync
var require_png_sync = __commonJS((exports) => {
  var parse18 = require_parser_sync(), pack2 = require_packer_sync();
  exports.read = function(buffer, options2) {
    return parse18(buffer, options2 || {});
  };
  exports.write = function(png, options2) {
    return pack2(png, options2);
  };
});
