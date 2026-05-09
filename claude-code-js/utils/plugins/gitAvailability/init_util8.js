// var: init_util8
var init_util8 = __esm(() => {
  (function(util11) {
    util11.assertEqual = (_) => {};
    function assertIs2(_arg) {}
    util11.assertIs = assertIs2;
    function assertNever2(_x) {
      throw Error();
    }
    util11.assertNever = assertNever2, util11.arrayToEnum = (items) => {
      let obj = {};
      for (let item of items)
        obj[item] = item;
      return obj;
    }, util11.getValidEnumValues = (obj) => {
      let validKeys = util11.objectKeys(obj).filter((k3) => typeof obj[obj[k3]] !== "number"), filtered = {};
      for (let k3 of validKeys)
        filtered[k3] = obj[k3];
      return util11.objectValues(filtered);
    }, util11.objectValues = (obj) => {
      return util11.objectKeys(obj).map(function(e) {
        return obj[e];
      });
    }, util11.objectKeys = typeof Object.keys === "function" ? (obj) => Object.keys(obj) : (object2) => {
      let keys2 = [];
      for (let key in object2)
        if (Object.prototype.hasOwnProperty.call(object2, key))
          keys2.push(key);
      return keys2;
    }, util11.find = (arr, checker) => {
      for (let item of arr)
        if (checker(item))
          return item;
      return;
    }, util11.isInteger = typeof Number.isInteger === "function" ? (val) => Number.isInteger(val) : (val) => typeof val === "number" && Number.isFinite(val) && Math.floor(val) === val;
    function joinValues2(array2, separator = " | ") {
      return array2.map((val) => typeof val === "string" ? `'${val}'` : val).join(separator);
    }
    util11.joinValues = joinValues2, util11.jsonStringifyReplacer = (_, value) => {
      if (typeof value === "bigint")
        return value.toString();
      return value;
    };
  })(util10 || (util10 = {}));
  (function(objectUtil2) {
    objectUtil2.mergeShapes = (first, second) => {
      return {
        ...first,
        ...second
      };
    };
  })(objectUtil || (objectUtil = {}));
  ZodParsedType = util10.arrayToEnum([
    "string",
    "nan",
    "number",
    "integer",
    "float",
    "boolean",
    "date",
    "bigint",
    "symbol",
    "function",
    "undefined",
    "null",
    "array",
    "object",
    "unknown",
    "promise",
    "void",
    "never",
    "map",
    "set"
  ]);
});
