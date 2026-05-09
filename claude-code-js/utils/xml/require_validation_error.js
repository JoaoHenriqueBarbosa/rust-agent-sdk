// var: require_validation_error
var require_validation_error = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });

  class ValidationError2 extends Error {
    constructor(errors8) {
      super("validation failed");
      this.errors = errors8, this.ajv = this.validation = !0;
    }
  }
  exports.default = ValidationError2;
});
