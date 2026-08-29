// var: require_utils5
var require_utils5 = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.baggageEntryMetadataFromString = exports.createBaggage = void 0;
  var diag_1 = require_diag(), baggage_impl_1 = require_baggage_impl(), symbol_1 = require_symbol(), diag = diag_1.DiagAPI.instance();
  function createBaggage(entries = {}) {
    return new baggage_impl_1.BaggageImpl(new Map(Object.entries(entries)));
  }
  exports.createBaggage = createBaggage;
  function baggageEntryMetadataFromString(str2) {
    if (typeof str2 !== "string")
      diag.error(`Cannot create baggage metadata from unknown type: ${typeof str2}`), str2 = "";
    return {
      __TYPE__: symbol_1.baggageEntryMetadataSymbol,
      toString() {
        return str2;
      }
    };
  }
  exports.baggageEntryMetadataFromString = baggageEntryMetadataFromString;
});
