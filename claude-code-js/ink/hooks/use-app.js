// Original: src/ink/hooks/use-app.ts
var import_react17, useApp = () => import_react17.useContext(AppContext_default), use_app_default;
var init_use_app = __esm(() => {
  init_AppContext();
  import_react17 = __toESM(require_react_development(), 1), use_app_default = useApp;
});

// node_modules/lodash.debounce/index.js
var require_lodash8 = __commonJS((exports, module) => {
  var FUNC_ERROR_TEXT4 = "Expected a function", NAN2 = NaN, symbolTag5 = "[object Symbol]", reTrim = /^\s+|\s+$/g, reIsBadHex2 = /^[-+]0x[0-9a-f]+$/i, reIsBinary2 = /^0b[01]+$/i, reIsOctal2 = /^0o[0-7]+$/i, freeParseInt2 = parseInt, freeGlobal2 = typeof global == "object" && global && global.Object === Object && global, freeSelf2 = typeof self == "object" && self && self.Object === Object && self, root2 = freeGlobal2 || freeSelf2 || Function("return this")(), objectProto17 = Object.prototype, objectToString4 = objectProto17.toString, nativeMax3 = Math.max, nativeMin2 = Math.min, now2 = function() {
    return root2.Date.now();
  };
  function debounce2(func, wait, options) {
    var lastArgs, lastThis, maxWait, result, timerId, lastCallTime, lastInvokeTime = 0, leading = !1, maxing = !1, trailing = !0;
    if (typeof func != "function")
      throw TypeError(FUNC_ERROR_TEXT4);
    if (wait = toNumber2(wait) || 0, isObject6(options))
      leading = !!options.leading, maxing = "maxWait" in options, maxWait = maxing ? nativeMax3(toNumber2(options.maxWait) || 0, wait) : maxWait, trailing = "trailing" in options ? !!options.trailing : trailing;
    function invokeFunc(time3) {
      var args = lastArgs, thisArg = lastThis;
      return lastArgs = lastThis = void 0, lastInvokeTime = time3, result = func.apply(thisArg, args), result;
    }
    function leadingEdge2(time3) {
      return lastInvokeTime = time3, timerId = setTimeout(timerExpired, wait), leading ? invokeFunc(time3) : result;
    }
    function remainingWait(time3) {
      var timeSinceLastCall = time3 - lastCallTime, timeSinceLastInvoke = time3 - lastInvokeTime, result2 = wait - timeSinceLastCall;
      return maxing ? nativeMin2(result2, maxWait - timeSinceLastInvoke) : result2;
    }
    function shouldInvoke(time3) {
      var timeSinceLastCall = time3 - lastCallTime, timeSinceLastInvoke = time3 - lastInvokeTime;
      return lastCallTime === void 0 || timeSinceLastCall >= wait || timeSinceLastCall < 0 || maxing && timeSinceLastInvoke >= maxWait;
    }
    function timerExpired() {
      var time3 = now2();
      if (shouldInvoke(time3))
        return trailingEdge2(time3);
      timerId = setTimeout(timerExpired, remainingWait(time3));
    }
    function trailingEdge2(time3) {
      if (timerId = void 0, trailing && lastArgs)
        return invokeFunc(time3);
      return lastArgs = lastThis = void 0, result;
    }
    function cancel() {
      if (timerId !== void 0)
        clearTimeout(timerId);
      lastInvokeTime = 0, lastArgs = lastCallTime = lastThis = timerId = void 0;
    }
    function flush() {
      return timerId === void 0 ? result : trailingEdge2(now2());
    }
    function debounced() {
      var time3 = now2(), isInvoking = shouldInvoke(time3);
      if (lastArgs = arguments, lastThis = this, lastCallTime = time3, isInvoking) {
        if (timerId === void 0)
          return leadingEdge2(lastCallTime);
        if (maxing)
          return timerId = setTimeout(timerExpired, wait), invokeFunc(lastCallTime);
      }
      if (timerId === void 0)
        timerId = setTimeout(timerExpired, wait);
      return result;
    }
    return debounced.cancel = cancel, debounced.flush = flush, debounced;
  }
  function isObject6(value) {
    var type = typeof value;
    return !!value && (type == "object" || type == "function");
  }
  function isObjectLike2(value) {
    return !!value && typeof value == "object";
  }
  function isSymbol2(value) {
    return typeof value == "symbol" || isObjectLike2(value) && objectToString4.call(value) == symbolTag5;
  }
  function toNumber2(value) {
    if (typeof value == "number")
      return value;
    if (isSymbol2(value))
      return NAN2;
    if (isObject6(value)) {
      var other = typeof value.valueOf == "function" ? value.valueOf() : value;
      value = isObject6(other) ? other + "" : other;
    }
    if (typeof value != "string")
      return value === 0 ? value : +value;
    value = value.replace(reTrim, "");
    var isBinary = reIsBinary2.test(value);
    return isBinary || reIsOctal2.test(value) ? freeParseInt2(value.slice(2), isBinary ? 2 : 8) : reIsBadHex2.test(value) ? NAN2 : +value;
  }
  module.exports = debounce2;
});

// node_modules/usehooks-ts/dist/index.js
function useInterval(callback, delay4) {
  let savedCallback = import_react18.useRef(callback);
  useIsomorphicLayoutEffect(() => {
    savedCallback.current = callback;
  }, [callback]), import_react18.useEffect(() => {
    if (delay4 === null)
      return;
    let id = setInterval(() => {
      savedCallback.current();
    }, delay4);
    return () => {
      clearInterval(id);
    };
  }, [delay4]);
}
function useEventCallback(fn) {
  let ref = import_react18.useRef(() => {
    throw Error("Cannot call an event handler while rendering.");
  });
  return useIsomorphicLayoutEffect(() => {
    ref.current = fn;
  }, [fn]), import_react18.useCallback((...args) => {
    var _a2;
    return (_a2 = ref.current) == null ? void 0 : _a2.call(ref, ...args);
  }, [ref]);
}
function useUnmount(func) {
  let funcRef = import_react18.useRef(func);
  funcRef.current = func, import_react18.useEffect(() => () => {
    funcRef.current();
  }, []);
}
function useDebounceCallback(func, delay4 = 500, options) {
  let debouncedFunc = import_react18.useRef();
  useUnmount(() => {
    if (debouncedFunc.current)
      debouncedFunc.current.cancel();
  });
  let debounced = import_react18.useMemo(() => {
    let debouncedFuncInstance = import_lodash.default(func, delay4, options), wrappedFunc = (...args) => {
      return debouncedFuncInstance(...args);
    };
    return wrappedFunc.cancel = () => {
      debouncedFuncInstance.cancel();
    }, wrappedFunc.isPending = () => {
      return !!debouncedFunc.current;
    }, wrappedFunc.flush = () => {
      return debouncedFuncInstance.flush();
    }, wrappedFunc;
  }, [func, delay4, options]);
  return import_react18.useEffect(() => {
    debouncedFunc.current = import_lodash.default(func, delay4, options);
  }, [func, delay4, options]), debounced;
}
var import_react18, import_lodash, useIsomorphicLayoutEffect;
var init_dist4 = __esm(() => {
  import_react18 = __toESM(require_react_development(), 1), import_lodash = __toESM(require_lodash8(), 1), useIsomorphicLayoutEffect = typeof window < "u" ? import_react18.useLayoutEffect : import_react18.useEffect;
});
