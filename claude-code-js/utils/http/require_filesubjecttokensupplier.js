// var: require_filesubjecttokensupplier
var require_filesubjecttokensupplier = __commonJS((exports) => {
  var _a2, _b, _c;
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.FileSubjectTokenSupplier = void 0;
  var util_1 = __require("util"), fs9 = __require("fs"), readFile11 = (0, util_1.promisify)((_a2 = fs9.readFile) !== null && _a2 !== void 0 ? _a2 : () => {}), realpath3 = (0, util_1.promisify)((_b = fs9.realpath) !== null && _b !== void 0 ? _b : () => {}), lstat = (0, util_1.promisify)((_c = fs9.lstat) !== null && _c !== void 0 ? _c : () => {});

  class FileSubjectTokenSupplier {
    constructor(opts) {
      this.filePath = opts.filePath, this.formatType = opts.formatType, this.subjectTokenFieldName = opts.subjectTokenFieldName;
    }
    async getSubjectToken(context3) {
      let parsedFilePath = this.filePath;
      try {
        if (parsedFilePath = await realpath3(parsedFilePath), !(await lstat(parsedFilePath)).isFile())
          throw Error();
      } catch (err) {
        if (err instanceof Error)
          err.message = `The file at ${parsedFilePath} does not exist, or it is not a file. ${err.message}`;
        throw err;
      }
      let subjectToken, rawText = await readFile11(parsedFilePath, { encoding: "utf8" });
      if (this.formatType === "text")
        subjectToken = rawText;
      else if (this.formatType === "json" && this.subjectTokenFieldName)
        subjectToken = JSON.parse(rawText)[this.subjectTokenFieldName];
      if (!subjectToken)
        throw Error("Unable to parse the subject_token from the credential_source file");
      return subjectToken;
    }
  }
  exports.FileSubjectTokenSupplier = FileSubjectTokenSupplier;
});
