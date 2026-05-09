// var: require_svg2
var require_svg2 = __commonJS((exports) => {
  var svgTagRenderer = require_svg_tag();
  exports.render = svgTagRenderer.render;
  exports.renderToFile = function(path25, qrData, options2, cb) {
    if (typeof cb > "u")
      cb = options2, options2 = void 0;
    let fs18 = __require("fs"), xmlStr = '<?xml version="1.0" encoding="utf-8"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">' + exports.render(qrData, options2);
    fs18.writeFile(path25, xmlStr, cb);
  };
});
