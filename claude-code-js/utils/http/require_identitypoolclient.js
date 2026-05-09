// var: require_identitypoolclient
var require_identitypoolclient = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.IdentityPoolClient = void 0;
  var baseexternalclient_1 = require_baseexternalclient(), util_1 = require_util2(), filesubjecttokensupplier_1 = require_filesubjecttokensupplier(), urlsubjecttokensupplier_1 = require_urlsubjecttokensupplier();

  class IdentityPoolClient extends baseexternalclient_1.BaseExternalAccountClient {
    constructor(options, additionalOptions) {
      super(options, additionalOptions);
      let opts = (0, util_1.originalOrCamelOptions)(options), credentialSource = opts.get("credential_source"), subjectTokenSupplier = opts.get("subject_token_supplier");
      if (!credentialSource && !subjectTokenSupplier)
        throw Error("A credential source or subject token supplier must be specified.");
      if (credentialSource && subjectTokenSupplier)
        throw Error("Only one of credential source or subject token supplier can be specified.");
      if (subjectTokenSupplier)
        this.subjectTokenSupplier = subjectTokenSupplier, this.credentialSourceType = "programmatic";
      else {
        let credentialSourceOpts = (0, util_1.originalOrCamelOptions)(credentialSource), formatOpts = (0, util_1.originalOrCamelOptions)(credentialSourceOpts.get("format")), formatType = formatOpts.get("type") || "text", formatSubjectTokenFieldName = formatOpts.get("subject_token_field_name");
        if (formatType !== "json" && formatType !== "text")
          throw Error(`Invalid credential_source format "${formatType}"`);
        if (formatType === "json" && !formatSubjectTokenFieldName)
          throw Error("Missing subject_token_field_name for JSON credential_source format");
        let file2 = credentialSourceOpts.get("file"), url3 = credentialSourceOpts.get("url"), headers = credentialSourceOpts.get("headers");
        if (file2 && url3)
          throw Error('No valid Identity Pool "credential_source" provided, must be either file or url.');
        else if (file2 && !url3)
          this.credentialSourceType = "file", this.subjectTokenSupplier = new filesubjecttokensupplier_1.FileSubjectTokenSupplier({
            filePath: file2,
            formatType,
            subjectTokenFieldName: formatSubjectTokenFieldName
          });
        else if (!file2 && url3)
          this.credentialSourceType = "url", this.subjectTokenSupplier = new urlsubjecttokensupplier_1.UrlSubjectTokenSupplier({
            url: url3,
            formatType,
            subjectTokenFieldName: formatSubjectTokenFieldName,
            headers,
            additionalGaxiosOptions: IdentityPoolClient.RETRY_CONFIG
          });
        else
          throw Error('No valid Identity Pool "credential_source" provided, must be either file or url.');
      }
    }
    async retrieveSubjectToken() {
      return this.subjectTokenSupplier.getSubjectToken(this.supplierContext);
    }
  }
  exports.IdentityPoolClient = IdentityPoolClient;
});
