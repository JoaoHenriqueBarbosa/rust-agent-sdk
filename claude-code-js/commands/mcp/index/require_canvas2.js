// var: require_canvas2
var require_canvas2 = __commonJS((exports) => {
  var Utils = require_utils14();
  function clearCanvas(ctx, canvas, size) {
    if (ctx.clearRect(0, 0, canvas.width, canvas.height), !canvas.style)
      canvas.style = {};
    canvas.height = size, canvas.width = size, canvas.style.height = size + "px", canvas.style.width = size + "px";
  }
  function getCanvasElement() {
    try {
      return document.createElement("canvas");
    } catch (e) {
      throw Error("You need to specify a canvas element");
    }
  }
  exports.render = function(qrData, canvas, options2) {
    let opts = options2, canvasEl = canvas;
    if (typeof opts > "u" && (!canvas || !canvas.getContext))
      opts = canvas, canvas = void 0;
    if (!canvas)
      canvasEl = getCanvasElement();
    opts = Utils.getOptions(opts);
    let size = Utils.getImageWidth(qrData.modules.size, opts), ctx = canvasEl.getContext("2d"), image = ctx.createImageData(size, size);
    return Utils.qrToImageData(image.data, qrData, opts), clearCanvas(ctx, canvasEl, size), ctx.putImageData(image, 0, 0), canvasEl;
  };
  exports.renderToDataURL = function(qrData, canvas, options2) {
    let opts = options2;
    if (typeof opts > "u" && (!canvas || !canvas.getContext))
      opts = canvas, canvas = void 0;
    if (!opts)
      opts = {};
    let canvasEl = exports.render(qrData, canvas, opts), type = opts.type || "image/png", rendererOpts = opts.rendererOpts || {};
    return canvasEl.toDataURL(type, rendererOpts.quality);
  };
});
