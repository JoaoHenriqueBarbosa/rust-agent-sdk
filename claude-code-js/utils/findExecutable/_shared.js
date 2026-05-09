// Shared module state and imports
// Original: src/utils/findExecutable.ts

// node_modules/axios/lib/helpers/bind.js

// node_modules/axios/lib/utils.js
var toString3, getPrototypeOf, iterator, toStringTag, kindOf, kindOfTest = (type) => {
  return type = type.toLowerCase(), (thing) => kindOf(thing) === type;
}, typeOfTest = (type) => (thing) => typeof thing === type, isArray3, isUndefined, isArrayBuffer2, isString, isFunction2, isNumber, isObject4 = (thing) => thing !== null && typeof thing === "object", isBoolean = (thing) => thing === !0 || thing === !1, isPlainObject4 = (val) => {
  if (kindOf(val) !== "object")
    return !1;
  let prototype = getPrototypeOf(val);
  return (prototype === null || prototype === Object.prototype || Object.getPrototypeOf(prototype) === null) && !(toStringTag in val) && !(iterator in val);
}, isEmptyObject = (val) => {
  if (!isObject4(val) || isBuffer2(val))
    return !1;
  try {
    return Object.keys(val).length === 0 && Object.getPrototypeOf(val) === Object.prototype;
  } catch (e) {
    return !1;
  }
}, isDate, isFile, isReactNativeBlob = (value) => {
  return !!(value && typeof value.uri < "u");
}, isReactNative = (formData) => formData && typeof formData.getParts < "u", isBlob, isFileList, isStream2 = (val) => isObject4(val) && isFunction2(val.pipe), G2, FormDataCtor, isFormData = (thing) => {
  let kind;
  return thing && (FormDataCtor && thing instanceof FormDataCtor || isFunction2(thing.append) && ((kind = kindOf(thing)) === "formdata" || kind === "object" && isFunction2(thing.toString) && thing.toString() === "[object FormData]"));
}, isURLSearchParams, isReadableStream3, isRequest, isResponse, isHeaders, trim = (str) => {
  return str.trim ? str.trim() : str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
}, _global, isContextDefined = (context) => !isUndefined(context) && context !== _global, extend2 = (a2, b, thisArg, { allOwnKeys } = {}) => {
  return forEach(b, (val, key) => {
    if (thisArg && isFunction2(val))
      Object.defineProperty(a2, key, {
        value: bind(val, thisArg),
        writable: !0,
        enumerable: !0,
        configurable: !0
      });
    else
      Object.defineProperty(a2, key, {
        value: val,
        writable: !0,
        enumerable: !0,
        configurable: !0
      });
  }, { allOwnKeys }), a2;
}, stripBOM2 = (content) => {
  if (content.charCodeAt(0) === 65279)
    content = content.slice(1);
  return content;
}, inherits = (constructor, superConstructor, props, descriptors2) => {
  constructor.prototype = Object.create(superConstructor.prototype, descriptors2), Object.defineProperty(constructor.prototype, "constructor", {
    value: constructor,
    writable: !0,
    enumerable: !1,
    configurable: !0
  }), Object.defineProperty(constructor, "super", {
    value: superConstructor.prototype
  }), props && Object.assign(constructor.prototype, props);
}, toFlatObject = (sourceObj, destObj, filter, propFilter) => {
  let props, i2, prop, merged = {};
  if (destObj = destObj || {}, sourceObj == null)
    return destObj;
  do {
    props = Object.getOwnPropertyNames(sourceObj), i2 = props.length;
    while (i2-- > 0)
      if (prop = props[i2], (!propFilter || propFilter(prop, sourceObj, destObj)) && !merged[prop])
        destObj[prop] = sourceObj[prop], merged[prop] = !0;
    sourceObj = filter !== !1 && getPrototypeOf(sourceObj);
  } while (sourceObj && (!filter || filter(sourceObj, destObj)) && sourceObj !== Object.prototype);
  return destObj;
}, endsWith = (str, searchString, position) => {
  if (str = String(str), position === void 0 || position > str.length)
    position = str.length;
  position -= searchString.length;
  let lastIndex = str.indexOf(searchString, position);
  return lastIndex !== -1 && lastIndex === position;
}, toArray = (thing) => {
  if (!thing)
    return null;
  if (isArray3(thing))
    return thing;
  let i2 = thing.length;
  if (!isNumber(i2))
    return null;
  let arr = Array(i2);
  while (i2-- > 0)
    arr[i2] = thing[i2];
  return arr;
}, isTypedArray2, forEachEntry = (obj, fn) => {
  let _iterator = (obj && obj[iterator]).call(obj), result;
  while ((result = _iterator.next()) && !result.done) {
    let pair = result.value;
    fn.call(obj, pair[0], pair[1]);
  }
}, matchAll = (regExp, str) => {
  let matches, arr = [];
  while ((matches = regExp.exec(str)) !== null)
    arr.push(matches);
  return arr;
}, isHTMLForm, toCamelCase = (str) => {
  return str.toLowerCase().replace(/[-_\s]([a-z\d])(\w*)/g, function(m, p1, p2) {
    return p1.toUpperCase() + p2;
  });
}, hasOwnProperty14, isRegExp, reduceDescriptors = (obj, reducer) => {
  let descriptors2 = Object.getOwnPropertyDescriptors(obj), reducedDescriptors = {};
  forEach(descriptors2, (descriptor, name) => {
    let ret;
    if ((ret = reducer(descriptor, name, obj)) !== !1)
      reducedDescriptors[name] = ret || descriptor;
  }), Object.defineProperties(obj, reducedDescriptors);
}, freezeMethods = (obj) => {
  reduceDescriptors(obj, (descriptor, name) => {
    if (isFunction2(obj) && ["arguments", "caller", "callee"].indexOf(name) !== -1)
      return !1;
    let value = obj[name];
    if (!isFunction2(value))
      return;
    if (descriptor.enumerable = !1, "writable" in descriptor) {
      descriptor.writable = !1;
      return;
    }
    if (!descriptor.set)
      descriptor.set = () => {
        throw Error("Can not rewrite read-only method '" + name + "'");
      };
  });
}, toObjectSet = (arrayOrString, delimiter) => {
  let obj = {}, define2 = (arr) => {
    arr.forEach((value) => {
      obj[value] = !0;
    });
  };
  return isArray3(arrayOrString) ? define2(arrayOrString) : define2(String(arrayOrString).split(delimiter)), obj;
}, noop5 = () => {}, toFiniteNumber = (value, defaultValue) => {
  return value != null && Number.isFinite(value = +value) ? value : defaultValue;
}, toJSONObject = (obj) => {
  let stack = Array(10), visit2 = (source, i2) => {
    if (isObject4(source)) {
      if (stack.indexOf(source) >= 0)
        return;
      if (isBuffer2(source))
        return source;
      if (!("toJSON" in source)) {
        stack[i2] = source;
        let target = isArray3(source) ? [] : {};
        return forEach(source, (value, key) => {
          let reducedValue = visit2(value, i2 + 1);
          !isUndefined(reducedValue) && (target[key] = reducedValue);
        }), stack[i2] = void 0, target;
      }
    }
    return source;
  };
  return visit2(obj, 0);
}, isAsyncFn, isThenable = (thing) => thing && (isObject4(thing) || isFunction2(thing)) && isFunction2(thing.then) && isFunction2(thing.catch), _setImmediate, asap, isIterable = (thing) => thing != null && isFunction2(thing[iterator]), utils_default;

