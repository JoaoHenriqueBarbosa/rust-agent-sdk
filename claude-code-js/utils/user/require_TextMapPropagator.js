// var: require_TextMapPropagator
var require_TextMapPropagator = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.defaultTextMapSetter = exports.defaultTextMapGetter = void 0;
  exports.defaultTextMapGetter = {
    get(carrier, key2) {
      if (carrier == null)
        return;
      return carrier[key2];
    },
    keys(carrier) {
      if (carrier == null)
        return [];
      return Object.keys(carrier);
    }
  };
  exports.defaultTextMapSetter = {
    set(carrier, key2, value) {
      if (carrier == null)
        return;
      carrier[key2] = value;
    }
  };
});
