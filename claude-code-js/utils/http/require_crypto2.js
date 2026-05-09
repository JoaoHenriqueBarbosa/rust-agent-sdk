// var: require_crypto2
var require_crypto2 = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.NodeCrypto = void 0;
  var crypto11 = __require("crypto");

  class NodeCrypto {
    async sha256DigestBase64(str) {
      return crypto11.createHash("sha256").update(str).digest("base64");
    }
    randomBytesBase64(count3) {
      return crypto11.randomBytes(count3).toString("base64");
    }
    async verify(pubkey, data, signature7) {
      let verifier = crypto11.createVerify("RSA-SHA256");
      return verifier.update(data), verifier.end(), verifier.verify(pubkey, signature7, "base64");
    }
    async sign(privateKey, data) {
      let signer = crypto11.createSign("RSA-SHA256");
      return signer.update(data), signer.end(), signer.sign(privateKey, "base64");
    }
    decodeBase64StringUtf8(base644) {
      return Buffer.from(base644, "base64").toString("utf-8");
    }
    encodeBase64StringUtf8(text) {
      return Buffer.from(text, "utf-8").toString("base64");
    }
    async sha256DigestHex(str) {
      return crypto11.createHash("sha256").update(str).digest("hex");
    }
    async signWithHmacSha256(key, msg) {
      let cryptoKey = typeof key === "string" ? key : toBuffer(key);
      return toArrayBuffer(crypto11.createHmac("sha256", cryptoKey).update(msg).digest());
    }
  }
  exports.NodeCrypto = NodeCrypto;
  function toArrayBuffer(buffer) {
    return buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
  }
  function toBuffer(arrayBuffer) {
    return Buffer.from(arrayBuffer);
  }
});
