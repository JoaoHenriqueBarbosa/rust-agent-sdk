// var: require_crypto
var require_crypto = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.BrowserCrypto = void 0;
  var base64js = require_base64_js(), crypto_1 = require_crypto3();

  class BrowserCrypto {
    constructor() {
      if (typeof window > "u" || window.crypto === void 0 || window.crypto.subtle === void 0)
        throw Error("SubtleCrypto not found. Make sure it's an https:// website.");
    }
    async sha256DigestBase64(str) {
      let inputBuffer = (/* @__PURE__ */ new TextEncoder()).encode(str), outputBuffer = await window.crypto.subtle.digest("SHA-256", inputBuffer);
      return base64js.fromByteArray(new Uint8Array(outputBuffer));
    }
    randomBytesBase64(count3) {
      let array2 = new Uint8Array(count3);
      return window.crypto.getRandomValues(array2), base64js.fromByteArray(array2);
    }
    static padBase64(base644) {
      while (base644.length % 4 !== 0)
        base644 += "=";
      return base644;
    }
    async verify(pubkey, data, signature7) {
      let algo = {
        name: "RSASSA-PKCS1-v1_5",
        hash: { name: "SHA-256" }
      }, dataArray = (/* @__PURE__ */ new TextEncoder()).encode(data), signatureArray = base64js.toByteArray(BrowserCrypto.padBase64(signature7)), cryptoKey = await window.crypto.subtle.importKey("jwk", pubkey, algo, !0, ["verify"]);
      return await window.crypto.subtle.verify(algo, cryptoKey, signatureArray, dataArray);
    }
    async sign(privateKey, data) {
      let algo = {
        name: "RSASSA-PKCS1-v1_5",
        hash: { name: "SHA-256" }
      }, dataArray = (/* @__PURE__ */ new TextEncoder()).encode(data), cryptoKey = await window.crypto.subtle.importKey("jwk", privateKey, algo, !0, ["sign"]), result = await window.crypto.subtle.sign(algo, cryptoKey, dataArray);
      return base64js.fromByteArray(new Uint8Array(result));
    }
    decodeBase64StringUtf8(base644) {
      let uint8array = base64js.toByteArray(BrowserCrypto.padBase64(base644));
      return (/* @__PURE__ */ new TextDecoder()).decode(uint8array);
    }
    encodeBase64StringUtf8(text) {
      let uint8array = (/* @__PURE__ */ new TextEncoder()).encode(text);
      return base64js.fromByteArray(uint8array);
    }
    async sha256DigestHex(str) {
      let inputBuffer = (/* @__PURE__ */ new TextEncoder()).encode(str), outputBuffer = await window.crypto.subtle.digest("SHA-256", inputBuffer);
      return (0, crypto_1.fromArrayBufferToHex)(outputBuffer);
    }
    async signWithHmacSha256(key, msg) {
      let rawKey = typeof key === "string" ? key : String.fromCharCode(...new Uint16Array(key)), enc = /* @__PURE__ */ new TextEncoder, cryptoKey = await window.crypto.subtle.importKey("raw", enc.encode(rawKey), {
        name: "HMAC",
        hash: {
          name: "SHA-256"
        }
      }, !1, ["sign"]);
      return window.crypto.subtle.sign("HMAC", cryptoKey, enc.encode(msg));
    }
  }
  exports.BrowserCrypto = BrowserCrypto;
});
