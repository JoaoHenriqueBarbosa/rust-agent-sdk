// var: require_prefixItems
var require_prefixItems = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  var items_1 = require_items(), def2 = {
    keyword: "prefixItems",
    type: "array",
    schemaType: ["array"],
    before: "uniqueItems",
    code: (cxt) => (0, items_1.validateTuple)(cxt, "items")
  };
  exports.default = def2;
});
