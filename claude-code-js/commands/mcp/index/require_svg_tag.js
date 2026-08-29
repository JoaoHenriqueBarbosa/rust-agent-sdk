// var: require_svg_tag
var require_svg_tag = __commonJS((exports) => {
  var Utils = require_utils14();
  function getColorAttrib(color3, attrib) {
    let alpha = color3.a / 255, str2 = attrib + '="' + color3.hex + '"';
    return alpha < 1 ? str2 + " " + attrib + '-opacity="' + alpha.toFixed(2).slice(1) + '"' : str2;
  }
  function svgCmd(cmd, x4, y2) {
    let str2 = cmd + x4;
    if (typeof y2 < "u")
      str2 += " " + y2;
    return str2;
  }
  function qrToPath(data, size, margin) {
    let path25 = "", moveBy = 0, newRow = !1, lineLength = 0;
    for (let i5 = 0;i5 < data.length; i5++) {
      let col = Math.floor(i5 % size), row = Math.floor(i5 / size);
      if (!col && !newRow)
        newRow = !0;
      if (data[i5]) {
        if (lineLength++, !(i5 > 0 && col > 0 && data[i5 - 1]))
          path25 += newRow ? svgCmd("M", col + margin, 0.5 + row + margin) : svgCmd("m", moveBy, 0), moveBy = 0, newRow = !1;
        if (!(col + 1 < size && data[i5 + 1]))
          path25 += svgCmd("h", lineLength), lineLength = 0;
      } else
        moveBy++;
    }
    return path25;
  }
  exports.render = function(qrData, options2, cb) {
    let opts = Utils.getOptions(options2), size = qrData.modules.size, data = qrData.modules.data, qrcodesize = size + opts.margin * 2, bg = !opts.color.light.a ? "" : "<path " + getColorAttrib(opts.color.light, "fill") + ' d="M0 0h' + qrcodesize + "v" + qrcodesize + 'H0z"/>', path25 = "<path " + getColorAttrib(opts.color.dark, "stroke") + ' d="' + qrToPath(data, size, opts.margin) + '"/>', viewBox = 'viewBox="0 0 ' + qrcodesize + " " + qrcodesize + '"', svgTag = '<svg xmlns="http://www.w3.org/2000/svg" ' + (!opts.width ? "" : 'width="' + opts.width + '" height="' + opts.width + '" ') + viewBox + ' shape-rendering="crispEdges">' + bg + path25 + `</svg>
`;
    if (typeof cb === "function")
      cb(null, svgTag);
    return svgTag;
  };
});
