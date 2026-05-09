// var: require_awsclient
var require_awsclient = __commonJS((exports) => {
  var __classPrivateFieldGet3 = exports && exports.__classPrivateFieldGet || function(receiver, state3, kind, f) {
    if (kind === "a" && !f)
      throw TypeError("Private accessor was defined without a getter");
    if (typeof state3 === "function" ? receiver !== state3 || !f : !state3.has(receiver))
      throw TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state3.get(receiver);
  }, _a2, _AwsClient_DEFAULT_AWS_REGIONAL_CREDENTIAL_VERIFICATION_URL;
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.AwsClient = void 0;
  var awsrequestsigner_1 = require_awsrequestsigner(), baseexternalclient_1 = require_baseexternalclient(), defaultawssecuritycredentialssupplier_1 = require_defaultawssecuritycredentialssupplier(), util_1 = require_util2();

  class AwsClient extends baseexternalclient_1.BaseExternalAccountClient {
    constructor(options, additionalOptions) {
      super(options, additionalOptions);
      let opts = (0, util_1.originalOrCamelOptions)(options), credentialSource = opts.get("credential_source"), awsSecurityCredentialsSupplier = opts.get("aws_security_credentials_supplier");
      if (!credentialSource && !awsSecurityCredentialsSupplier)
        throw Error("A credential source or AWS security credentials supplier must be specified.");
      if (credentialSource && awsSecurityCredentialsSupplier)
        throw Error("Only one of credential source or AWS security credentials supplier can be specified.");
      if (awsSecurityCredentialsSupplier)
        this.awsSecurityCredentialsSupplier = awsSecurityCredentialsSupplier, this.regionalCredVerificationUrl = __classPrivateFieldGet3(_a2, _a2, "f", _AwsClient_DEFAULT_AWS_REGIONAL_CREDENTIAL_VERIFICATION_URL), this.credentialSourceType = "programmatic";
      else {
        let credentialSourceOpts = (0, util_1.originalOrCamelOptions)(credentialSource);
        this.environmentId = credentialSourceOpts.get("environment_id");
        let regionUrl = credentialSourceOpts.get("region_url"), securityCredentialsUrl = credentialSourceOpts.get("url"), imdsV2SessionTokenUrl = credentialSourceOpts.get("imdsv2_session_token_url");
        this.awsSecurityCredentialsSupplier = new defaultawssecuritycredentialssupplier_1.DefaultAwsSecurityCredentialsSupplier({
          regionUrl,
          securityCredentialsUrl,
          imdsV2SessionTokenUrl
        }), this.regionalCredVerificationUrl = credentialSourceOpts.get("regional_cred_verification_url"), this.credentialSourceType = "aws", this.validateEnvironmentId();
      }
      this.awsRequestSigner = null, this.region = "";
    }
    validateEnvironmentId() {
      var _b;
      let match = (_b = this.environmentId) === null || _b === void 0 ? void 0 : _b.match(/^(aws)(\d+)$/);
      if (!match || !this.regionalCredVerificationUrl)
        throw Error('No valid AWS "credential_source" provided');
      else if (parseInt(match[2], 10) !== 1)
        throw Error(`aws version "${match[2]}" is not supported in the current build.`);
    }
    async retrieveSubjectToken() {
      if (!this.awsRequestSigner)
        this.region = await this.awsSecurityCredentialsSupplier.getAwsRegion(this.supplierContext), this.awsRequestSigner = new awsrequestsigner_1.AwsRequestSigner(async () => {
          return this.awsSecurityCredentialsSupplier.getAwsSecurityCredentials(this.supplierContext);
        }, this.region);
      let options = await this.awsRequestSigner.getRequestOptions({
        ..._a2.RETRY_CONFIG,
        url: this.regionalCredVerificationUrl.replace("{region}", this.region),
        method: "POST"
      }), reformattedHeader = [], extendedHeaders = Object.assign({
        "x-goog-cloud-target-resource": this.audience
      }, options.headers);
      for (let key in extendedHeaders)
        reformattedHeader.push({
          key,
          value: extendedHeaders[key]
        });
      return encodeURIComponent(JSON.stringify({
        url: options.url,
        method: options.method,
        headers: reformattedHeader
      }));
    }
  }
  exports.AwsClient = AwsClient;
  _a2 = AwsClient;
  _AwsClient_DEFAULT_AWS_REGIONAL_CREDENTIAL_VERIFICATION_URL = { value: "https://sts.{region}.amazonaws.com?Action=GetCallerIdentity&Version=2011-06-15" };
  AwsClient.AWS_EC2_METADATA_IPV4_ADDRESS = "169.254.169.254";
  AwsClient.AWS_EC2_METADATA_IPV6_ADDRESS = "fd00:ec2::254";
});
