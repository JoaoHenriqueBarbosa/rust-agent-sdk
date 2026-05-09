// function: convertOptionFormats
function convertOptionFormats(options2) {
  var _a4, _b2, _c118, _d;
  let opts = options2 !== null && options2 !== void 0 ? options2 : defaultOptions2;
  return (_a4 = opts.adapter) !== null && _a4 !== void 0 || (opts.adapter = exports_esm7), (_b2 = opts.equals) !== null && _b2 !== void 0 || (opts.equals = (_d = (_c118 = opts.adapter) === null || _c118 === void 0 ? void 0 : _c118.equals) !== null && _d !== void 0 ? _d : defaultEquals), opts;
}
