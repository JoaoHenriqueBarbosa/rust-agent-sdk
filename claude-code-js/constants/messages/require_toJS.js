// var: require_toJS
var require_toJS = __commonJS((exports) => {
  var identity16 = require_identity();
  function toJS(value, arg, ctx) {
    if (Array.isArray(value))
      return value.map((v2, i4) => toJS(v2, String(i4), ctx));
    if (value && typeof value.toJSON === "function") {
      if (!ctx || !identity16.hasAnchor(value))
        return value.toJSON(arg, ctx);
      let data = { aliasCount: 0, count: 1, res: void 0 };
      ctx.anchors.set(value, data), ctx.onCreate = (res2) => {
        data.res = res2, delete ctx.onCreate;
      };
      let res = value.toJSON(arg, ctx);
      if (ctx.onCreate)
        ctx.onCreate(res);
      return res;
    }
    if (typeof value === "bigint" && !ctx?.keep)
      return Number(value);
    return value;
  }
  exports.toJS = toJS;
});
