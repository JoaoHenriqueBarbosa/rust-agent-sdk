// var: require_png2
var require_png2 = __commonJS((exports) => {
  var fs18 = __require("fs"), PNG = require_png().PNG, Utils = require_utils14();
  exports.render = function(qrData, options2) {
    let opts = Utils.getOptions(options2), pngOpts = opts.rendererOpts, size = Utils.getImageWidth(qrData.modules.size, opts);
    pngOpts.width = size, pngOpts.height = size;
    let pngImage = new PNG(pngOpts);
    return Utils.qrToImageData(pngImage.data, qrData, opts), pngImage;
  };
  exports.renderToDataURL = function(qrData, options2, cb) {
    if (typeof cb > "u")
      cb = options2, options2 = void 0;
    exports.renderToBuffer(qrData, options2, function(err2, output) {
      if (err2)
        cb(err2);
      let url3 = "data:image/png;base64,";
      url3 += output.toString("base64"), cb(null, url3);
    });
  };
  exports.renderToBuffer = function(qrData, options2, cb) {
    if (typeof cb > "u")
      cb = options2, options2 = void 0;
    let png = exports.render(qrData, options2), buffer = [];
    png.on("error", cb), png.on("data", function(data) {
      buffer.push(data);
    }), png.on("end", function() {
      cb(null, Buffer.concat(buffer));
    }), png.pack();
  };
  exports.renderToFile = function(path25, qrData, options2, cb) {
    if (typeof cb > "u")
      cb = options2, options2 = void 0;
    let called = !1, done = (...args) => {
      if (called)
        return;
      called = !0, cb.apply(null, args);
    }, stream10 = fs18.createWriteStream(path25);
    stream10.on("error", done), stream10.on("close", done), exports.renderToFileStream(stream10, qrData, options2);
  };
  exports.renderToFileStream = function(stream10, qrData, options2) {
    exports.render(qrData, options2).pack().pipe(stream10);
  };
});
