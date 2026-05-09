// var: require_dist_cjs38
var require_dist_cjs38 = __commonJS((exports) => {
  var SHORT_TO_HEX = {}, HEX_TO_SHORT = {};
  for (let i2 = 0;i2 < 256; i2++) {
    let encodedByte = i2.toString(16).toLowerCase();
    if (encodedByte.length === 1)
      encodedByte = `0${encodedByte}`;
    SHORT_TO_HEX[i2] = encodedByte, HEX_TO_SHORT[encodedByte] = i2;
  }
  function fromHex(encoded) {
    if (encoded.length % 2 !== 0)
      throw Error("Hex encoded strings must have an even number length");
    let out = new Uint8Array(encoded.length / 2);
    for (let i2 = 0;i2 < encoded.length; i2 += 2) {
      let encodedByte = encoded.slice(i2, i2 + 2).toLowerCase();
      if (encodedByte in HEX_TO_SHORT)
        out[i2 / 2] = HEX_TO_SHORT[encodedByte];
      else
        throw Error(`Cannot decode unrecognized sequence ${encodedByte} as hexadecimal`);
    }
    return out;
  }
  function toHex(bytes) {
    let out = "";
    for (let i2 = 0;i2 < bytes.byteLength; i2++)
      out += SHORT_TO_HEX[bytes[i2]];
    return out;
  }
  exports.fromHex = fromHex;
  exports.toHex = toHex;
});
