// var: require_defaultawssecuritycredentialssupplier
var require_defaultawssecuritycredentialssupplier = __commonJS((exports) => {
  var __classPrivateFieldGet3 = exports && exports.__classPrivateFieldGet || function(receiver, state3, kind, f) {
    if (kind === "a" && !f)
      throw TypeError("Private accessor was defined without a getter");
    if (typeof state3 === "function" ? receiver !== state3 || !f : !state3.has(receiver))
      throw TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state3.get(receiver);
  }, _DefaultAwsSecurityCredentialsSupplier_instances, _DefaultAwsSecurityCredentialsSupplier_getImdsV2SessionToken, _DefaultAwsSecurityCredentialsSupplier_getAwsRoleName, _DefaultAwsSecurityCredentialsSupplier_retrieveAwsSecurityCredentials, _DefaultAwsSecurityCredentialsSupplier_regionFromEnv_get, _DefaultAwsSecurityCredentialsSupplier_securityCredentialsFromEnv_get;
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.DefaultAwsSecurityCredentialsSupplier = void 0;

  class DefaultAwsSecurityCredentialsSupplier {
    constructor(opts) {
      _DefaultAwsSecurityCredentialsSupplier_instances.add(this), this.regionUrl = opts.regionUrl, this.securityCredentialsUrl = opts.securityCredentialsUrl, this.imdsV2SessionTokenUrl = opts.imdsV2SessionTokenUrl, this.additionalGaxiosOptions = opts.additionalGaxiosOptions;
    }
    async getAwsRegion(context3) {
      if (__classPrivateFieldGet3(this, _DefaultAwsSecurityCredentialsSupplier_instances, "a", _DefaultAwsSecurityCredentialsSupplier_regionFromEnv_get))
        return __classPrivateFieldGet3(this, _DefaultAwsSecurityCredentialsSupplier_instances, "a", _DefaultAwsSecurityCredentialsSupplier_regionFromEnv_get);
      let metadataHeaders = {};
      if (!__classPrivateFieldGet3(this, _DefaultAwsSecurityCredentialsSupplier_instances, "a", _DefaultAwsSecurityCredentialsSupplier_regionFromEnv_get) && this.imdsV2SessionTokenUrl)
        metadataHeaders["x-aws-ec2-metadata-token"] = await __classPrivateFieldGet3(this, _DefaultAwsSecurityCredentialsSupplier_instances, "m", _DefaultAwsSecurityCredentialsSupplier_getImdsV2SessionToken).call(this, context3.transporter);
      if (!this.regionUrl)
        throw Error('Unable to determine AWS region due to missing "options.credential_source.region_url"');
      let opts = {
        ...this.additionalGaxiosOptions,
        url: this.regionUrl,
        method: "GET",
        responseType: "text",
        headers: metadataHeaders
      }, response7 = await context3.transporter.request(opts);
      return response7.data.substr(0, response7.data.length - 1);
    }
    async getAwsSecurityCredentials(context3) {
      if (__classPrivateFieldGet3(this, _DefaultAwsSecurityCredentialsSupplier_instances, "a", _DefaultAwsSecurityCredentialsSupplier_securityCredentialsFromEnv_get))
        return __classPrivateFieldGet3(this, _DefaultAwsSecurityCredentialsSupplier_instances, "a", _DefaultAwsSecurityCredentialsSupplier_securityCredentialsFromEnv_get);
      let metadataHeaders = {};
      if (this.imdsV2SessionTokenUrl)
        metadataHeaders["x-aws-ec2-metadata-token"] = await __classPrivateFieldGet3(this, _DefaultAwsSecurityCredentialsSupplier_instances, "m", _DefaultAwsSecurityCredentialsSupplier_getImdsV2SessionToken).call(this, context3.transporter);
      let roleName = await __classPrivateFieldGet3(this, _DefaultAwsSecurityCredentialsSupplier_instances, "m", _DefaultAwsSecurityCredentialsSupplier_getAwsRoleName).call(this, metadataHeaders, context3.transporter), awsCreds = await __classPrivateFieldGet3(this, _DefaultAwsSecurityCredentialsSupplier_instances, "m", _DefaultAwsSecurityCredentialsSupplier_retrieveAwsSecurityCredentials).call(this, roleName, metadataHeaders, context3.transporter);
      return {
        accessKeyId: awsCreds.AccessKeyId,
        secretAccessKey: awsCreds.SecretAccessKey,
        token: awsCreds.Token
      };
    }
  }
  exports.DefaultAwsSecurityCredentialsSupplier = DefaultAwsSecurityCredentialsSupplier;
  _DefaultAwsSecurityCredentialsSupplier_instances = /* @__PURE__ */ new WeakSet, _DefaultAwsSecurityCredentialsSupplier_getImdsV2SessionToken = async function(transporter) {
    let opts = {
      ...this.additionalGaxiosOptions,
      url: this.imdsV2SessionTokenUrl,
      method: "PUT",
      responseType: "text",
      headers: { "x-aws-ec2-metadata-token-ttl-seconds": "300" }
    };
    return (await transporter.request(opts)).data;
  }, _DefaultAwsSecurityCredentialsSupplier_getAwsRoleName = async function(headers, transporter) {
    if (!this.securityCredentialsUrl)
      throw Error('Unable to determine AWS role name due to missing "options.credential_source.url"');
    let opts = {
      ...this.additionalGaxiosOptions,
      url: this.securityCredentialsUrl,
      method: "GET",
      responseType: "text",
      headers
    };
    return (await transporter.request(opts)).data;
  }, _DefaultAwsSecurityCredentialsSupplier_retrieveAwsSecurityCredentials = async function(roleName, headers, transporter) {
    return (await transporter.request({
      ...this.additionalGaxiosOptions,
      url: `${this.securityCredentialsUrl}/${roleName}`,
      responseType: "json",
      headers
    })).data;
  }, _DefaultAwsSecurityCredentialsSupplier_regionFromEnv_get = function() {
    return process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION || null;
  }, _DefaultAwsSecurityCredentialsSupplier_securityCredentialsFromEnv_get = function() {
    if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY)
      return {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        token: process.env.AWS_SESSION_TOKEN
      };
    return null;
  };
});
