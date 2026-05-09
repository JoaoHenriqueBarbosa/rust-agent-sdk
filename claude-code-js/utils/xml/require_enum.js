// var: require_enum
var require_enum = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  var codegen_1 = require_codegen(), util_1 = require_util4(), equal_1 = require_equal(), error44 = {
    message: "must be equal to one of the allowed values",
    params: ({ schemaCode }) => codegen_1._`{allowedValues: ${schemaCode}}`
  }, def2 = {
    keyword: "enum",
    schemaType: "array",
    $data: !0,
    error: error44,
    code(cxt) {
      let { gen, data, $data, schema: schema5, schemaCode, it } = cxt;
      if (!$data && schema5.length === 0)
        throw Error("enum must have non-empty array");
      let useLoop = schema5.length >= it.opts.loopEnum, eql, getEql = () => eql !== null && eql !== void 0 ? eql : eql = (0, util_1.useFunc)(gen, equal_1.default), valid;
      if (useLoop || $data)
        valid = gen.let("valid"), cxt.block$data(valid, loopEnum);
      else {
        if (!Array.isArray(schema5))
          throw Error("ajv implementation error");
        let vSchema = gen.const("vSchema", schemaCode);
        valid = (0, codegen_1.or)(...schema5.map((_x, i5) => equalCode(vSchema, i5)));
      }
      cxt.pass(valid);
      function loopEnum() {
        gen.assign(valid, !1), gen.forOf("v", schemaCode, (v2) => gen.if(codegen_1._`${getEql()}(${data}, ${v2})`, () => gen.assign(valid, !0).break()));
      }
      function equalCode(vSchema, i5) {
        let sch = schema5[i5];
        return typeof sch === "object" && sch !== null ? codegen_1._`${getEql()}(${data}, ${vSchema}[${i5}])` : codegen_1._`${data} === ${sch}`;
      }
    }
  };
  exports.default = def2;
});
