// var: require_dist_cjs41
var require_dist_cjs41 = __commonJS((exports) => {
  var utilHexEncoding = require_dist_cjs38(), utilUtf8 = require_dist_cjs17(), isArrayBuffer3 = require_dist_cjs39(), protocolHttp = require_dist_cjs36(), utilMiddleware = require_dist_cjs30(), utilUriEscape = require_dist_cjs40(), ALGORITHM_QUERY_PARAM = "X-Amz-Algorithm", CREDENTIAL_QUERY_PARAM = "X-Amz-Credential", AMZ_DATE_QUERY_PARAM = "X-Amz-Date", SIGNED_HEADERS_QUERY_PARAM = "X-Amz-SignedHeaders", EXPIRES_QUERY_PARAM = "X-Amz-Expires", SIGNATURE_QUERY_PARAM = "X-Amz-Signature", TOKEN_QUERY_PARAM = "X-Amz-Security-Token", REGION_SET_PARAM = "X-Amz-Region-Set", AUTH_HEADER = "authorization", AMZ_DATE_HEADER = AMZ_DATE_QUERY_PARAM.toLowerCase(), DATE_HEADER = "date", GENERATED_HEADERS = [AUTH_HEADER, AMZ_DATE_HEADER, DATE_HEADER], SIGNATURE_HEADER = SIGNATURE_QUERY_PARAM.toLowerCase(), SHA256_HEADER = "x-amz-content-sha256", TOKEN_HEADER = TOKEN_QUERY_PARAM.toLowerCase(), HOST_HEADER = "host", ALWAYS_UNSIGNABLE_HEADERS = {
    authorization: !0,
    "cache-control": !0,
    connection: !0,
    expect: !0,
    from: !0,
    "keep-alive": !0,
    "max-forwards": !0,
    pragma: !0,
    referer: !0,
    te: !0,
    trailer: !0,
    "transfer-encoding": !0,
    upgrade: !0,
    "user-agent": !0,
    "x-amzn-trace-id": !0
  }, PROXY_HEADER_PATTERN = /^proxy-/, SEC_HEADER_PATTERN = /^sec-/, UNSIGNABLE_PATTERNS = [/^proxy-/i, /^sec-/i], ALGORITHM_IDENTIFIER = "AWS4-HMAC-SHA256", ALGORITHM_IDENTIFIER_V4A = "AWS4-ECDSA-P256-SHA256", EVENT_ALGORITHM_IDENTIFIER = "AWS4-HMAC-SHA256-PAYLOAD", UNSIGNED_PAYLOAD = "UNSIGNED-PAYLOAD", MAX_CACHE_SIZE = 50, KEY_TYPE_IDENTIFIER = "aws4_request", MAX_PRESIGNED_TTL = 604800, signingKeyCache = {}, cacheQueue = [], createScope = (shortDate, region, service) => `${shortDate}/${region}/${service}/${KEY_TYPE_IDENTIFIER}`, getSigningKey = async (sha256Constructor, credentials, shortDate, region, service) => {
    let credsHash = await hmac(sha256Constructor, credentials.secretAccessKey, credentials.accessKeyId), cacheKey = `${shortDate}:${region}:${service}:${utilHexEncoding.toHex(credsHash)}:${credentials.sessionToken}`;
    if (cacheKey in signingKeyCache)
      return signingKeyCache[cacheKey];
    cacheQueue.push(cacheKey);
    while (cacheQueue.length > MAX_CACHE_SIZE)
      delete signingKeyCache[cacheQueue.shift()];
    let key = `AWS4${credentials.secretAccessKey}`;
    for (let signable of [shortDate, region, service, KEY_TYPE_IDENTIFIER])
      key = await hmac(sha256Constructor, key, signable);
    return signingKeyCache[cacheKey] = key;
  }, clearCredentialCache = () => {
    cacheQueue.length = 0, Object.keys(signingKeyCache).forEach((cacheKey) => {
      delete signingKeyCache[cacheKey];
    });
  }, hmac = (ctor, secret, data) => {
    let hash = new ctor(secret);
    return hash.update(utilUtf8.toUint8Array(data)), hash.digest();
  }, getCanonicalHeaders = ({ headers }, unsignableHeaders, signableHeaders) => {
    let canonical = {};
    for (let headerName of Object.keys(headers).sort()) {
      if (headers[headerName] == null)
        continue;
      let canonicalHeaderName = headerName.toLowerCase();
      if (canonicalHeaderName in ALWAYS_UNSIGNABLE_HEADERS || unsignableHeaders?.has(canonicalHeaderName) || PROXY_HEADER_PATTERN.test(canonicalHeaderName) || SEC_HEADER_PATTERN.test(canonicalHeaderName)) {
        if (!signableHeaders || signableHeaders && !signableHeaders.has(canonicalHeaderName))
          continue;
      }
      canonical[canonicalHeaderName] = headers[headerName].trim().replace(/\s+/g, " ");
    }
    return canonical;
  }, getPayloadHash = async ({ headers, body }, hashConstructor) => {
    for (let headerName of Object.keys(headers))
      if (headerName.toLowerCase() === SHA256_HEADER)
        return headers[headerName];
    if (body == null)
      return "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";
    else if (typeof body === "string" || ArrayBuffer.isView(body) || isArrayBuffer3.isArrayBuffer(body)) {
      let hashCtor = new hashConstructor;
      return hashCtor.update(utilUtf8.toUint8Array(body)), utilHexEncoding.toHex(await hashCtor.digest());
    }
    return UNSIGNED_PAYLOAD;
  };

  class HeaderFormatter {
    format(headers) {
      let chunks = [];
      for (let headerName of Object.keys(headers)) {
        let bytes = utilUtf8.fromUtf8(headerName);
        chunks.push(Uint8Array.from([bytes.byteLength]), bytes, this.formatHeaderValue(headers[headerName]));
      }
      let out = new Uint8Array(chunks.reduce((carry, bytes) => carry + bytes.byteLength, 0)), position = 0;
      for (let chunk of chunks)
        out.set(chunk, position), position += chunk.byteLength;
      return out;
    }
    formatHeaderValue(header) {
      switch (header.type) {
        case "boolean":
          return Uint8Array.from([header.value ? 0 : 1]);
        case "byte":
          return Uint8Array.from([2, header.value]);
        case "short":
          let shortView = new DataView(new ArrayBuffer(3));
          return shortView.setUint8(0, 3), shortView.setInt16(1, header.value, !1), new Uint8Array(shortView.buffer);
        case "integer":
          let intView = new DataView(new ArrayBuffer(5));
          return intView.setUint8(0, 4), intView.setInt32(1, header.value, !1), new Uint8Array(intView.buffer);
        case "long":
          let longBytes = new Uint8Array(9);
          return longBytes[0] = 5, longBytes.set(header.value.bytes, 1), longBytes;
        case "binary":
          let binView = new DataView(new ArrayBuffer(3 + header.value.byteLength));
          binView.setUint8(0, 6), binView.setUint16(1, header.value.byteLength, !1);
          let binBytes = new Uint8Array(binView.buffer);
          return binBytes.set(header.value, 3), binBytes;
        case "string":
          let utf8Bytes = utilUtf8.fromUtf8(header.value), strView = new DataView(new ArrayBuffer(3 + utf8Bytes.byteLength));
          strView.setUint8(0, 7), strView.setUint16(1, utf8Bytes.byteLength, !1);
          let strBytes = new Uint8Array(strView.buffer);
          return strBytes.set(utf8Bytes, 3), strBytes;
        case "timestamp":
          let tsBytes = new Uint8Array(9);
          return tsBytes[0] = 8, tsBytes.set(Int64.fromNumber(header.value.valueOf()).bytes, 1), tsBytes;
        case "uuid":
          if (!UUID_PATTERN.test(header.value))
            throw Error(`Invalid UUID received: ${header.value}`);
          let uuidBytes = new Uint8Array(17);
          return uuidBytes[0] = 9, uuidBytes.set(utilHexEncoding.fromHex(header.value.replace(/\-/g, "")), 1), uuidBytes;
      }
    }
  }
  var HEADER_VALUE_TYPE;
  (function(HEADER_VALUE_TYPE2) {
    HEADER_VALUE_TYPE2[HEADER_VALUE_TYPE2.boolTrue = 0] = "boolTrue", HEADER_VALUE_TYPE2[HEADER_VALUE_TYPE2.boolFalse = 1] = "boolFalse", HEADER_VALUE_TYPE2[HEADER_VALUE_TYPE2.byte = 2] = "byte", HEADER_VALUE_TYPE2[HEADER_VALUE_TYPE2.short = 3] = "short", HEADER_VALUE_TYPE2[HEADER_VALUE_TYPE2.integer = 4] = "integer", HEADER_VALUE_TYPE2[HEADER_VALUE_TYPE2.long = 5] = "long", HEADER_VALUE_TYPE2[HEADER_VALUE_TYPE2.byteArray = 6] = "byteArray", HEADER_VALUE_TYPE2[HEADER_VALUE_TYPE2.string = 7] = "string", HEADER_VALUE_TYPE2[HEADER_VALUE_TYPE2.timestamp = 8] = "timestamp", HEADER_VALUE_TYPE2[HEADER_VALUE_TYPE2.uuid = 9] = "uuid";
  })(HEADER_VALUE_TYPE || (HEADER_VALUE_TYPE = {}));
  var UUID_PATTERN = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/;

  class Int64 {
    bytes;
    constructor(bytes) {
      if (this.bytes = bytes, bytes.byteLength !== 8)
        throw Error("Int64 buffers must be exactly 8 bytes");
    }
    static fromNumber(number4) {
      if (number4 > 9223372036854776000 || number4 < -9223372036854776000)
        throw Error(`${number4} is too large (or, if negative, too small) to represent as an Int64`);
      let bytes = new Uint8Array(8);
      for (let i2 = 7, remaining = Math.abs(Math.round(number4));i2 > -1 && remaining > 0; i2--, remaining /= 256)
        bytes[i2] = remaining;
      if (number4 < 0)
        negate(bytes);
      return new Int64(bytes);
    }
    valueOf() {
      let bytes = this.bytes.slice(0), negative = bytes[0] & 128;
      if (negative)
        negate(bytes);
      return parseInt(utilHexEncoding.toHex(bytes), 16) * (negative ? -1 : 1);
    }
    toString() {
      return String(this.valueOf());
    }
  }
  function negate(bytes) {
    for (let i2 = 0;i2 < 8; i2++)
      bytes[i2] ^= 255;
    for (let i2 = 7;i2 > -1; i2--)
      if (bytes[i2]++, bytes[i2] !== 0)
        break;
  }
  var hasHeader = (soughtHeader, headers) => {
    soughtHeader = soughtHeader.toLowerCase();
    for (let headerName of Object.keys(headers))
      if (soughtHeader === headerName.toLowerCase())
        return !0;
    return !1;
  }, moveHeadersToQuery = (request2, options = {}) => {
    let { headers, query = {} } = protocolHttp.HttpRequest.clone(request2);
    for (let name of Object.keys(headers)) {
      let lname = name.toLowerCase();
      if (lname.slice(0, 6) === "x-amz-" && !options.unhoistableHeaders?.has(lname) || options.hoistableHeaders?.has(lname))
        query[name] = headers[name], delete headers[name];
    }
    return {
      ...request2,
      headers,
      query
    };
  }, prepareRequest = (request2) => {
    request2 = protocolHttp.HttpRequest.clone(request2);
    for (let headerName of Object.keys(request2.headers))
      if (GENERATED_HEADERS.indexOf(headerName.toLowerCase()) > -1)
        delete request2.headers[headerName];
    return request2;
  }, getCanonicalQuery = ({ query = {} }) => {
    let keys2 = [], serialized = {};
    for (let key of Object.keys(query)) {
      if (key.toLowerCase() === SIGNATURE_HEADER)
        continue;
      let encodedKey = utilUriEscape.escapeUri(key);
      keys2.push(encodedKey);
      let value = query[key];
      if (typeof value === "string")
        serialized[encodedKey] = `${encodedKey}=${utilUriEscape.escapeUri(value)}`;
      else if (Array.isArray(value))
        serialized[encodedKey] = value.slice(0).reduce((encoded, value2) => encoded.concat([`${encodedKey}=${utilUriEscape.escapeUri(value2)}`]), []).sort().join("&");
    }
    return keys2.sort().map((key) => serialized[key]).filter((serialized2) => serialized2).join("&");
  }, iso8601 = (time3) => toDate(time3).toISOString().replace(/\.\d{3}Z$/, "Z"), toDate = (time3) => {
    if (typeof time3 === "number")
      return new Date(time3 * 1000);
    if (typeof time3 === "string") {
      if (Number(time3))
        return new Date(Number(time3) * 1000);
      return new Date(time3);
    }
    return time3;
  };

  class SignatureV4Base {
    service;
    regionProvider;
    credentialProvider;
    sha256;
    uriEscapePath;
    applyChecksum;
    constructor({ applyChecksum, credentials, region, service, sha256, uriEscapePath = !0 }) {
      this.service = service, this.sha256 = sha256, this.uriEscapePath = uriEscapePath, this.applyChecksum = typeof applyChecksum === "boolean" ? applyChecksum : !0, this.regionProvider = utilMiddleware.normalizeProvider(region), this.credentialProvider = utilMiddleware.normalizeProvider(credentials);
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
    async createStringToSign(longDate, credentialScope, canonicalRequest, algorithmIdentifier) {
      let hash = new this.sha256;
      hash.update(utilUtf8.toUint8Array(canonicalRequest));
      let hashedRequest = await hash.digest();
      return `${algorithmIdentifier}
${longDate}
${credentialScope}
${utilHexEncoding.toHex(hashedRequest)}`;
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
        return utilUriEscape.escapeUri(normalizedPath).replace(/%2F/g, "/");
      }
      return path9;
    }
    validateResolvedCredentials(credentials) {
      if (typeof credentials !== "object" || typeof credentials.accessKeyId !== "string" || typeof credentials.secretAccessKey !== "string")
        throw Error("Resolved credential object is not valid");
    }
    formatDate(now) {
      let longDate = iso8601(now).replace(/[\-:]/g, "");
      return {
        longDate,
        shortDate: longDate.slice(0, 8)
      };
    }
    getCanonicalHeaderList(headers) {
      return Object.keys(headers).sort().join(";");
    }
  }

  class SignatureV4 extends SignatureV4Base {
    headerFormatter = new HeaderFormatter;
    constructor({ applyChecksum, credentials, region, service, sha256, uriEscapePath = !0 }) {
      super({
        applyChecksum,
        credentials,
        region,
        service,
        sha256,
        uriEscapePath
      });
    }
    async presign(originalRequest, options = {}) {
      let { signingDate = /* @__PURE__ */ new Date, expiresIn = 3600, unsignableHeaders, unhoistableHeaders, signableHeaders, hoistableHeaders, signingRegion, signingService } = options, credentials = await this.credentialProvider();
      this.validateResolvedCredentials(credentials);
      let region = signingRegion ?? await this.regionProvider(), { longDate, shortDate } = this.formatDate(signingDate);
      if (expiresIn > MAX_PRESIGNED_TTL)
        return Promise.reject("Signature version 4 presigned URLs must have an expiration date less than one week in the future");
      let scope = createScope(shortDate, region, signingService ?? this.service), request2 = moveHeadersToQuery(prepareRequest(originalRequest), { unhoistableHeaders, hoistableHeaders });
      if (credentials.sessionToken)
        request2.query[TOKEN_QUERY_PARAM] = credentials.sessionToken;
      request2.query[ALGORITHM_QUERY_PARAM] = ALGORITHM_IDENTIFIER, request2.query[CREDENTIAL_QUERY_PARAM] = `${credentials.accessKeyId}/${scope}`, request2.query[AMZ_DATE_QUERY_PARAM] = longDate, request2.query[EXPIRES_QUERY_PARAM] = expiresIn.toString(10);
      let canonicalHeaders = getCanonicalHeaders(request2, unsignableHeaders, signableHeaders);
      return request2.query[SIGNED_HEADERS_QUERY_PARAM] = this.getCanonicalHeaderList(canonicalHeaders), request2.query[SIGNATURE_QUERY_PARAM] = await this.getSignature(longDate, scope, this.getSigningKey(credentials, region, shortDate, signingService), this.createCanonicalRequest(request2, canonicalHeaders, await getPayloadHash(originalRequest, this.sha256))), request2;
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
      let region = signingRegion ?? await this.regionProvider(), { shortDate, longDate } = this.formatDate(signingDate), scope = createScope(shortDate, region, signingService ?? this.service), hashedPayload = await getPayloadHash({ headers: {}, body: payload }, this.sha256), hash = new this.sha256;
      hash.update(headers);
      let hashedHeaders = utilHexEncoding.toHex(await hash.digest()), stringToSign = [
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
      }).then((signature2) => {
        return { message: signableMessage.message, signature: signature2 };
      });
    }
    async signString(stringToSign, { signingDate = /* @__PURE__ */ new Date, signingRegion, signingService } = {}) {
      let credentials = await this.credentialProvider();
      this.validateResolvedCredentials(credentials);
      let region = signingRegion ?? await this.regionProvider(), { shortDate } = this.formatDate(signingDate), hash = new this.sha256(await this.getSigningKey(credentials, region, shortDate, signingService));
      return hash.update(utilUtf8.toUint8Array(stringToSign)), utilHexEncoding.toHex(await hash.digest());
    }
    async signRequest(requestToSign, { signingDate = /* @__PURE__ */ new Date, signableHeaders, unsignableHeaders, signingRegion, signingService } = {}) {
      let credentials = await this.credentialProvider();
      this.validateResolvedCredentials(credentials);
      let region = signingRegion ?? await this.regionProvider(), request2 = prepareRequest(requestToSign), { longDate, shortDate } = this.formatDate(signingDate), scope = createScope(shortDate, region, signingService ?? this.service);
      if (request2.headers[AMZ_DATE_HEADER] = longDate, credentials.sessionToken)
        request2.headers[TOKEN_HEADER] = credentials.sessionToken;
      let payloadHash = await getPayloadHash(request2, this.sha256);
      if (!hasHeader(SHA256_HEADER, request2.headers) && this.applyChecksum)
        request2.headers[SHA256_HEADER] = payloadHash;
      let canonicalHeaders = getCanonicalHeaders(request2, unsignableHeaders, signableHeaders), signature2 = await this.getSignature(longDate, scope, this.getSigningKey(credentials, region, shortDate, signingService), this.createCanonicalRequest(request2, canonicalHeaders, payloadHash));
      return request2.headers[AUTH_HEADER] = `${ALGORITHM_IDENTIFIER} Credential=${credentials.accessKeyId}/${scope}, SignedHeaders=${this.getCanonicalHeaderList(canonicalHeaders)}, Signature=${signature2}`, request2;
    }
    async getSignature(longDate, credentialScope, keyPromise, canonicalRequest) {
      let stringToSign = await this.createStringToSign(longDate, credentialScope, canonicalRequest, ALGORITHM_IDENTIFIER), hash = new this.sha256(await keyPromise);
      return hash.update(utilUtf8.toUint8Array(stringToSign)), utilHexEncoding.toHex(await hash.digest());
    }
    getSigningKey(credentials, region, shortDate, service) {
      return getSigningKey(this.sha256, credentials, shortDate, region, service || this.service);
    }
  }
  var signatureV4aContainer = {
    SignatureV4a: null
  };
  exports.ALGORITHM_IDENTIFIER = ALGORITHM_IDENTIFIER;
  exports.ALGORITHM_IDENTIFIER_V4A = ALGORITHM_IDENTIFIER_V4A;
  exports.ALGORITHM_QUERY_PARAM = ALGORITHM_QUERY_PARAM;
  exports.ALWAYS_UNSIGNABLE_HEADERS = ALWAYS_UNSIGNABLE_HEADERS;
  exports.AMZ_DATE_HEADER = AMZ_DATE_HEADER;
  exports.AMZ_DATE_QUERY_PARAM = AMZ_DATE_QUERY_PARAM;
  exports.AUTH_HEADER = AUTH_HEADER;
  exports.CREDENTIAL_QUERY_PARAM = CREDENTIAL_QUERY_PARAM;
  exports.DATE_HEADER = DATE_HEADER;
  exports.EVENT_ALGORITHM_IDENTIFIER = EVENT_ALGORITHM_IDENTIFIER;
  exports.EXPIRES_QUERY_PARAM = EXPIRES_QUERY_PARAM;
  exports.GENERATED_HEADERS = GENERATED_HEADERS;
  exports.HOST_HEADER = HOST_HEADER;
  exports.KEY_TYPE_IDENTIFIER = KEY_TYPE_IDENTIFIER;
  exports.MAX_CACHE_SIZE = MAX_CACHE_SIZE;
  exports.MAX_PRESIGNED_TTL = MAX_PRESIGNED_TTL;
  exports.PROXY_HEADER_PATTERN = PROXY_HEADER_PATTERN;
  exports.REGION_SET_PARAM = REGION_SET_PARAM;
  exports.SEC_HEADER_PATTERN = SEC_HEADER_PATTERN;
  exports.SHA256_HEADER = SHA256_HEADER;
  exports.SIGNATURE_HEADER = SIGNATURE_HEADER;
  exports.SIGNATURE_QUERY_PARAM = SIGNATURE_QUERY_PARAM;
  exports.SIGNED_HEADERS_QUERY_PARAM = SIGNED_HEADERS_QUERY_PARAM;
  exports.SignatureV4 = SignatureV4;
  exports.SignatureV4Base = SignatureV4Base;
  exports.TOKEN_HEADER = TOKEN_HEADER;
  exports.TOKEN_QUERY_PARAM = TOKEN_QUERY_PARAM;
  exports.UNSIGNABLE_PATTERNS = UNSIGNABLE_PATTERNS;
  exports.UNSIGNED_PAYLOAD = UNSIGNED_PAYLOAD;
  exports.clearCredentialCache = clearCredentialCache;
  exports.createScope = createScope;
  exports.getCanonicalHeaders = getCanonicalHeaders;
  exports.getCanonicalQuery = getCanonicalQuery;
  exports.getPayloadHash = getPayloadHash;
  exports.getSigningKey = getSigningKey;
  exports.hasHeader = hasHeader;
  exports.moveHeadersToQuery = moveHeadersToQuery;
  exports.prepareRequest = prepareRequest;
  exports.signatureV4aContainer = signatureV4aContainer;
});
