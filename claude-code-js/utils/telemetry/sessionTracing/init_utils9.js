// var: init_utils9
var init_utils9 = __esm(() => {
  import_core59 = __toESM(require_src9(), 1);
  encodeTimestamp = typeof BigInt < "u" ? encodeAsString : import_core59.hrTimeToNanoseconds;
  JSON_ENCODER = {
    encodeHrTime: encodeTimestamp,
    encodeSpanContext: identity16,
    encodeOptionalSpanContext: identity16,
    encodeUint8Array: (bytes) => {
      if (typeof Buffer < "u")
        return Buffer.from(bytes).toString("base64");
      let chars = Array(bytes.length);
      for (let i5 = 0;i5 < bytes.length; i5++)
        chars[i5] = String.fromCharCode(bytes[i5]);
      return btoa(chars.join(""));
    }
  };
});
