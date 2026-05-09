// var: require_cmp
var require_cmp = __commonJS((exports, module) => {
  var eq2 = require_eq(), neq = require_neq(), gt = require_gt(), gte = require_gte(), lt = require_lt(), lte = require_lte(), cmp = (a2, op, b, loose) => {
    switch (op) {
      case "===":
        if (typeof a2 === "object")
          a2 = a2.version;
        if (typeof b === "object")
          b = b.version;
        return a2 === b;
      case "!==":
        if (typeof a2 === "object")
          a2 = a2.version;
        if (typeof b === "object")
          b = b.version;
        return a2 !== b;
      case "":
      case "=":
      case "==":
        return eq2(a2, b, loose);
      case "!=":
        return neq(a2, b, loose);
      case ">":
        return gt(a2, b, loose);
      case ">=":
        return gte(a2, b, loose);
      case "<":
        return lt(a2, b, loose);
      case "<=":
        return lte(a2, b, loose);
      default:
        throw TypeError(`Invalid operator: ${op}`);
    }
  };
  module.exports = cmp;
});
