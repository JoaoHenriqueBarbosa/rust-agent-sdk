// var: require_browser2
var require_browser2 = __commonJS((exports) => {
  var canPromise = require_can_promise(), QRCode = require_qrcode(), CanvasRenderer = require_canvas2(), SvgRenderer = require_svg_tag();
  function renderCanvas(renderFunc, canvas, text2, opts, cb) {
    let args = [].slice.call(arguments, 1), argsNum = args.length, isLastArgCb = typeof args[argsNum - 1] === "function";
    if (!isLastArgCb && !canPromise())
      throw Error("Callback required as last argument");
    if (isLastArgCb) {
      if (argsNum < 2)
        throw Error("Too few arguments provided");
      if (argsNum === 2)
        cb = text2, text2 = canvas, canvas = opts = void 0;
      else if (argsNum === 3)
        if (canvas.getContext && typeof cb > "u")
          cb = opts, opts = void 0;
        else
          cb = opts, opts = text2, text2 = canvas, canvas = void 0;
    } else {
      if (argsNum < 1)
        throw Error("Too few arguments provided");
      if (argsNum === 1)
        text2 = canvas, canvas = opts = void 0;
      else if (argsNum === 2 && !canvas.getContext)
        opts = text2, text2 = canvas, canvas = void 0;
      return new Promise(function(resolve44, reject2) {
        try {
          let data = QRCode.create(text2, opts);
          resolve44(renderFunc(data, canvas, opts));
        } catch (e) {
          reject2(e);
        }
      });
    }
    try {
      let data = QRCode.create(text2, opts);
      cb(null, renderFunc(data, canvas, opts));
    } catch (e) {
      cb(e);
    }
  }
  exports.create = QRCode.create;
  exports.toCanvas = renderCanvas.bind(null, CanvasRenderer.render);
  exports.toDataURL = renderCanvas.bind(null, CanvasRenderer.renderToDataURL);
  exports.toString = renderCanvas.bind(null, function(data, _, opts) {
    return SvgRenderer.render(data, opts);
  });
});
