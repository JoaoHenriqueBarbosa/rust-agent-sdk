// var: require_W3CBaggagePropagator
var require_W3CBaggagePropagator = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.W3CBaggagePropagator = void 0;
  var api_1 = require_src7(), suppress_tracing_1 = require_suppress_tracing(), constants_1 = require_constants4(), utils_1 = require_utils7();

  class W3CBaggagePropagator {
    inject(context3, carrier, setter) {
      let baggage = api_1.propagation.getBaggage(context3);
      if (!baggage || (0, suppress_tracing_1.isTracingSuppressed)(context3))
        return;
      let keyPairs = (0, utils_1.getKeyPairs)(baggage).filter((pair) => {
        return pair.length <= constants_1.BAGGAGE_MAX_PER_NAME_VALUE_PAIRS;
      }).slice(0, constants_1.BAGGAGE_MAX_NAME_VALUE_PAIRS), headerValue = (0, utils_1.serializeKeyPairs)(keyPairs);
      if (headerValue.length > 0)
        setter.set(carrier, constants_1.BAGGAGE_HEADER, headerValue);
    }
    extract(context3, carrier, getter) {
      let headerValue = getter.get(carrier, constants_1.BAGGAGE_HEADER), baggageString = Array.isArray(headerValue) ? headerValue.join(constants_1.BAGGAGE_ITEMS_SEPARATOR) : headerValue;
      if (!baggageString)
        return context3;
      let baggage = {};
      if (baggageString.length === 0)
        return context3;
      if (baggageString.split(constants_1.BAGGAGE_ITEMS_SEPARATOR).forEach((entry) => {
        let keyPair = (0, utils_1.parsePairKeyValue)(entry);
        if (keyPair) {
          let baggageEntry = { value: keyPair.value };
          if (keyPair.metadata)
            baggageEntry.metadata = keyPair.metadata;
          baggage[keyPair.key] = baggageEntry;
        }
      }), Object.entries(baggage).length === 0)
        return context3;
      return api_1.propagation.setBaggage(context3, api_1.propagation.createBaggage(baggage));
    }
    fields() {
      return [constants_1.BAGGAGE_HEADER];
    }
  }
  exports.W3CBaggagePropagator = W3CBaggagePropagator;
});
