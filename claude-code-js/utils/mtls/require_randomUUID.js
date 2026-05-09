// var: require_randomUUID
var require_randomUUID = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.randomUUID = void 0;
  var tslib_1 = require_tslib(), crypto_1 = tslib_1.__importDefault(__require("crypto"));
  exports.randomUUID = crypto_1.default.randomUUID.bind(crypto_1.default);
});
