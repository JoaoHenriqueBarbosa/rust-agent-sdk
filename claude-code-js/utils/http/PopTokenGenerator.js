// class: PopTokenGenerator
class PopTokenGenerator {
  constructor(cryptoUtils, performanceClient) {
    this.cryptoUtils = cryptoUtils, this.performanceClient = performanceClient;
  }
  async generateCnf(request2, logger10) {
    let reqCnf = await invokeAsync(this.generateKid.bind(this), PopTokenGenerateCnf, logger10, this.performanceClient, request2.correlationId)(request2), reqCnfString = this.cryptoUtils.base64UrlEncode(JSON.stringify(reqCnf));
    return {
      kid: reqCnf.kid,
      reqCnfString
    };
  }
  async generateKid(request2) {
    return {
      kid: await this.cryptoUtils.getPublicKeyThumbprint(request2),
      xms_ksl: KeyLocation.SW
    };
  }
  async signPopToken(accessToken, keyId, request2) {
    return this.signPayload(accessToken, keyId, request2);
  }
  async signPayload(payload, keyId, request2, claims) {
    let { resourceRequestMethod, resourceRequestUri, shrClaims, shrNonce, shrOptions } = request2, resourceUrlComponents = (resourceRequestUri ? new UrlString(resourceRequestUri) : void 0)?.getUrlComponents();
    return this.cryptoUtils.signJwt({
      at: payload,
      ts: nowSeconds(),
      m: resourceRequestMethod?.toUpperCase(),
      u: resourceUrlComponents?.HostNameAndPort,
      nonce: shrNonce || this.cryptoUtils.createNewGuid(),
      p: resourceUrlComponents?.AbsolutePath,
      q: resourceUrlComponents?.QueryString ? [[], resourceUrlComponents.QueryString] : void 0,
      client_claims: shrClaims || void 0,
      ...claims
    }, keyId, shrOptions, request2.correlationId);
  }
}
