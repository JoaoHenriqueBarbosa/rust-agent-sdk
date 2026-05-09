// var: require_util_map_includes
var require_util_map_includes = __commonJS((exports) => {
  var identity16 = require_identity();
  function mapIncludes(ctx, items, search) {
    let { uniqueKeys } = ctx.options;
    if (uniqueKeys === !1)
      return !1;
    let isEqual2 = typeof uniqueKeys === "function" ? uniqueKeys : (a2, b) => a2 === b || identity16.isScalar(a2) && identity16.isScalar(b) && a2.value === b.value;
    return items.some((pair) => isEqual2(pair.key, search));
  }
  exports.mapIncludes = mapIncludes;
});
