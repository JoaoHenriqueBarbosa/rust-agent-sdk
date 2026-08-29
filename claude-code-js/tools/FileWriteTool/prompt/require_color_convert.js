// var: require_color_convert
var require_color_convert = __commonJS((exports, module) => {
  var conversions = require_conversions(), route = require_route(), convert = {}, models = Object.keys(conversions);
  function wrapRaw(fn) {
    let wrappedFn = function(...args) {
      let arg0 = args[0];
      if (arg0 === void 0 || arg0 === null)
        return arg0;
      if (arg0.length > 1)
        args = arg0;
      return fn(args);
    };
    if ("conversion" in fn)
      wrappedFn.conversion = fn.conversion;
    return wrappedFn;
  }
  function wrapRounded(fn) {
    let wrappedFn = function(...args) {
      let arg0 = args[0];
      if (arg0 === void 0 || arg0 === null)
        return arg0;
      if (arg0.length > 1)
        args = arg0;
      let result = fn(args);
      if (typeof result === "object")
        for (let len = result.length, i4 = 0;i4 < len; i4++)
          result[i4] = Math.round(result[i4]);
      return result;
    };
    if ("conversion" in fn)
      wrappedFn.conversion = fn.conversion;
    return wrappedFn;
  }
  models.forEach((fromModel) => {
    convert[fromModel] = {}, Object.defineProperty(convert[fromModel], "channels", { value: conversions[fromModel].channels }), Object.defineProperty(convert[fromModel], "labels", { value: conversions[fromModel].labels });
    let routes = route(fromModel);
    Object.keys(routes).forEach((toModel) => {
      let fn = routes[toModel];
      convert[fromModel][toModel] = wrapRounded(fn), convert[fromModel][toModel].raw = wrapRaw(fn);
    });
  });
  module.exports = convert;
});
