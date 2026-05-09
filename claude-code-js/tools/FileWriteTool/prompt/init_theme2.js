// var: init_theme2
var init_theme2 = __esm(() => {
  init_esm11();
  import_yoctocolors_cjs = __toESM(require_yoctocolors_cjs(), 1), defaultTheme = {
    prefix: {
      idle: import_yoctocolors_cjs.default.blue("?"),
      done: import_yoctocolors_cjs.default.green(esm_default2.tick)
    },
    spinner: {
      interval: 80,
      frames: ["\u280B", "\u2819", "\u2839", "\u2838", "\u283C", "\u2834", "\u2826", "\u2827", "\u2807", "\u280F"].map((frame) => import_yoctocolors_cjs.default.yellow(frame))
    },
    style: {
      answer: import_yoctocolors_cjs.default.cyan,
      message: import_yoctocolors_cjs.default.bold,
      error: (text2) => import_yoctocolors_cjs.default.red(`> ${text2}`),
      defaultAnswer: (text2) => import_yoctocolors_cjs.default.dim(`(${text2})`),
      help: import_yoctocolors_cjs.default.dim,
      highlight: import_yoctocolors_cjs.default.cyan,
      key: (text2) => import_yoctocolors_cjs.default.cyan(import_yoctocolors_cjs.default.bold(`<${text2}>`))
    }
  };
});
