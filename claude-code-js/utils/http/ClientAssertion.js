// class: ClientAssertion
class ClientAssertion {
  static fromAssertion(assertion) {
    let clientAssertion = new ClientAssertion;
    return clientAssertion.jwt = assertion, clientAssertion;
  }
  static fromCertificate(thumbprint, privateKey, publicCertificate) {
    let clientAssertion = new ClientAssertion;
    if (clientAssertion.privateKey = privateKey, clientAssertion.thumbprint = thumbprint, clientAssertion.useSha256 = !1, publicCertificate)
      clientAssertion.publicCertificate = this.parseCertificate(publicCertificate);
    return clientAssertion;
  }
  static fromCertificateWithSha256Thumbprint(thumbprint, privateKey, publicCertificate) {
    let clientAssertion = new ClientAssertion;
    if (clientAssertion.privateKey = privateKey, clientAssertion.thumbprint = thumbprint, clientAssertion.useSha256 = !0, publicCertificate)
      clientAssertion.publicCertificate = this.parseCertificate(publicCertificate);
    return clientAssertion;
  }
  getJwt(cryptoProvider, issuer, jwtAudience) {
    if (this.privateKey && this.thumbprint) {
      if (this.jwt && !this.isExpired() && issuer === this.issuer && jwtAudience === this.jwtAudience)
        return this.jwt;
      return this.createJwt(cryptoProvider, issuer, jwtAudience);
    }
    if (this.jwt)
      return this.jwt;
    throw createClientAuthError(invalidAssertion);
  }
  createJwt(cryptoProvider, issuer, jwtAudience) {
    this.issuer = issuer, this.jwtAudience = jwtAudience;
    let issuedAt = exports_TimeUtils.nowSeconds();
    this.expirationTime = issuedAt + 600;
    let header = {
      alg: this.useSha256 ? JwtConstants.PSS_256 : JwtConstants.RSA_256
    }, thumbprintHeader = this.useSha256 ? JwtConstants.X5T_256 : JwtConstants.X5T;
    if (Object.assign(header, {
      [thumbprintHeader]: EncodingUtils.base64EncodeUrl(this.thumbprint, exports_Constants.EncodingTypes.HEX)
    }), this.publicCertificate)
      Object.assign(header, {
        [JwtConstants.X5C]: this.publicCertificate
      });
    let payload = {
      [JwtConstants.AUDIENCE]: this.jwtAudience,
      [JwtConstants.EXPIRATION_TIME]: this.expirationTime,
      [JwtConstants.ISSUER]: this.issuer,
      [JwtConstants.SUBJECT]: this.issuer,
      [JwtConstants.NOT_BEFORE]: issuedAt,
      [JwtConstants.JWT_ID]: cryptoProvider.createNewGuid()
    };
    return this.jwt = import_jsonwebtoken.default.sign(payload, this.privateKey, { header }), this.jwt;
  }
  isExpired() {
    return this.expirationTime < exports_TimeUtils.nowSeconds();
  }
  static parseCertificate(publicCertificate) {
    let regexToFindCerts = /-----BEGIN CERTIFICATE-----\r*\n(.+?)\r*\n-----END CERTIFICATE-----/gs, certs = [], matches;
    while ((matches = regexToFindCerts.exec(publicCertificate)) !== null)
      certs.push(matches[1].replace(/\r*\n/g, ""));
    return certs;
  }
}
