// var: require_getMapping
var require_getMapping = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.getMapping = void 0;
  var ExponentMapping_1 = require_ExponentMapping(), LogarithmMapping_1 = require_LogarithmMapping(), types_1 = require_types4(), MIN_SCALE = -10, MAX_SCALE = 20, PREBUILT_MAPPINGS = Array.from({ length: 31 }, (_, i5) => {
    if (i5 > 10)
      return new LogarithmMapping_1.LogarithmMapping(i5 - 10);
    return new ExponentMapping_1.ExponentMapping(i5 - 10);
  });
  function getMapping(scale) {
    if (scale > MAX_SCALE || scale < MIN_SCALE)
      throw new types_1.MappingError(`expected scale >= ${MIN_SCALE} && <= ${MAX_SCALE}, got: ${scale}`);
    return PREBUILT_MAPPINGS[scale + 10];
  }
  exports.getMapping = getMapping;
});
