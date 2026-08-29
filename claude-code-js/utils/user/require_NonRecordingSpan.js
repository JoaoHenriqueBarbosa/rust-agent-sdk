// var: require_NonRecordingSpan
var require_NonRecordingSpan = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.NonRecordingSpan = void 0;
  var invalid_span_constants_1 = require_invalid_span_constants();

  class NonRecordingSpan {
    constructor(spanContext = invalid_span_constants_1.INVALID_SPAN_CONTEXT) {
      this._spanContext = spanContext;
    }
    spanContext() {
      return this._spanContext;
    }
    setAttribute(_key, _value) {
      return this;
    }
    setAttributes(_attributes) {
      return this;
    }
    addEvent(_name, _attributes) {
      return this;
    }
    addLink(_link) {
      return this;
    }
    addLinks(_links) {
      return this;
    }
    setStatus(_status) {
      return this;
    }
    updateName(_name) {
      return this;
    }
    end(_endTime) {}
    isRecording() {
      return !1;
    }
    recordException(_exception, _time) {}
  }
  exports.NonRecordingSpan = NonRecordingSpan;
});
