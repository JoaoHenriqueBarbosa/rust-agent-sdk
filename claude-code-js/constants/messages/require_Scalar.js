// var: require_Scalar
var require_Scalar = __commonJS((exports) => {
  var identity16 = require_identity(), Node2 = require_Node(), toJS = require_toJS(), isScalarValue = (value) => !value || typeof value !== "function" && typeof value !== "object";

  class Scalar extends Node2.NodeBase {
    constructor(value) {
      super(identity16.SCALAR);
      this.value = value;
    }
    toJSON(arg, ctx) {
      return ctx?.keep ? this.value : toJS.toJS(this.value, arg, ctx);
    }
    toString() {
      return String(this.value);
    }
  }
  Scalar.BLOCK_FOLDED = "BLOCK_FOLDED";
  Scalar.BLOCK_LITERAL = "BLOCK_LITERAL";
  Scalar.PLAIN = "PLAIN";
  Scalar.QUOTE_DOUBLE = "QUOTE_DOUBLE";
  Scalar.QUOTE_SINGLE = "QUOTE_SINGLE";
  exports.Scalar = Scalar;
  exports.isScalarValue = isScalarValue;
});
