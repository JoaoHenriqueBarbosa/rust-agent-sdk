// var: require_uniqueItems
var require_uniqueItems = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  var dataType_1 = require_dataType(), codegen_1 = require_codegen(), util_1 = require_util4(), equal_1 = require_equal(), error44 = {
    message: ({ params: { i: i5, j: j4 } }) => codegen_1.str`must NOT have duplicate items (items ## ${j4} and ${i5} are identical)`,
    params: ({ params: { i: i5, j: j4 } }) => codegen_1._`{i: ${i5}, j: ${j4}}`
  }, def2 = {
    keyword: "uniqueItems",
    type: "array",
    schemaType: "boolean",
    $data: !0,
    error: error44,
    code(cxt) {
      let { gen, data, $data, schema: schema5, parentSchema, schemaCode, it } = cxt;
      if (!$data && !schema5)
        return;
      let valid = gen.let("valid"), itemTypes = parentSchema.items ? (0, dataType_1.getSchemaTypes)(parentSchema.items) : [];
      cxt.block$data(valid, validateUniqueItems, codegen_1._`${schemaCode} === false`), cxt.ok(valid);
      function validateUniqueItems() {
        let i5 = gen.let("i", codegen_1._`${data}.length`), j4 = gen.let("j");
        cxt.setParams({ i: i5, j: j4 }), gen.assign(valid, !0), gen.if(codegen_1._`${i5} > 1`, () => (canOptimize() ? loopN : loopN2)(i5, j4));
      }
      function canOptimize() {
        return itemTypes.length > 0 && !itemTypes.some((t2) => t2 === "object" || t2 === "array");
      }
      function loopN(i5, j4) {
        let item = gen.name("item"), wrongType = (0, dataType_1.checkDataTypes)(itemTypes, item, it.opts.strictNumbers, dataType_1.DataType.Wrong), indices = gen.const("indices", codegen_1._`{}`);
        gen.for(codegen_1._`;${i5}--;`, () => {
          if (gen.let(item, codegen_1._`${data}[${i5}]`), gen.if(wrongType, codegen_1._`continue`), itemTypes.length > 1)
            gen.if(codegen_1._`typeof ${item} == "string"`, codegen_1._`${item} += "_"`);
          gen.if(codegen_1._`typeof ${indices}[${item}] == "number"`, () => {
            gen.assign(j4, codegen_1._`${indices}[${item}]`), cxt.error(), gen.assign(valid, !1).break();
          }).code(codegen_1._`${indices}[${item}] = ${i5}`);
        });
      }
      function loopN2(i5, j4) {
        let eql = (0, util_1.useFunc)(gen, equal_1.default), outer = gen.name("outer");
        gen.label(outer).for(codegen_1._`;${i5}--;`, () => gen.for(codegen_1._`${j4} = ${i5}; ${j4}--;`, () => gen.if(codegen_1._`${eql}(${data}[${i5}], ${data}[${j4}])`, () => {
          cxt.error(), gen.assign(valid, !1).break(outer);
        })));
      }
    }
  };
  exports.default = def2;
});