// node_modules/axios/lib/core/AxiosError.js
var AxiosError, AxiosError_default;

// node_modules/delayed-stream/lib/delayed_stream.js

// node_modules/combined-stream/lib/combined_stream.js

// node_modules/form-data/node_modules/mime-types/node_modules/mime-db/db.json

// node_modules/form-data/node_modules/mime-types/node_modules/mime-db/index.js

// node_modules/form-data/node_modules/mime-types/index.js

// node_modules/asynckit/lib/defer.js

// node_modules/asynckit/lib/async.js

// node_modules/asynckit/lib/abort.js

// node_modules/asynckit/lib/iterate.js

// node_modules/asynckit/lib/state.js

// node_modules/asynckit/lib/terminator.js

// node_modules/asynckit/parallel.js

// node_modules/asynckit/serialOrdered.js

// node_modules/asynckit/serial.js

// node_modules/asynckit/index.js

// node_modules/es-object-atoms/index.js

// node_modules/es-errors/index.js

// node_modules/es-errors/eval.js

// node_modules/es-errors/range.js

// node_modules/es-errors/ref.js

// node_modules/es-errors/syntax.js

// node_modules/es-errors/type.js

// node_modules/es-errors/uri.js

// node_modules/math-intrinsics/abs.js

// node_modules/math-intrinsics/floor.js

