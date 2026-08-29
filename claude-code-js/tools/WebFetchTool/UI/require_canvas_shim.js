// var: require_canvas_shim
var require_canvas_shim = __commonJS((exports, module) => {
  class Canvas {
    constructor(width, height2) {
      this.width = width, this.height = height2;
    }
    getContext() {
      return null;
    }
    toDataURL() {
      return "";
    }
  }
  module.exports = {
    createCanvas: (width, height2) => new Canvas(width, height2)
  };
});
