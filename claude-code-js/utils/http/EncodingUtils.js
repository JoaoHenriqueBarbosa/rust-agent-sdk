// class: EncodingUtils
class EncodingUtils {
  static base64Encode(str, encoding) {
    return Buffer.from(str, encoding).toString(exports_Constants.EncodingTypes.BASE64);
  }
  static base64EncodeUrl(str, encoding) {
    return EncodingUtils.base64Encode(str, encoding).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
  }
  static base64Decode(base64Str) {
    return Buffer.from(base64Str, exports_Constants.EncodingTypes.BASE64).toString("utf8");
  }
  static base64DecodeUrl(base64Str) {
    let str = base64Str.replace(/-/g, "+").replace(/_/g, "/");
    while (str.length % 4)
      str += "=";
    return EncodingUtils.base64Decode(str);
  }
}
