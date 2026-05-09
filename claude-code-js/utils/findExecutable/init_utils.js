// var: init_utils
var init_utils = __esm(() => {
  ({ toString: toString3 } = Object.prototype), { getPrototypeOf } = Object, { iterator, toStringTag } = Symbol, kindOf = ((cache) => (thing) => {
    let str = toString3.call(thing);
    return cache[str] || (cache[str] = str.slice(8, -1).toLowerCase());
  })(Object.create(null)), { isArray: isArray3 } = Array, isUndefined = typeOfTest("undefined");
  isArrayBuffer2 = kindOfTest("ArrayBuffer");
  isString = typeOfTest("string"), isFunction2 = typeOfTest("function"), isNumber = typeOfTest("number"), isDate = kindOfTest("Date"), isFile = kindOfTest("File"), isBlob = kindOfTest("Blob"), isFileList = kindOfTest("FileList");
  G2 = getGlobal(), FormDataCtor = typeof G2.FormData < "u" ? G2.FormData : void 0, isURLSearchParams = kindOfTest("URLSearchParams"), [isReadableStream3, isRequest, isResponse, isHeaders] = [
    "ReadableStream",
    "Request",
    "Response",
    "Headers"
  ].map(kindOfTest);
  _global = (() => {
    if (typeof globalThis < "u")
      return globalThis;
    return typeof self < "u" ? self : typeof window < "u" ? window : global;
  })();
  isTypedArray2 = ((TypedArray) => {
    return (thing) => {
      return TypedArray && thing instanceof TypedArray;
    };
  })(typeof Uint8Array < "u" && getPrototypeOf(Uint8Array)), isHTMLForm = kindOfTest("HTMLFormElement"), hasOwnProperty14 = (({ hasOwnProperty: hasOwnProperty15 }) => (obj, prop) => hasOwnProperty15.call(obj, prop))(Object.prototype), isRegExp = kindOfTest("RegExp");
  isAsyncFn = kindOfTest("AsyncFunction"), _setImmediate = ((setImmediateSupported, postMessageSupported) => {
    if (setImmediateSupported)
      return setImmediate;
    return postMessageSupported ? ((token, callbacks) => {
      return _global.addEventListener("message", ({ source, data }) => {
        if (source === _global && data === token)
          callbacks.length && callbacks.shift()();
      }, !1), (cb) => {
        callbacks.push(cb), _global.postMessage(token, "*");
      };
    })(`axios@${Math.random()}`, []) : (cb) => setTimeout(cb);
  })(typeof setImmediate === "function", isFunction2(_global.postMessage)), asap = typeof queueMicrotask < "u" ? queueMicrotask.bind(_global) : typeof process < "u" && process.nextTick || _setImmediate, utils_default = {
    isArray: isArray3,
    isArrayBuffer: isArrayBuffer2,
    isBuffer: isBuffer2,
    isFormData,
    isArrayBufferView,
    isString,
    isNumber,
    isBoolean,
    isObject: isObject4,
    isPlainObject: isPlainObject4,
    isEmptyObject,
    isReadableStream: isReadableStream3,
    isRequest,
    isResponse,
    isHeaders,
    isUndefined,
    isDate,
    isFile,
    isReactNativeBlob,
    isReactNative,
    isBlob,
    isRegExp,
    isFunction: isFunction2,
    isStream: isStream2,
    isURLSearchParams,
    isTypedArray: isTypedArray2,
    isFileList,
    forEach,
    merge: merge2,
    extend: extend2,
    trim,
    stripBOM: stripBOM2,
    inherits,
    toFlatObject,
    kindOf,
    kindOfTest,
    endsWith,
    toArray,
    forEachEntry,
    matchAll,
    isHTMLForm,
    hasOwnProperty: hasOwnProperty14,
    hasOwnProp: hasOwnProperty14,
    reduceDescriptors,
    freezeMethods,
    toObjectSet,
    toCamelCase,
    noop: noop5,
    toFiniteNumber,
    findKey,
    global: _global,
    isContextDefined,
    isSpecCompliantForm,
    toJSONObject,
    isAsyncFn,
    isThenable,
    setImmediate: _setImmediate,
    asap,
    isIterable
  };
});
