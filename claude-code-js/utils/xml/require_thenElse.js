// var: require_thenElse
var require_thenElse = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  var util_1 = require_util4(), def2 = {
    keyword: ["then", "else"],
    schemaType: ["object", "boolean"],
    code({ keyword, parentSchema, it }) {
      if (parentSchema.if === void 0)
        (0, util_1.checkStrictMode)(it, `"${keyword}" without "if" is ignored`);
    }
  };
  exports.default = def2;
});
