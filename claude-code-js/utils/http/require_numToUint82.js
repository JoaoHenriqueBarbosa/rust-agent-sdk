// var: require_numToUint82
var require_numToUint82 = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.numToUint8 = void 0;
  function numToUint82(num) {
    return new Uint8Array([
      (num & 4278190080) >> 24,
      (num & 16711680) >> 16,
      (num & 65280) >> 8,
      num & 255
    ]);
  }
  exports.numToUint8 = numToUint82;
});
