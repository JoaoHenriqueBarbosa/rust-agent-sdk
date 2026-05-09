// var: require_utf8
var require_utf8 = __commonJS((exports) => {
  var Utils = require_utils14(), BLOCK_CHAR = {
    WW: " ",
    WB: "\u2584",
    BB: "\u2588",
    BW: "\u2580"
  }, INVERTED_BLOCK_CHAR = {
    BB: " ",
    BW: "\u2584",
    WW: "\u2588",
    WB: "\u2580"
  };
  function getBlockChar(top, bottom, blocks) {
    if (top && bottom)
      return blocks.BB;
    if (top && !bottom)
      return blocks.BW;
    if (!top && bottom)
      return blocks.WB;
    return blocks.WW;
  }
  exports.render = function(qrData, options2, cb) {
    let opts = Utils.getOptions(options2), blocks = BLOCK_CHAR;
    if (opts.color.dark.hex === "#ffffff" || opts.color.light.hex === "#000000")
      blocks = INVERTED_BLOCK_CHAR;
    let size = qrData.modules.size, data = qrData.modules.data, output = "", hMargin = Array(size + opts.margin * 2 + 1).join(blocks.WW);
    hMargin = Array(opts.margin / 2 + 1).join(hMargin + `
`);
    let vMargin = Array(opts.margin + 1).join(blocks.WW);
    output += hMargin;
    for (let i5 = 0;i5 < size; i5 += 2) {
      output += vMargin;
      for (let j4 = 0;j4 < size; j4++) {
        let topModule = data[i5 * size + j4], bottomModule = data[(i5 + 1) * size + j4];
        output += getBlockChar(topModule, bottomModule, blocks);
      }
      output += vMargin + `
`;
    }
    if (output += hMargin.slice(0, -1), typeof cb === "function")
      cb(null, output);
    return output;
  };
  exports.renderToFile = function(path25, qrData, options2, cb) {
    if (typeof cb > "u")
      cb = options2, options2 = void 0;
    let fs18 = __require("fs"), utf8 = exports.render(qrData, options2);
    fs18.writeFile(path25, utf8, cb);
  };
});
