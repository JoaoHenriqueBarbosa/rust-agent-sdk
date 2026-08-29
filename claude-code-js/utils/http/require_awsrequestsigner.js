// var: require_awsrequestsigner
var require_awsrequestsigner = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.AwsRequestSigner = void 0;
  var crypto_1 = require_crypto3(), AWS_ALGORITHM = "AWS4-HMAC-SHA256", AWS_REQUEST_TYPE = "aws4_request";

  class AwsRequestSigner {
    constructor(getCredentials2, region) {
      this.getCredentials = getCredentials2, this.region = region, this.crypto = (0, crypto_1.createCrypto)();
    }
    async getRequestOptions(amzOptions) {
      if (!amzOptions.url)
        throw Error('"url" is required in "amzOptions"');
      let requestPayloadData = typeof amzOptions.data === "object" ? JSON.stringify(amzOptions.data) : amzOptions.data, url3 = amzOptions.url, method = amzOptions.method || "GET", requestPayload = amzOptions.body || requestPayloadData, additionalAmzHeaders = amzOptions.headers, awsSecurityCredentials = await this.getCredentials(), uri7 = new URL(url3), headerMap = await generateAuthenticationHeaderMap({
        crypto: this.crypto,
        host: uri7.host,
        canonicalUri: uri7.pathname,
        canonicalQuerystring: uri7.search.substr(1),
        method,
        region: this.region,
        securityCredentials: awsSecurityCredentials,
        requestPayload,
        additionalAmzHeaders
      }), headers = Object.assign(headerMap.amzDate ? { "x-amz-date": headerMap.amzDate } : {}, {
        Authorization: headerMap.authorizationHeader,
        host: uri7.host
      }, additionalAmzHeaders || {});
      if (awsSecurityCredentials.token)
        Object.assign(headers, {
          "x-amz-security-token": awsSecurityCredentials.token
        });
      let awsSignedReq = {
        url: url3,
        method,
        headers
      };
      if (typeof requestPayload < "u")
        awsSignedReq.body = requestPayload;
      return awsSignedReq;
    }
  }
  exports.AwsRequestSigner = AwsRequestSigner;
  async function sign2(crypto11, key, msg) {
    return await crypto11.signWithHmacSha256(key, msg);
  }
  async function getSigningKey2(crypto11, key, dateStamp, region, serviceName) {
    let kDate = await sign2(crypto11, `AWS4${key}`, dateStamp), kRegion = await sign2(crypto11, kDate, region), kService = await sign2(crypto11, kRegion, serviceName);
    return await sign2(crypto11, kService, "aws4_request");
  }
  async function generateAuthenticationHeaderMap(options) {
    let additionalAmzHeaders = options.additionalAmzHeaders || {}, requestPayload = options.requestPayload || "", serviceName = options.host.split(".")[0], now = /* @__PURE__ */ new Date, amzDate = now.toISOString().replace(/[-:]/g, "").replace(/\.[0-9]+/, ""), dateStamp = now.toISOString().replace(/[-]/g, "").replace(/T.*/, ""), reformattedAdditionalAmzHeaders = {};
    if (Object.keys(additionalAmzHeaders).forEach((key) => {
      reformattedAdditionalAmzHeaders[key.toLowerCase()] = additionalAmzHeaders[key];
    }), options.securityCredentials.token)
      reformattedAdditionalAmzHeaders["x-amz-security-token"] = options.securityCredentials.token;
    let amzHeaders = Object.assign({
      host: options.host
    }, reformattedAdditionalAmzHeaders.date ? {} : { "x-amz-date": amzDate }, reformattedAdditionalAmzHeaders), canonicalHeaders = "", signedHeadersList = Object.keys(amzHeaders).sort();
    signedHeadersList.forEach((key) => {
      canonicalHeaders += `${key}:${amzHeaders[key]}
`;
    });
    let signedHeaders = signedHeadersList.join(";"), payloadHash = await options.crypto.sha256DigestHex(requestPayload), canonicalRequest = `${options.method}
${options.canonicalUri}
${options.canonicalQuerystring}
${canonicalHeaders}
${signedHeaders}
${payloadHash}`, credentialScope = `${dateStamp}/${options.region}/${serviceName}/${AWS_REQUEST_TYPE}`, stringToSign = `${AWS_ALGORITHM}
${amzDate}
${credentialScope}
` + await options.crypto.sha256DigestHex(canonicalRequest), signingKey = await getSigningKey2(options.crypto, options.securityCredentials.secretAccessKey, dateStamp, options.region, serviceName), signature7 = await sign2(options.crypto, signingKey, stringToSign), authorizationHeader = `${AWS_ALGORITHM} Credential=${options.securityCredentials.accessKeyId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${(0, crypto_1.fromArrayBufferToHex)(signature7)}`;
    return {
      amzDate: reformattedAdditionalAmzHeaders.date ? void 0 : amzDate,
      authorizationHeader,
      canonicalQuerystring: options.canonicalQuerystring
    };
  }
});
