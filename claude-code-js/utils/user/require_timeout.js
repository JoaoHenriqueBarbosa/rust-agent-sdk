// var: require_timeout
var require_timeout = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.callWithTimeout = exports.TimeoutError = void 0;

  class TimeoutError extends Error {
    constructor(message) {
      super(message);
      Object.setPrototypeOf(this, TimeoutError.prototype);
    }
  }
  exports.TimeoutError = TimeoutError;
  function callWithTimeout(promise3, timeout) {
    let timeoutHandle, timeoutPromise = new Promise(function(_resolve, reject2) {
      timeoutHandle = setTimeout(function() {
        reject2(new TimeoutError("Operation timed out."));
      }, timeout);
    });
    return Promise.race([promise3, timeoutPromise]).then((result) => {
      return clearTimeout(timeoutHandle), result;
    }, (reason) => {
      throw clearTimeout(timeoutHandle), reason;
    });
  }
  exports.callWithTimeout = callWithTimeout;
});
