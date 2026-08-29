// var: require_utils8
var require_utils8 = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.createConstMap = void 0;
  function createConstMap(values3) {
    let res = {}, len = values3.length;
    for (let lp = 0;lp < len; lp++) {
      let val = values3[lp];
      if (val)
        res[String(val).toUpperCase().replace(/[-.]/g, "_")] = val;
    }
    return res;
  }
  exports.createConstMap = createConstMap;
});
