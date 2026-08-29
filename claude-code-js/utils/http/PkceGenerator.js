// class: PkceGenerator
class PkceGenerator {
  constructor() {
    this.hashUtils = new HashUtils;
  }
  async generatePkceCodes() {
    let verifier = this.generateCodeVerifier(), challenge = this.generateCodeChallengeFromVerifier(verifier);
    return { verifier, challenge };
  }
  generateCodeVerifier() {
    let charArr = [], maxNumber = 256 - 256 % CharSet.CV_CHARSET.length;
    while (charArr.length <= RANDOM_OCTET_SIZE) {
      let byte = crypto10.randomBytes(1)[0];
      if (byte >= maxNumber)
        continue;
      let index = byte % CharSet.CV_CHARSET.length;
      charArr.push(CharSet.CV_CHARSET[index]);
    }
    let verifier = charArr.join("");
    return EncodingUtils.base64EncodeUrl(verifier);
  }
  generateCodeChallengeFromVerifier(codeVerifier) {
    return EncodingUtils.base64EncodeUrl(this.hashUtils.sha256(codeVerifier).toString(exports_Constants.EncodingTypes.BASE64), exports_Constants.EncodingTypes.BASE64);
  }
}
