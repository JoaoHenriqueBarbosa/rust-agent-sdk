// var: require_utils11
var require_utils11 = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.equalsCaseInsensitive = exports.binarySearchUB = exports.setEquals = exports.callWithTimeout = exports.TimeoutError = exports.instrumentationScopeId = exports.hashAttributes = void 0;
  function hashAttributes(attributes) {
    let keys2 = Object.keys(attributes);
    if (keys2.length === 0)
      return "";
    return keys2 = keys2.sort(), JSON.stringify(keys2.map((key2) => [key2, attributes[key2]]));
  }
  exports.hashAttributes = hashAttributes;
  function instrumentationScopeId(instrumentationScope) {
    return `${instrumentationScope.name}:${instrumentationScope.version ?? ""}:${instrumentationScope.schemaUrl ?? ""}`;
  }
  exports.instrumentationScopeId = instrumentationScopeId;

  class TimeoutError extends Error {
    constructor(message) {
      super(message);
      Object.setPrototypeOf(this, TimeoutError.prototype);
    }
  }
  exports.TimeoutError = TimeoutError;
  function callWithTimeout3(promise3, timeout) {
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
  exports.callWithTimeout = callWithTimeout3;
  function setEquals(lhs, rhs) {
    if (lhs.size !== rhs.size)
      return !1;
    for (let item of lhs)
      if (!rhs.has(item))
        return !1;
    return !0;
  }
  exports.setEquals = setEquals;
  function binarySearchUB(arr, value) {
    let lo = 0, hi = arr.length - 1, ret = arr.length;
    while (hi >= lo) {
      let mid = lo + Math.trunc((hi - lo) / 2);
      if (arr[mid] < value)
        lo = mid + 1;
      else
        ret = mid, hi = mid - 1;
    }
    return ret;
  }
  exports.binarySearchUB = binarySearchUB;
  function equalsCaseInsensitive(lhs, rhs) {
    return lhs.toLowerCase() === rhs.toLowerCase();
  }
  exports.equalsCaseInsensitive = equalsCaseInsensitive;
});
