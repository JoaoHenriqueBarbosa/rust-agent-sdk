// var: require_ViewRegistry
var require_ViewRegistry = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.ViewRegistry = void 0;

  class ViewRegistry {
    _registeredViews = [];
    addView(view) {
      this._registeredViews.push(view);
    }
    findViews(instrument, meter) {
      return this._registeredViews.filter((registeredView) => {
        return this._matchInstrument(registeredView.instrumentSelector, instrument) && this._matchMeter(registeredView.meterSelector, meter);
      });
    }
    _matchInstrument(selector, instrument) {
      return (selector.getType() === void 0 || instrument.type === selector.getType()) && selector.getNameFilter().match(instrument.name) && selector.getUnitFilter().match(instrument.unit);
    }
    _matchMeter(selector, meter) {
      return selector.getNameFilter().match(meter.name) && (meter.version === void 0 || selector.getVersionFilter().match(meter.version)) && (meter.schemaUrl === void 0 || selector.getSchemaUrlFilter().match(meter.schemaUrl));
    }
  }
  exports.ViewRegistry = ViewRegistry;
});
