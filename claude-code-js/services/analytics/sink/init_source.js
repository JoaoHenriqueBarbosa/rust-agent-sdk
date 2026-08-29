// var: init_source
var init_source = __esm(() => {
  init_ansi_styles();
  init_supports_color();
  ({ stdout: stdoutColor, stderr: stderrColor } = supports_color_default), GENERATOR = Symbol("GENERATOR"), STYLER = Symbol("STYLER"), IS_EMPTY = Symbol("IS_EMPTY"), levelMapping = [
    "ansi",
    "ansi",
    "ansi256",
    "ansi16m"
  ], styles2 = Object.create(null);
  Object.setPrototypeOf(createChalk.prototype, Function.prototype);
  for (let [styleName, style] of Object.entries(ansi_styles_default))
    styles2[styleName] = {
      get() {
        let builder = createBuilder(this, createStyler(style.open, style.close, this[STYLER]), this[IS_EMPTY]);
        return Object.defineProperty(this, styleName, { value: builder }), builder;
      }
    };
  styles2.visible = {
    get() {
      let builder = createBuilder(this, this[STYLER], !0);
      return Object.defineProperty(this, "visible", { value: builder }), builder;
    }
  };
  usedModels = ["rgb", "hex", "ansi256"];
  for (let model of usedModels) {
    styles2[model] = {
      get() {
        let { level } = this;
        return function(...arguments_) {
          let styler = createStyler(getModelAnsi(model, levelMapping[level], "color", ...arguments_), ansi_styles_default.color.close, this[STYLER]);
          return createBuilder(this, styler, this[IS_EMPTY]);
        };
      }
    };
    let bgModel = "bg" + model[0].toUpperCase() + model.slice(1);
    styles2[bgModel] = {
      get() {
        let { level } = this;
        return function(...arguments_) {
          let styler = createStyler(getModelAnsi(model, levelMapping[level], "bgColor", ...arguments_), ansi_styles_default.bgColor.close, this[STYLER]);
          return createBuilder(this, styler, this[IS_EMPTY]);
        };
      }
    };
  }
  proto = Object.defineProperties(() => {}, {
    ...styles2,
    level: {
      enumerable: !0,
      get() {
        return this[GENERATOR].level;
      },
      set(level) {
        this[GENERATOR].level = level;
      }
    }
  });
  Object.defineProperties(createChalk.prototype, styles2);
  chalk = createChalk(), chalkStderr = createChalk({ level: stderrColor ? stderrColor.level : 0 }), source_default = chalk;
});
