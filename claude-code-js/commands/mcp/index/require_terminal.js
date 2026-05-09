// var: require_terminal
var require_terminal = __commonJS((exports) => {
  exports.render = function(qrData, options2, cb) {
    let size = qrData.modules.size, data = qrData.modules.data, black2 = "\x1B[40m  \x1B[0m", white2 = "\x1B[47m  \x1B[0m", output = "", hMargin = Array(size + 3).join("\x1B[47m  \x1B[0m"), vMargin = Array(2).join("\x1B[47m  \x1B[0m");
    output += hMargin + `
`;
    for (let i5 = 0;i5 < size; ++i5) {
      output += "\x1B[47m  \x1B[0m";
      for (let j4 = 0;j4 < size; j4++)
        output += data[i5 * size + j4] ? "\x1B[40m  \x1B[0m" : "\x1B[47m  \x1B[0m";
      output += vMargin + `
`;
    }
    if (output += hMargin + `
`, typeof cb === "function")
      cb(null, output);
    return output;
  };
});