// node_modules/math-intrinsics/max.js

// node_modules/math-intrinsics/min.js

// node_modules/math-intrinsics/pow.js

// node_modules/math-intrinsics/round.js

// node_modules/math-intrinsics/isNaN.js

// node_modules/math-intrinsics/sign.js

// node_modules/gopd/gOPD.js

// node_modules/gopd/index.js

// node_modules/es-define-property/index.js

// node_modules/has-symbols/shams.js

// node_modules/has-symbols/index.js

// node_modules/get-proto/Reflect.getPrototypeOf.js

// node_modules/get-proto/Object.getPrototypeOf.js

// node_modules/function-bind/implementation.js

// node_modules/function-bind/index.js

// node_modules/call-bind-apply-helpers/functionCall.js

// node_modules/call-bind-apply-helpers/functionApply.js

// node_modules/call-bind-apply-helpers/reflectApply.js

// node_modules/call-bind-apply-helpers/actualApply.js

// node_modules/call-bind-apply-helpers/index.js

// node_modules/dunder-proto/get.js

// node_modules/get-proto/index.js

// node_modules/hasown/index.js

// node_modules/get-intrinsic/index.js

// node_modules/has-tostringtag/shams.js

// node_modules/es-set-tostringtag/index.js

// node_modules/form-data/lib/populate.js

// node_modules/form-data/lib/form_data.js

// node_modules/axios/lib/platform/node/classes/FormData.js
var import_form_data, FormData_default;

// node_modules/axios/lib/helpers/toFormData.js
var predicates, toFormData_default;

// node_modules/axios/lib/helpers/AxiosURLSearchParams.js
var prototype, AxiosURLSearchParams_default;

// node_modules/axios/lib/helpers/buildURL.js

// node_modules/axios/lib/core/InterceptorManager.js
var InterceptorManager_default;

// node_modules/axios/lib/defaults/transitional.js
var transitional_default;

// node_modules/axios/lib/platform/node/classes/URLSearchParams.js
import url2 from "url";
var URLSearchParams_default;

// node_modules/axios/lib/platform/node/index.js
import crypto2 from "crypto";

// node_modules/axios/lib/platform/common/utils.js
__export(exports_utils, {
  origin: () => origin,
  navigator: () => _navigator,
  hasStandardBrowserWebWorkerEnv: () => hasStandardBrowserWebWorkerEnv,
  hasStandardBrowserEnv: () => hasStandardBrowserEnv,
  hasBrowserEnv: () => hasBrowserEnv
});
var hasBrowserEnv, _navigator, hasStandardBrowserEnv, hasStandardBrowserWebWorkerEnv, origin;

// node_modules/axios/lib/platform/index.js
var platform_default;

// node_modules/axios/lib/helpers/toURLEncodedForm.js

// node_modules/axios/lib/helpers/formDataToJSON.js
var formDataToJSON_default;

// node_modules/axios/lib/defaults/index.js
var defaults, defaults_default;

// node_modules/axios/lib/helpers/parseHeaders.js
var ignoreDuplicateOf, parseHeaders_default = (rawHeaders) => {
  let parsed = {}, key, val, i2;
  return rawHeaders && rawHeaders.split(`
`).forEach(function(line) {
    if (i2 = line.indexOf(":"), key = line.substring(0, i2).trim().toLowerCase(), val = line.substring(i2 + 1).trim(), !key || parsed[key] && ignoreDuplicateOf[key])
      return;
    if (key === "set-cookie")
      if (parsed[key])
        parsed[key].push(val);
      else
        parsed[key] = [val];
    else
      parsed[key] = parsed[key] ? parsed[key] + ", " + val : val;
  }), parsed;
};

