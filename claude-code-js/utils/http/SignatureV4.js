// class: SignatureV4
class SignatureV4 {
  constructor({ applyChecksum, credentials, region, service, sha256, uriEscapePath = !0 }) {
    this.headerFormatter = new HeaderFormatter, this.service = service, this.sha256 = sha256, this.uriEscapePath = uriEscapePath, this.applyChecksum = typeof applyChecksum === "boolean" ? applyChecksum : !0, this.regionProvider = normalizeProvider5(region), this.credentialProvider = normalizeProvider5(credentials);
  }
  async presign(originalRequest, options = {}) {
    let { signingDate = /* @__PURE__ */ new Date, expiresIn = 3600, unsignableHeaders, unhoistableHeaders, signableHeaders, signingRegion, signingService } = options, credentials = await this.credentialProvider();
    this.validateResolvedCredentials(credentials);
    let region = signingRegion ?? await this.regionProvider(), { longDate, shortDate } = formatDate(signingDate);
    if (expiresIn > MAX_PRESIGNED_TTL)
      return Promise.reject("Signature version 4 presigned URLs must have an expiration date less than one week in the future");
    let scope = createScope(shortDate, region, signingService ?? this.service), request2 = moveHeadersToQuery(prepareRequest(originalRequest), { unhoistableHeaders });
    if (credentials.sessionToken)
      request2.query[TOKEN_QUERY_PARAM] = credentials.sessionToken;
    request2.query[ALGORITHM_QUERY_PARAM] = ALGORITHM_IDENTIFIER, request2.query[CREDENTIAL_QUERY_PARAM] = `${credentials.accessKeyId}/${scope}`, request2.query[AMZ_DATE_QUERY_PARAM] = longDate, request2.query[EXPIRES_QUERY_PARAM] = expiresIn.toString(10);
    let canonicalHeaders = getCanonicalHeaders(request2, unsignableHeaders, signableHeaders);
    return request2.query[SIGNED_HEADERS_QUERY_PARAM] = getCanonicalHeaderList(canonicalHeaders), request2.query[SIGNATURE_QUERY_PARAM] = await this.getSignature(longDate, scope, this.getSigningKey(credentials, region, shortDate, signingService), this.createCanonicalRequest(request2, canonicalHeaders, await getPayloadHash(originalRequest, this.sha256))), request2;
  }
  async sign(toSign, options) {
    if (typeof toSign === "string")
      return this.signString(toSign, options);
    else if (toSign.headers && toSign.payload)
      return this.signEvent(toSign, options);
    else if (toSign.message)
      return this.signMessage(toSign, options);
    else
      return this.signRequest(toSign, options);
  }
  async signEvent({ headers, payload }, { signingDate = /* @__PURE__ */ new Date, priorSignature, signingRegion, signingService }) {
    let region = signingRegion ?? await this.regionProvider(), { shortDate, longDate } = formatDate(signingDate), scope = createScope(shortDate, region, signingService ?? this.service), hashedPayload = await getPayloadHash({ headers: {}, body: payload }, this.sha256), hash = new this.sha256;
    hash.update(headers);
    let hashedHeaders = toHex2(await hash.digest()), stringToSign = [
      EVENT_ALGORITHM_IDENTIFIER,
      longDate,
      scope,
      priorSignature,
      hashedHeaders,
      hashedPayload
    ].join(`
`);
    return this.signString(stringToSign, { signingDate, signingRegion: region, signingService });
  }
  async signMessage(signableMessage, { signingDate = /* @__PURE__ */ new Date, signingRegion, signingService }) {
    return this.signEvent({
      headers: this.headerFormatter.format(signableMessage.message.headers),
      payload: signableMessage.message.body
    }, {
      signingDate,
      signingRegion,
      signingService,
      priorSignature: signableMessage.priorSignature
    }).then((signature7) => {
      return { message: signableMessage.message, signature: signature7 };
    });
  }
  async signString(stringToSign, { signingDate = /* @__PURE__ */ new Date, signingRegion, signingService } = {}) {
    let credentials = await this.credentialProvider();
    this.validateResolvedCredentials(credentials);
    let region = signingRegion ?? await this.regionProvider(), { shortDate } = formatDate(signingDate), hash = new this.sha256(await this.getSigningKey(credentials, region, shortDate, signingService));
    return hash.update(toUint8Array2(stringToSign)), toHex2(await hash.digest());
  }
  async signRequest(requestToSign, { signingDate = /* @__PURE__ */ new Date, signableHeaders, unsignableHeaders, signingRegion, signingService } = {}) {
    let credentials = await this.credentialProvider();
    this.validateResolvedCredentials(credentials);
    let region = signingRegion ?? await this.regionProvider(), request2 = prepareRequest(requestToSign), { longDate, shortDate } = formatDate(signingDate), scope = createScope(shortDate, region, signingService ?? this.service);
    if (request2.headers[AMZ_DATE_HEADER] = longDate, credentials.sessionToken)
      request2.headers[TOKEN_HEADER] = credentials.sessionToken;
    let payloadHash = await getPayloadHash(request2, this.sha256);
    if (!hasHeader(SHA256_HEADER, request2.headers) && this.applyChecksum)
      request2.headers[SHA256_HEADER] = payloadHash;
    let canonicalHeaders = getCanonicalHeaders(request2, unsignableHeaders, signableHeaders), signature7 = await this.getSignature(longDate, scope, this.getSigningKey(credentials, region, shortDate, signingService), this.createCanonicalRequest(request2, canonicalHeaders, payloadHash));
    return request2.headers[AUTH_HEADER] = `${ALGORITHM_IDENTIFIER} Credential=${credentials.accessKeyId}/${scope}, SignedHeaders=${getCanonicalHeaderList(canonicalHeaders)}, Signature=${signature7}`, request2;
  }
  createCanonicalRequest(request2, canonicalHeaders, payloadHash) {
    let sortedHeaders = Object.keys(canonicalHeaders).sort();
    return `${request2.method}
${this.getCanonicalPath(request2)}
${getCanonicalQuery(request2)}
${sortedHeaders.map((name) => `${name}:${canonicalHeaders[name]}`).join(`
`)}

${sortedHeaders.join(";")}
${payloadHash}`;
  }
  async createStringToSign(longDate, credentialScope, canonicalRequest) {
    let hash = new this.sha256;
    hash.update(toUint8Array2(canonicalRequest));
    let hashedRequest = await hash.digest();
    return `${ALGORITHM_IDENTIFIER}
${longDate}
${credentialScope}
${toHex2(hashedRequest)}`;
  }
  getCanonicalPath({ path: path9 }) {
    if (this.uriEscapePath) {
      let normalizedPathSegments = [];
      for (let pathSegment of path9.split("/")) {
        if (pathSegment?.length === 0)
          continue;
        if (pathSegment === ".")
          continue;
        if (pathSegment === "..")
          normalizedPathSegments.pop();
        else
          normalizedPathSegments.push(pathSegment);
      }
      let normalizedPath = `${path9?.startsWith("/") ? "/" : ""}${normalizedPathSegments.join("/")}${normalizedPathSegments.length > 0 && path9?.endsWith("/") ? "/" : ""}`;
      return escapeUri(normalizedPath).replace(/%2F/g, "/");
    }
    return path9;
  }
  async getSignature(longDate, credentialScope, keyPromise, canonicalRequest) {
    let stringToSign = await this.createStringToSign(longDate, credentialScope, canonicalRequest), hash = new this.sha256(await keyPromise);
    return hash.update(toUint8Array2(stringToSign)), toHex2(await hash.digest());
  }
  getSigningKey(credentials, region, shortDate, service) {
    return getSigningKey(this.sha256, credentials, shortDate, region, service || this.service);
  }
  validateResolvedCredentials(credentials) {
    if (typeof credentials !== "object" || typeof credentials.accessKeyId !== "string" || typeof credentials.secretAccessKey !== "string")
      throw Error("Resolved credential object is not valid");
  }
}
