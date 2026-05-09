// var: require_urlsubjecttokensupplier
var require_urlsubjecttokensupplier = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.UrlSubjectTokenSupplier = void 0;

  class UrlSubjectTokenSupplier {
    constructor(opts) {
      this.url = opts.url, this.formatType = opts.formatType, this.subjectTokenFieldName = opts.subjectTokenFieldName, this.headers = opts.headers, this.additionalGaxiosOptions = opts.additionalGaxiosOptions;
    }
    async getSubjectToken(context3) {
      let opts = {
        ...this.additionalGaxiosOptions,
        url: this.url,
        method: "GET",
        headers: this.headers,
        responseType: this.formatType
      }, subjectToken;
      if (this.formatType === "text")
        subjectToken = (await context3.transporter.request(opts)).data;
      else if (this.formatType === "json" && this.subjectTokenFieldName)
        subjectToken = (await context3.transporter.request(opts)).data[this.subjectTokenFieldName];
      if (!subjectToken)
        throw Error("Unable to parse the subject_token from the credential_source URL");
      return subjectToken;
    }
  }
  exports.UrlSubjectTokenSupplier = UrlSubjectTokenSupplier;
});
