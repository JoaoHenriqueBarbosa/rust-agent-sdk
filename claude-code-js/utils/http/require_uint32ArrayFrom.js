// var: require_uint32ArrayFrom
var require_uint32ArrayFrom = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.uint32ArrayFrom = void 0;
  function uint32ArrayFrom2(a_lookUpTable2) {
    if (!Uint32Array.from) {
      var return_array = new Uint32Array(a_lookUpTable2.length), a_index = 0;
      while (a_index < a_lookUpTable2.length)
        return_array[a_index] = a_lookUpTable2[a_index], a_index += 1;
      return return_array;
    }
    return Uint32Array.from(a_lookUpTable2);
  }
  exports.uint32ArrayFrom = uint32ArrayFrom2;
});
