// var: require_isEmptyData
var require_isEmptyData = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.isEmptyData = void 0;
  function isEmptyData2(data) {
    if (typeof data === "string")
      return data.length === 0;
    return data.byteLength === 0;
  }
  exports.isEmptyData = isEmptyData2;
});
