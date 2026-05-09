// class: CryptoProvider
class CryptoProvider {
  constructor() {
    this.pkceGenerator = new PkceGenerator, this.guidGenerator = new GuidGenerator, this.hashUtils = new HashUtils;
  }
  base64UrlEncode() {
    throw Error("Method not implemented.");
  }
  encodeKid() {
    throw Error("Method not implemented.");
  }
  createNewGuid() {
    return this.guidGenerator.generateGuid();
  }
  base64Encode(input) {
    return EncodingUtils.base64Encode(input);
  }
  base64Decode(input) {
    return EncodingUtils.base64Decode(input);
  }
  generatePkceCodes() {
    return this.pkceGenerator.generatePkceCodes();
  }
  getPublicKeyThumbprint() {
    throw Error("Method not implemented.");
  }
  removeTokenBindingKey() {
    throw Error("Method not implemented.");
  }
  clearKeystore() {
    throw Error("Method not implemented.");
  }
  signJwt() {
    throw Error("Method not implemented.");
  }
  async hashString(plainText) {
    return EncodingUtils.base64EncodeUrl(this.hashUtils.sha256(plainText).toString(exports_Constants.EncodingTypes.BASE64), exports_Constants.EncodingTypes.BASE64);
  }
}
