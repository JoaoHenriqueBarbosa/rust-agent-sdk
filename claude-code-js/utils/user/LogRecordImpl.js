// class: LogRecordImpl
class LogRecordImpl {
  hrTime;
  hrTimeObserved;
  spanContext;
  resource;
  instrumentationScope;
  attributes = {};
  _severityText;
  _severityNumber;
  _body;
  _eventName;
  _attributesCount = 0;
  _droppedAttributesCount = 0;
  _isReadonly = !1;
  _logRecordLimits;
  set severityText(severityText) {
    if (this._isLogRecordReadonly())
      return;
    this._severityText = severityText;
  }
  get severityText() {
    return this._severityText;
  }
  set severityNumber(severityNumber) {
    if (this._isLogRecordReadonly())
      return;
    this._severityNumber = severityNumber;
  }
  get severityNumber() {
    return this._severityNumber;
  }
  set body(body) {
    if (this._isLogRecordReadonly())
      return;
    this._body = body;
  }
  get body() {
    return this._body;
  }
  get eventName() {
    return this._eventName;
  }
  set eventName(eventName) {
    if (this._isLogRecordReadonly())
      return;
    this._eventName = eventName;
  }
  get droppedAttributesCount() {
    return this._droppedAttributesCount;
  }
  constructor(_sharedState, instrumentationScope, logRecord) {
    let { timestamp, observedTimestamp, eventName, severityNumber, severityText, body, attributes = {}, exception, context: context3 } = logRecord, now2 = Date.now();
    if (this.hrTime = import_core43.timeInputToHrTime(timestamp ?? now2), this.hrTimeObserved = import_core43.timeInputToHrTime(observedTimestamp ?? now2), context3) {
      let spanContext = api2.trace.getSpanContext(context3);
      if (spanContext && api2.isSpanContextValid(spanContext))
        this.spanContext = spanContext;
    }
    if (this.severityNumber = severityNumber, this.severityText = severityText, this.body = body, this.resource = _sharedState.resource, this.instrumentationScope = instrumentationScope, this._logRecordLimits = _sharedState.logRecordLimits, this._eventName = eventName, this.setAttributes(attributes), exception != null)
      this._setException(exception);
  }
  setAttribute(key2, value) {
    if (this._isLogRecordReadonly())
      return this;
    if (key2.length === 0)
      return api2.diag.warn(`Invalid attribute key: ${key2}`), this;
    if (!isLogAttributeValue(value))
      return api2.diag.warn(`Invalid attribute value set for key: ${key2}`), this;
    let isNewKey = !Object.prototype.hasOwnProperty.call(this.attributes, key2);
    if (isNewKey && this._attributesCount >= this._logRecordLimits.attributeCountLimit) {
      if (this._droppedAttributesCount++, this._droppedAttributesCount === 1)
        api2.diag.warn("Dropping extra attributes.");
      return this;
    }
    if (this.attributes[key2] = this._truncateToSize(value), isNewKey)
      this._attributesCount++;
    return this;
  }
  setAttributes(attributes) {
    for (let [k3, v2] of Object.entries(attributes))
      this.setAttribute(k3, v2);
    return this;
  }
  setBody(body) {
    return this.body = body, this;
  }
  setEventName(eventName) {
    return this.eventName = eventName, this;
  }
  setSeverityNumber(severityNumber) {
    return this.severityNumber = severityNumber, this;
  }
  setSeverityText(severityText) {
    return this.severityText = severityText, this;
  }
  _makeReadonly() {
    this._isReadonly = !0;
  }
  _truncateToSize(value) {
    let limit = this._logRecordLimits.attributeValueLengthLimit;
    if (limit <= 0)
      return api2.diag.warn(`Attribute value limit must be positive, got ${limit}`), value;
    if (value == null)
      return value;
    if (typeof value === "string")
      return this._truncateToLimitUtil(value, limit);
    if (value instanceof Uint8Array)
      return value;
    if (Array.isArray(value))
      return value.map((val) => this._truncateToSize(val));
    if (typeof value === "object") {
      let truncatedObj = {};
      for (let [k3, v2] of Object.entries(value))
        truncatedObj[k3] = this._truncateToSize(v2);
      return truncatedObj;
    }
    return value;
  }
  _setException(exception) {
    let hasMinimumAttributes = !1;
    if (typeof exception === "string" || typeof exception === "number") {
      if (!Object.hasOwn(this.attributes, import_semantic_conventions.ATTR_EXCEPTION_MESSAGE))
        this.setAttribute(import_semantic_conventions.ATTR_EXCEPTION_MESSAGE, String(exception));
      hasMinimumAttributes = !0;
    } else if (exception && typeof exception === "object") {
      let exceptionObj = exception;
      if (exceptionObj.code) {
        if (!Object.hasOwn(this.attributes, import_semantic_conventions.ATTR_EXCEPTION_TYPE))
          this.setAttribute(import_semantic_conventions.ATTR_EXCEPTION_TYPE, exceptionObj.code.toString());
        hasMinimumAttributes = !0;
      } else if (exceptionObj.name) {
        if (!Object.hasOwn(this.attributes, import_semantic_conventions.ATTR_EXCEPTION_TYPE))
          this.setAttribute(import_semantic_conventions.ATTR_EXCEPTION_TYPE, exceptionObj.name);
        hasMinimumAttributes = !0;
      }
      if (exceptionObj.message) {
        if (!Object.hasOwn(this.attributes, import_semantic_conventions.ATTR_EXCEPTION_MESSAGE))
          this.setAttribute(import_semantic_conventions.ATTR_EXCEPTION_MESSAGE, exceptionObj.message);
        hasMinimumAttributes = !0;
      }
      if (exceptionObj.stack) {
        if (!Object.hasOwn(this.attributes, import_semantic_conventions.ATTR_EXCEPTION_STACKTRACE))
          this.setAttribute(import_semantic_conventions.ATTR_EXCEPTION_STACKTRACE, exceptionObj.stack);
        hasMinimumAttributes = !0;
      }
    }
    if (!hasMinimumAttributes)
      api2.diag.warn(`Failed to record an exception ${exception}`);
  }
  _truncateToLimitUtil(value, limit) {
    if (value.length <= limit)
      return value;
    return value.substring(0, limit);
  }
  _isLogRecordReadonly() {
    if (this._isReadonly)
      api2.diag.warn("Can not execute the operation on emitted log record");
    return this._isReadonly;
  }
}
