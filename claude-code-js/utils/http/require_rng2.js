// var: require_rng2
var require_rng2 = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", {
    value: !0
  });
  exports.default = rng;
  var _crypto = _interopRequireDefault(__require("crypto"));
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  var rnds8Pool = new Uint8Array(256), poolPtr = rnds8Pool.length;
  function rng() {
    if (poolPtr > rnds8Pool.length - 16)
      _crypto.default.randomFillSync(rnds8Pool), poolPtr = 0;
    return rnds8Pool.slice(poolPtr, poolPtr += 16);
  }
});
