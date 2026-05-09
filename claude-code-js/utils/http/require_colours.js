// var: require_colours
var require_colours = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.Colours = void 0;

  class Colours {
    static isEnabled(stream10) {
      return stream10.isTTY && (typeof stream10.getColorDepth === "function" ? stream10.getColorDepth() > 2 : !0);
    }
    static refresh() {
      if (Colours.enabled = Colours.isEnabled(process.stderr), !this.enabled)
        Colours.reset = "", Colours.bright = "", Colours.dim = "", Colours.red = "", Colours.green = "", Colours.yellow = "", Colours.blue = "", Colours.magenta = "", Colours.cyan = "", Colours.white = "", Colours.grey = "";
      else
        Colours.reset = "\x1B[0m", Colours.bright = "\x1B[1m", Colours.dim = "\x1B[2m", Colours.red = "\x1B[31m", Colours.green = "\x1B[32m", Colours.yellow = "\x1B[33m", Colours.blue = "\x1B[34m", Colours.magenta = "\x1B[35m", Colours.cyan = "\x1B[36m", Colours.white = "\x1B[37m", Colours.grey = "\x1B[90m";
    }
  }
  exports.Colours = Colours;
  Colours.enabled = !1;
  Colours.reset = "";
  Colours.bright = "";
  Colours.dim = "";
  Colours.red = "";
  Colours.green = "";
  Colours.yellow = "";
  Colours.blue = "";
  Colours.magenta = "";
  Colours.cyan = "";
  Colours.white = "";
  Colours.grey = "";
  Colours.refresh();
});
