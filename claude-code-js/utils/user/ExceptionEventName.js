// var: ExceptionEventName
var ExceptionEventName = "exception";

// node_modules/@opentelemetry/sdk-trace-base/build/esm/Span.js
class SpanImpl {
  _spanContext;
  kind;
  parentSpanContext;
  attributes = {};
  links = [];
  events = [];
  startTime;
  resource;
  instrumentationScope;
  _droppedAttributesCount = 0;
  _droppedEventsCount = 0;
  _droppedLinksCount = 0;
  _attributesCount = 0;
  name;
  status = {
    code: import_api5.SpanStatusCode.UNSET
  };
  endTime = [0, 0];
  _ended = !1;
  _duration = [-1, -1];
  _spanProcessor;
  _spanLimits;
  _attributeValueLengthLimit;
  _recordEndMetrics;
  _performanceStartTime;
  _performanceOffset;
  _startTimeProvided;
  constructor(opts) {
    let now2 = Date.now();
    if (this._spanContext = opts.spanContext, this._performanceStartTime = import_core48.otperformance.now(), this._performanceOffset = now2 - (this._performanceStartTime + import_core48.otperformance.timeOrigin), this._startTimeProvided = opts.startTime != null, this._spanLimits = opts.spanLimits, this._attributeValueLengthLimit = this._spanLimits.attributeValueLengthLimit ?? 0, this._spanProcessor = opts.spanProcessor, this.name = opts.name, this.parentSpanContext = opts.parentSpanContext, this.kind = opts.kind, opts.links)
      for (let link3 of opts.links)
        this.addLink(link3);
    if (this.startTime = this._getTime(opts.startTime ?? now2), this.resource = opts.resource, this.instrumentationScope = opts.scope, this._recordEndMetrics = opts.recordEndMetrics, opts.attributes != null)
      this.setAttributes(opts.attributes);
    this._spanProcessor.onStart(this, opts.context);
  }
  spanContext() {
    return this._spanContext;
  }
  setAttribute(key2, value) {
    if (value == null || this._isSpanEnded())
      return this;
    if (key2.length === 0)
      return import_api5.diag.warn(`Invalid attribute key: ${key2}`), this;
    if (!import_core48.isAttributeValue(value))
      return import_api5.diag.warn(`Invalid attribute value set for key: ${key2}`), this;
    let { attributeCountLimit } = this._spanLimits, isNewKey = !Object.prototype.hasOwnProperty.call(this.attributes, key2);
    if (attributeCountLimit !== void 0 && this._attributesCount >= attributeCountLimit && isNewKey)
      return this._droppedAttributesCount++, this;
    if (this.attributes[key2] = this._truncateToSize(value), isNewKey)
      this._attributesCount++;
    return this;
  }
  setAttributes(attributes) {
    for (let key2 in attributes)
      if (Object.prototype.hasOwnProperty.call(attributes, key2))
        this.setAttribute(key2, attributes[key2]);
    return this;
  }
  addEvent(name3, attributesOrStartTime, timeStamp) {
    if (this._isSpanEnded())
      return this;
    let { eventCountLimit } = this._spanLimits;
    if (eventCountLimit === 0)
      return import_api5.diag.warn("No events allowed."), this._droppedEventsCount++, this;
    if (eventCountLimit !== void 0 && this.events.length >= eventCountLimit) {
      if (this._droppedEventsCount === 0)
        import_api5.diag.debug("Dropping extra events.");
      this.events.shift(), this._droppedEventsCount++;
    }
    if (import_core48.isTimeInput(attributesOrStartTime)) {
      if (!import_core48.isTimeInput(timeStamp))
        timeStamp = attributesOrStartTime;
      attributesOrStartTime = void 0;
    }
    let sanitized = import_core48.sanitizeAttributes(attributesOrStartTime), { attributePerEventCountLimit } = this._spanLimits, attributes = {}, droppedAttributesCount = 0, eventAttributesCount = 0;
    for (let attr in sanitized) {
      if (!Object.prototype.hasOwnProperty.call(sanitized, attr))
        continue;
      let attrVal = sanitized[attr];
      if (attributePerEventCountLimit !== void 0 && eventAttributesCount >= attributePerEventCountLimit) {
        droppedAttributesCount++;
        continue;
      }
      attributes[attr] = this._truncateToSize(attrVal), eventAttributesCount++;
    }
    return this.events.push({
      name: name3,
      attributes,
      time: this._getTime(timeStamp),
      droppedAttributesCount
    }), this;
  }
  addLink(link3) {
    if (this._isSpanEnded())
      return this;
    let { linkCountLimit } = this._spanLimits;
    if (linkCountLimit === 0)
      return this._droppedLinksCount++, this;
    if (linkCountLimit !== void 0 && this.links.length >= linkCountLimit) {
      if (this._droppedLinksCount === 0)
        import_api5.diag.debug("Dropping extra links.");
      this.links.shift(), this._droppedLinksCount++;
    }
    let { attributePerLinkCountLimit } = this._spanLimits, sanitized = import_core48.sanitizeAttributes(link3.attributes), attributes = {}, droppedAttributesCount = 0, linkAttributesCount = 0;
    for (let attr in sanitized) {
      if (!Object.prototype.hasOwnProperty.call(sanitized, attr))
        continue;
      let attrVal = sanitized[attr];
      if (attributePerLinkCountLimit !== void 0 && linkAttributesCount >= attributePerLinkCountLimit) {
        droppedAttributesCount++;
        continue;
      }
      attributes[attr] = this._truncateToSize(attrVal), linkAttributesCount++;
    }
    let processedLink = { context: link3.context };
    if (linkAttributesCount > 0)
      processedLink.attributes = attributes;
    if (droppedAttributesCount > 0)
      processedLink.droppedAttributesCount = droppedAttributesCount;
    return this.links.push(processedLink), this;
  }
  addLinks(links) {
    for (let link3 of links)
      this.addLink(link3);
    return this;
  }
  setStatus(status) {
    if (this._isSpanEnded())
      return this;
    if (status.code === import_api5.SpanStatusCode.UNSET)
      return this;
    if (this.status.code === import_api5.SpanStatusCode.OK)
      return this;
    let newStatus = { code: status.code };
    if (status.code === import_api5.SpanStatusCode.ERROR) {
      if (typeof status.message === "string")
        newStatus.message = status.message;
      else if (status.message != null)
        import_api5.diag.warn(`Dropping invalid status.message of type '${typeof status.message}', expected 'string'`);
    }
    return this.status = newStatus, this;
  }
  updateName(name3) {
    if (this._isSpanEnded())
      return this;
    return this.name = name3, this;
  }
  end(endTime) {
    if (this._isSpanEnded()) {
      import_api5.diag.error(`${this.name} ${this._spanContext.traceId}-${this._spanContext.spanId} - You can only call end() on a span once.`);
      return;
    }
    if (this.endTime = this._getTime(endTime), this._duration = import_core48.hrTimeDuration(this.startTime, this.endTime), this._duration[0] < 0)
      import_api5.diag.warn("Inconsistent start and end time, startTime > endTime. Setting span duration to 0ms.", this.startTime, this.endTime), this.endTime = this.startTime.slice(), this._duration = [0, 0];
    if (this._droppedEventsCount > 0)
      import_api5.diag.warn(`Dropped ${this._droppedEventsCount} events because eventCountLimit reached`);
    if (this._droppedLinksCount > 0)
      import_api5.diag.warn(`Dropped ${this._droppedLinksCount} links because linkCountLimit reached`);
    if (this._spanProcessor.onEnding)
      this._spanProcessor.onEnding(this);
    this._recordEndMetrics?.(), this._ended = !0, this._spanProcessor.onEnd(this);
  }
  _getTime(inp) {
    if (typeof inp === "number" && inp <= import_core48.otperformance.now())
      return import_core48.hrTime(inp + this._performanceOffset);
    if (typeof inp === "number")
      return import_core48.millisToHrTime(inp);
    if (inp instanceof Date)
      return import_core48.millisToHrTime(inp.getTime());
    if (import_core48.isTimeInputHrTime(inp))
      return inp;
    if (this._startTimeProvided)
      return import_core48.millisToHrTime(Date.now());
    let msDuration = import_core48.otperformance.now() - this._performanceStartTime;
    return import_core48.addHrTimes(this.startTime, import_core48.millisToHrTime(msDuration));
  }
  isRecording() {
    return this._ended === !1;
  }
  recordException(exception, time3) {
    let attributes = {};
    if (typeof exception === "string")
      attributes[import_semantic_conventions2.ATTR_EXCEPTION_MESSAGE] = exception;
    else if (exception) {
      if (exception.code)
        attributes[import_semantic_conventions2.ATTR_EXCEPTION_TYPE] = exception.code.toString();
      else if (exception.name)
        attributes[import_semantic_conventions2.ATTR_EXCEPTION_TYPE] = exception.name;
      if (exception.message)
        attributes[import_semantic_conventions2.ATTR_EXCEPTION_MESSAGE] = exception.message;
      if (exception.stack)
        attributes[import_semantic_conventions2.ATTR_EXCEPTION_STACKTRACE] = exception.stack;
    }
    if (attributes[import_semantic_conventions2.ATTR_EXCEPTION_TYPE] || attributes[import_semantic_conventions2.ATTR_EXCEPTION_MESSAGE])
      this.addEvent(ExceptionEventName, attributes, time3);
    else
      import_api5.diag.warn(`Failed to record an exception ${exception}`);
  }
  get duration() {
    return this._duration;
  }
  get ended() {
    return this._ended;
  }
  get droppedAttributesCount() {
    return this._droppedAttributesCount;
  }
  get droppedEventsCount() {
    return this._droppedEventsCount;
  }
  get droppedLinksCount() {
    return this._droppedLinksCount;
  }
  _isSpanEnded() {
    if (this._ended) {
      let error44 = Error(`Operation attempted on ended Span {traceId: ${this._spanContext.traceId}, spanId: ${this._spanContext.spanId}}`);
      import_api5.diag.warn(`Cannot execute the operation on ended Span {traceId: ${this._spanContext.traceId}, spanId: ${this._spanContext.spanId}}`, error44);
    }
    return this._ended;
  }
  _truncateToLimitUtil(value, limit) {
    if (value.length <= limit)
      return value;
    return value.substring(0, limit);
  }
  _truncateToSize(value) {
    let limit = this._attributeValueLengthLimit;
    if (limit <= 0)
      return import_api5.diag.warn(`Attribute value limit must be positive, got ${limit}`), value;
    if (typeof value === "string")
      return this._truncateToLimitUtil(value, limit);
    if (Array.isArray(value))
      return value.map((val) => typeof val === "string" ? this._truncateToLimitUtil(val, limit) : val);
    return value;
  }
}
