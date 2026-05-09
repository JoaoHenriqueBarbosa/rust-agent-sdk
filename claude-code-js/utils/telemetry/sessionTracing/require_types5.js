// var: require_types5
var require_types5 = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.OTLPExporterError = void 0;

  class OTLPExporterError extends Error {
    code;
    name = "OTLPExporterError";
    data;
    constructor(message, code, data) {
      super(message);
      this.data = data, this.code = code;
    }
  }
  exports.OTLPExporterError = OTLPExporterError;
});
