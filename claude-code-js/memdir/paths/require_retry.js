// var: require_retry
var require_retry = __commonJS((exports) => {
  var RetryOperation = require_retry_operation();
  exports.operation = function(options) {
    var timeouts = exports.timeouts(options);
    return new RetryOperation(timeouts, {
      forever: options && options.forever,
      unref: options && options.unref,
      maxRetryTime: options && options.maxRetryTime
    });
  };
  exports.timeouts = function(options) {
    if (options instanceof Array)
      return [].concat(options);
    var opts = {
      retries: 10,
      factor: 2,
      minTimeout: 1000,
      maxTimeout: 1 / 0,
      randomize: !1
    };
    for (var key in options)
      opts[key] = options[key];
    if (opts.minTimeout > opts.maxTimeout)
      throw Error("minTimeout is greater than maxTimeout");
    var timeouts = [];
    for (var i4 = 0;i4 < opts.retries; i4++)
      timeouts.push(this.createTimeout(i4, opts));
    if (options && options.forever && !timeouts.length)
      timeouts.push(this.createTimeout(i4, opts));
    return timeouts.sort(function(a2, b) {
      return a2 - b;
    }), timeouts;
  };
  exports.createTimeout = function(attempt, opts) {
    var random = opts.randomize ? Math.random() + 1 : 1, timeout = Math.round(random * opts.minTimeout * Math.pow(opts.factor, attempt));
    return timeout = Math.min(timeout, opts.maxTimeout), timeout;
  };
  exports.wrap = function(obj, options, methods) {
    if (options instanceof Array)
      methods = options, options = null;
    if (!methods) {
      methods = [];
      for (var key in obj)
        if (typeof obj[key] === "function")
          methods.push(key);
    }
    for (var i4 = 0;i4 < methods.length; i4++) {
      var method = methods[i4], original = obj[method];
      obj[method] = function(original2) {
        var op = exports.operation(options), args = Array.prototype.slice.call(arguments, 1), callback = args.pop();
        args.push(function(err) {
          if (op.retry(err))
            return;
          if (err)
            arguments[0] = op.mainError();
          callback.apply(this, arguments);
        }), op.attempt(function() {
          original2.apply(obj, args);
        });
      }.bind(obj, original), obj[method].options = options;
    }
  };
});
