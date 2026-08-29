// var: require_composite
var require_composite = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.CompositePropagator = void 0;
  var api_1 = require_src7();

  class CompositePropagator {
    _propagators;
    _fields;
    constructor(config10 = {}) {
      this._propagators = config10.propagators ?? [], this._fields = Array.from(new Set(this._propagators.map((p4) => typeof p4.fields === "function" ? p4.fields() : []).reduce((x4, y2) => x4.concat(y2), [])));
    }
    inject(context3, carrier, setter) {
      for (let propagator of this._propagators)
        try {
          propagator.inject(context3, carrier, setter);
        } catch (err2) {
          api_1.diag.warn(`Failed to inject with ${propagator.constructor.name}. Err: ${err2.message}`);
        }
    }
    extract(context3, carrier, getter) {
      return this._propagators.reduce((ctx, propagator) => {
        try {
          return propagator.extract(ctx, carrier, getter);
        } catch (err2) {
          api_1.diag.warn(`Failed to extract with ${propagator.constructor.name}. Err: ${err2.message}`);
        }
        return ctx;
      }, context3);
    }
    fields() {
      return this._fields.slice();
    }
  }
  exports.CompositePropagator = CompositePropagator;
});
