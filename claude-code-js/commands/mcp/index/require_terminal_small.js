// var: require_terminal_small
var require_terminal_small = __commonJS((exports) => {
  var lineSetupNormal = "\x1B[47m\x1B[30m", lineSetupInverse = "\x1B[40m\x1B[37m", createPalette = function(lineSetup, foregroundWhite2, foregroundBlack2) {
    return {
      "00": "\x1B[0m " + lineSetup,
      "01": "\x1B[0m" + foregroundWhite2 + "\u2584" + lineSetup,
      "02": "\x1B[0m" + foregroundBlack2 + "\u2584" + lineSetup,
      10: "\x1B[0m" + foregroundWhite2 + "\u2580" + lineSetup,
      11: " ",
      12: "\u2584",
      20: "\x1B[0m" + foregroundBlack2 + "\u2580" + lineSetup,
      21: "\u2580",
      22: "\u2588"
    };
  }, mkCodePixel = function(modules, size, x4, y2) {
    let sizePlus = size + 1;
    if (x4 >= sizePlus || y2 >= sizePlus || y2 < -1 || x4 < -1)
      return "0";
    if (x4 >= size || y2 >= size || y2 < 0 || x4 < 0)
      return "1";
    let idx = y2 * size + x4;
    return modules[idx] ? "2" : "1";
  }, mkCode = function(modules, size, x4, y2) {
    return mkCodePixel(modules, size, x4, y2) + mkCodePixel(modules, size, x4, y2 + 1);
  };
  exports.render = function(qrData, options2, cb) {
    let size = qrData.modules.size, data = qrData.modules.data, inverse2 = !!(options2 && options2.inverse), lineSetup = options2 && options2.inverse ? lineSetupInverse : lineSetupNormal, palette = createPalette(lineSetup, inverse2 ? "\x1B[30m" : "\x1B[37m", inverse2 ? "\x1B[37m" : "\x1B[30m"), newLine = `\x1B[0m
` + lineSetup, output = lineSetup;
    for (let y2 = -1;y2 < size + 1; y2 += 2) {
      for (let x4 = -1;x4 < size; x4++)
        output += palette[mkCode(data, size, x4, y2)];
      output += palette[mkCode(data, size, size, y2)] + newLine;
    }
    if (output += "\x1B[0m", typeof cb === "function")
      cb(null, output);
    return output;
  };
});
