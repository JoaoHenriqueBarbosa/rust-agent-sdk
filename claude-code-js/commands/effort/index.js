// Original: src/commands/effort/index.ts
var effort_default;
var init_effort3 = __esm(() => {
  effort_default = {
    type: "local-jsx",
    name: "effort",
    description: "Set effort level for model usage",
    argumentHint: "[low|medium|high|max|auto]",
    get immediate() {
      return shouldInferenceConfigCommandBeImmediate();
    },
    load: () => Promise.resolve().then(() => (init_effort2(), exports_effort))
  };
});

// node_modules/asciichart/asciichart.js
var require_asciichart = __commonJS((exports) => {
  (function(exports2) {
    exports2.black = "\x1B[30m", exports2.red = "\x1B[31m", exports2.green = "\x1B[32m", exports2.yellow = "\x1B[33m", exports2.blue = "\x1B[34m", exports2.magenta = "\x1B[35m", exports2.cyan = "\x1B[36m", exports2.lightgray = "\x1B[37m", exports2.default = "\x1B[39m", exports2.darkgray = "\x1B[90m", exports2.lightred = "\x1B[91m", exports2.lightgreen = "\x1B[92m", exports2.lightyellow = "\x1B[93m", exports2.lightblue = "\x1B[94m", exports2.lightmagenta = "\x1B[95m", exports2.lightcyan = "\x1B[96m", exports2.white = "\x1B[97m", exports2.reset = "\x1B[0m";
    function colored(char, color3) {
      return color3 === void 0 ? char : color3 + char + exports2.reset;
    }
    exports2.colored = colored, exports2.plot = function(series, cfg = void 0) {
      if (typeof series[0] == "number")
        series = [series];
      cfg = typeof cfg < "u" ? cfg : {};
      let min = typeof cfg.min < "u" ? cfg.min : series[0][0], max2 = typeof cfg.max < "u" ? cfg.max : series[0][0];
      for (let j4 = 0;j4 < series.length; j4++)
        for (let i5 = 0;i5 < series[j4].length; i5++)
          min = Math.min(min, series[j4][i5]), max2 = Math.max(max2, series[j4][i5]);
      let defaultSymbols = ["\u253C", "\u2524", "\u2576", "\u2574", "\u2500", "\u2570", "\u256D", "\u256E", "\u256F", "\u2502"], range = Math.abs(max2 - min), offset = typeof cfg.offset < "u" ? cfg.offset : 3, padding = typeof cfg.padding < "u" ? cfg.padding : "           ", height2 = typeof cfg.height < "u" ? cfg.height : range, colors4 = typeof cfg.colors < "u" ? cfg.colors : [], ratio = range !== 0 ? height2 / range : 1, min2 = Math.round(min * ratio), max22 = Math.round(max2 * ratio), rows = Math.abs(max22 - min2), width = 0;
      for (let i5 = 0;i5 < series.length; i5++)
        width = Math.max(width, series[i5].length);
      width = width + offset;
      let symbols = typeof cfg.symbols < "u" ? cfg.symbols : defaultSymbols, format4 = typeof cfg.format < "u" ? cfg.format : function(x4) {
        return (padding + x4.toFixed(2)).slice(-padding.length);
      }, result = Array(rows + 1);
      for (let i5 = 0;i5 <= rows; i5++) {
        result[i5] = Array(width);
        for (let j4 = 0;j4 < width; j4++)
          result[i5][j4] = " ";
      }
      for (let y2 = min2;y2 <= max22; ++y2) {
        let label = format4(rows > 0 ? max2 - (y2 - min2) * range / rows : y2, y2 - min2);
        result[y2 - min2][Math.max(offset - label.length, 0)] = label, result[y2 - min2][offset - 1] = y2 == 0 ? symbols[0] : symbols[1];
      }
      for (let j4 = 0;j4 < series.length; j4++) {
        let currentColor = colors4[j4 % colors4.length], y0 = Math.round(series[j4][0] * ratio) - min2;
        result[rows - y0][offset - 1] = colored(symbols[0], currentColor);
        for (let x4 = 0;x4 < series[j4].length - 1; x4++) {
          let y02 = Math.round(series[j4][x4 + 0] * ratio) - min2, y1 = Math.round(series[j4][x4 + 1] * ratio) - min2;
          if (y02 == y1)
            result[rows - y02][x4 + offset] = colored(symbols[4], currentColor);
          else {
            result[rows - y1][x4 + offset] = colored(y02 > y1 ? symbols[5] : symbols[6], currentColor), result[rows - y02][x4 + offset] = colored(y02 > y1 ? symbols[7] : symbols[8], currentColor);
            let from = Math.min(y02, y1), to = Math.max(y02, y1);
            for (let y2 = from + 1;y2 < to; y2++)
              result[rows - y2][x4 + offset] = colored(symbols[9], currentColor);
          }
        }
      }
      return result.map(function(x4) {
        return x4.join("");
      }).join(`
`);
    };
  })(typeof exports > "u" ? exports.asciichart = {} : exports);
});