// node_modules/axios/lib/core/AxiosHeaders.js
var $internals, isValidHeaderName = (str) => /^[-_a-zA-Z0-9^`|~,!#$%&'*+.]+$/.test(str.trim()), AxiosHeaders, AxiosHeaders_default;

// node_modules/axios/lib/core/transformData.js

// node_modules/axios/lib/cancel/isCancel.js

// node_modules/axios/lib/cancel/CanceledError.js
var CanceledError, CanceledError_default;

// node_modules/axios/lib/core/settle.js

// node_modules/axios/lib/helpers/isAbsoluteURL.js

// node_modules/axios/lib/helpers/combineURLs.js

// node_modules/axios/lib/core/buildFullPath.js

// node_modules/proxy-from-env/index.js
var DEFAULT_PORTS;

// node_modules/ms/index.js

// node_modules/debug/src/common.js

// node_modules/debug/src/browser.js

// node_modules/has-flag/index.js

// node_modules/supports-color/index.js

// node_modules/debug/src/node.js

// node_modules/debug/src/index.js

// node_modules/follow-redirects/debug.js

// node_modules/follow-redirects/index.js

// node_modules/axios/lib/env/data.js

// node_modules/axios/lib/helpers/fromDataURI.js
var DATA_URL_PATTERN;

// node_modules/axios/lib/helpers/AxiosTransformStream.js
import stream from "stream";
var kInternals, AxiosTransformStream, AxiosTransformStream_default;

// node_modules/axios/lib/helpers/readBlob.js
var asyncIterator, readBlob = async function* (blob) {
  if (blob.stream)
    yield* blob.stream();
  else if (blob.arrayBuffer)
    yield await blob.arrayBuffer();
  else if (blob[asyncIterator])
    yield* blob[asyncIterator]();
  else
    yield blob;
}, readBlob_default;

// node_modules/axios/lib/helpers/formDataToStream.js
import util from "util";
import { Readable as Readable4 } from "stream";

var BOUNDARY_ALPHABET, textEncoder3, CRLF = `\r
`, CRLF_BYTES, CRLF_BYTES_COUNT = 2, formDataToStream = (form, headersHandler, options) => {
  let {
    tag = "form-data-boundary",
    size = 25,
    boundary = tag + "-" + platform_default.generateString(size, BOUNDARY_ALPHABET)
  } = options || {};
  if (!utils_default.isFormData(form))
    throw TypeError("FormData instance required");
  if (boundary.length < 1 || boundary.length > 70)
    throw Error("boundary must be 10-70 characters long");
  let boundaryBytes = textEncoder3.encode("--" + boundary + CRLF), footerBytes = textEncoder3.encode("--" + boundary + "--" + CRLF), contentLength = footerBytes.byteLength, parts = Array.from(form.entries()).map(([name, value]) => {
    let part = new FormDataPart(name, value);
    return contentLength += part.size, part;
  });
  contentLength += boundaryBytes.byteLength * parts.length, contentLength = utils_default.toFiniteNumber(contentLength);
  let computedHeaders = {
    "Content-Type": `multipart/form-data; boundary=${boundary}`
  };
  if (Number.isFinite(contentLength))
    computedHeaders["Content-Length"] = contentLength;
  return headersHandler && headersHandler(computedHeaders), Readable4.from(async function* () {
    for (let part of parts)
      yield boundaryBytes, yield* part.encode();
    yield footerBytes;
  }());
}, formDataToStream_default;

// node_modules/axios/lib/helpers/ZlibHeaderTransformStream.js
import stream2 from "stream";
var ZlibHeaderTransformStream, ZlibHeaderTransformStream_default;

// node_modules/axios/lib/helpers/callbackify.js

// node_modules/axios/lib/helpers/speedometer.js
var speedometer_default;

// node_modules/axios/lib/helpers/throttle.js
var throttle_default;

// node_modules/axios/lib/helpers/progressEventReducer.js

// node_modules/axios/lib/helpers/estimateDataURLDecodedBytes.js

// node_modules/axios/lib/adapters/http.js
import http from "http";
import https from "https";
import http2 from "http2";
import util2 from "util";
import zlib from "zlib";
import stream3 from "stream";
import { EventEmitter as EventEmitter2 } from "events";

var import_follow_redirects, zlibOptions, brotliOptions, isBrotliSupported, httpFollow, httpsFollow, isHttps, supportedProtocols, flushOnFinish = (stream4, [throttled, flush]) => {
  return stream4.on("end", flush).on("error", flush), throttled;
}, http2Sessions, isHttpAdapterSupported, wrapAsync = (asyncExecutor) => {
  return new Promise((resolve7, reject) => {
    let onDone, isDone, done = (value, isRejected) => {
      if (isDone)
        return;
      isDone = !0, onDone && onDone(value, isRejected);
    }, _resolve = (value) => {
      done(value), resolve7(value);
    }, _reject = (reason) => {
      done(reason, !0), reject(reason);
    };
    asyncExecutor(_resolve, _reject, (onDoneHandler) => onDone = onDoneHandler).catch(_reject);
  });
}, resolveFamily = ({ address, family }) => {
  if (!utils_default.isString(address))
    throw TypeError("address must be a string");
  return {
    address,
    family: family || (address.indexOf(".") < 0 ? 6 : 4)
  };
}, buildAddressEntry = (address, family) => resolveFamily(utils_default.isObject(address) ? address : { address, family }), http2Transport, http_default;

// node_modules/axios/lib/helpers/isURLSameOrigin.js
var isURLSameOrigin_default;

// node_modules/axios/lib/helpers/cookies.js
var cookies_default;

// node_modules/axios/lib/core/mergeConfig.js

// node_modules/axios/lib/helpers/resolveConfig.js

// node_modules/axios/lib/adapters/xhr.js
var isXHRAdapterSupported, xhr_default;

// node_modules/axios/lib/helpers/composeSignals.js

// node_modules/axios/lib/helpers/trackStream.js

// node_modules/axios/lib/adapters/fetch.js

// node_modules/axios/lib/adapters/adapters.js
var knownAdapters, renderReason = (reason) => `- ${reason}`, isResolvedHandle = (adapter2) => utils_default.isFunction(adapter2) || adapter2 === null || adapter2 === !1, adapters_default;

// node_modules/axios/lib/core/dispatchRequest.js

// node_modules/axios/lib/helpers/validator.js
var validators, deprecatedWarnings, validator_default;

// node_modules/axios/lib/core/Axios.js
var validators2, Axios_default;

// node_modules/axios/lib/cancel/CancelToken.js
var CancelToken_default;

// node_modules/axios/lib/helpers/spread.js

// node_modules/axios/lib/helpers/isAxiosError.js

// node_modules/axios/lib/helpers/HttpStatusCode.js
var HttpStatusCode, HttpStatusCode_default;

// node_modules/axios/lib/axios.js
var axios, axios_default;

// node_modules/axios/index.js
__export(exports_axios, {
  toFormData: () => toFormData2,
  spread: () => spread2,
  mergeConfig: () => mergeConfig2,
  isCancel: () => isCancel2,
  isAxiosError: () => isAxiosError2,
  getAdapter: () => getAdapter2,
  formToJSON: () => formToJSON,
  default: () => axios_default,
  all: () => all2,
  VERSION: () => VERSION3,
  HttpStatusCode: () => HttpStatusCode2,
  CanceledError: () => CanceledError2,
  CancelToken: () => CancelToken2,
  Cancel: () => Cancel,
  AxiosHeaders: () => AxiosHeaders2,
  AxiosError: () => AxiosError2,
  Axios: () => Axios2
});
var Axios2, AxiosError2, CanceledError2, isCancel2, CancelToken2, VERSION3, all2, Cancel, isAxiosError2, spread2, toFormData2, AxiosHeaders2, HttpStatusCode2, formToJSON, getAdapter2, mergeConfig2;

