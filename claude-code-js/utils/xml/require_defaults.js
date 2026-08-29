// var: require_defaults
var require_defaults = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.assignDefaults = void 0;
  var codegen_1 = require_codegen(), util_1 = require_util4();
  function assignDefaults(it, ty) {
    let { properties, items } = it.schema;
    if (ty === "object" && properties)
      for (let key2 in properties)
        assignDefault(it, key2, properties[key2].default);
    else if (ty === "array" && Array.isArray(items))
      items.forEach((sch, i5) => assignDefault(it, i5, sch.default));
  }
  exports.assignDefaults = assignDefaults;
  function assignDefault(it, prop, defaultValue) {
    let { gen, compositeRule, data, opts } = it;
    if (defaultValue === void 0)
      return;
    let childData = codegen_1._`${data}${(0, codegen_1.getProperty)(prop)}`;
    if (compositeRule) {
      (0, util_1.checkStrictMode)(it, `default is ignored for: ${childData}`);
      return;
    }
    let condition = codegen_1._`${childData} === undefined`;
    if (opts.useDefaults === "empty")
      condition = codegen_1._`${condition} || ${childData} === null || ${childData} === ""`;
    gen.if(condition, codegen_1._`${childData} = ${(0, codegen_1.stringify)(defaultValue)}`);
  }
});
