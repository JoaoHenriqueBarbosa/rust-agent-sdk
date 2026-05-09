// var: require_crypto3
var require_crypto3 = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.createCrypto = createCrypto;
  exports.hasBrowserCrypto = hasBrowserCrypto;
  exports.fromArrayBufferToHex = fromArrayBufferToHex;
  var crypto_1 = require_crypto(), crypto_2 = require_crypto2();
  function createCrypto() {
    if (hasBrowserCrypto())
      return new crypto_1.BrowserCrypto;
    return new crypto_2.NodeCrypto;
  }
  function hasBrowserCrypto() {
    return typeof window < "u" && typeof window.crypto < "u" && typeof window.crypto.subtle < "u";
  }
  function fromArrayBufferToHex(arrayBuffer) {
    return Array.from(new Uint8Array(arrayBuffer)).map((byte) => {
      return byte.toString(16).padStart(2, "0");
    }).join("");
  }
});
