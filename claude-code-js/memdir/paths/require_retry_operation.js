// var: require_retry_operation
var require_retry_operation = __commonJS((exports, module) => {
  function RetryOperation(timeouts, options) {
    if (typeof options === "boolean")
      options = { forever: options };
    if (this._originalTimeouts = JSON.parse(JSON.stringify(timeouts)), this._timeouts = timeouts, this._options = options || {}, this._maxRetryTime = options && options.maxRetryTime || 1 / 0, this._fn = null, this._errors = [], this._attempts = 1, this._operationTimeout = null, this._operationTimeoutCb = null, this._timeout = null, this._operationStart = null, this._options.forever)
      this._cachedTimeouts = this._timeouts.slice(0);
  }
  module.exports = RetryOperation;
  RetryOperation.prototype.reset = function() {
    this._attempts = 1, this._timeouts = this._originalTimeouts;
  };
  RetryOperation.prototype.stop = function() {
    if (this._timeout)
      clearTimeout(this._timeout);
    this._timeouts = [], this._cachedTimeouts = null;
  };
  RetryOperation.prototype.retry = function(err) {
    if (this._timeout)
      clearTimeout(this._timeout);
    if (!err)
      return !1;
    var currentTime = (/* @__PURE__ */ new Date()).getTime();
    if (err && currentTime - this._operationStart >= this._maxRetryTime)
      return this._errors.unshift(Error("RetryOperation timeout occurred")), !1;
    this._errors.push(err);
    var timeout = this._timeouts.shift();
    if (timeout === void 0)
      if (this._cachedTimeouts)
        this._errors.splice(this._errors.length - 1, this._errors.length), this._timeouts = this._cachedTimeouts.slice(0), timeout = this._timeouts.shift();
      else
        return !1;
    var self2 = this, timer = setTimeout(function() {
      if (self2._attempts++, self2._operationTimeoutCb) {
        if (self2._timeout = setTimeout(function() {
          self2._operationTimeoutCb(self2._attempts);
        }, self2._operationTimeout), self2._options.unref)
          self2._timeout.unref();
      }
      self2._fn(self2._attempts);
    }, timeout);
    if (this._options.unref)
      timer.unref();
    return !0;
  };
  RetryOperation.prototype.attempt = function(fn, timeoutOps) {
    if (this._fn = fn, timeoutOps) {
      if (timeoutOps.timeout)
        this._operationTimeout = timeoutOps.timeout;
      if (timeoutOps.cb)
        this._operationTimeoutCb = timeoutOps.cb;
    }
    var self2 = this;
    if (this._operationTimeoutCb)
      this._timeout = setTimeout(function() {
        self2._operationTimeoutCb();
      }, self2._operationTimeout);
    this._operationStart = (/* @__PURE__ */ new Date()).getTime(), this._fn(this._attempts);
  };
  RetryOperation.prototype.try = function(fn) {
    console.log("Using RetryOperation.try() is deprecated"), this.attempt(fn);
  };
  RetryOperation.prototype.start = function(fn) {
    console.log("Using RetryOperation.start() is deprecated"), this.attempt(fn);
  };
  RetryOperation.prototype.start = RetryOperation.prototype.try;
  RetryOperation.prototype.errors = function() {
    return this._errors;
  };
  RetryOperation.prototype.attempts = function() {
    return this._attempts;
  };
  RetryOperation.prototype.mainError = function() {
    if (this._errors.length === 0)
      return null;
    var counts = {}, mainError = null, mainErrorCount = 0;
    for (var i4 = 0;i4 < this._errors.length; i4++) {
      var error41 = this._errors[i4], message = error41.message, count3 = (counts[message] || 0) + 1;
      if (counts[message] = count3, count3 >= mainErrorCount)
        mainError = error41, mainErrorCount = count3;
    }
    return mainError;
  };
});
