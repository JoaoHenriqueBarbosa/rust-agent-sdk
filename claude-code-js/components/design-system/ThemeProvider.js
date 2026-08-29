// Original: src/components/design-system/ThemeProvider.tsx
function defaultInitialTheme() {
  return getGlobalConfig().theme;
}
function defaultSaveTheme(setting) {
  saveGlobalConfig((current) => ({
    ...current,
    theme: setting
  }));
}
function ThemeProvider({
  children,
  initialState,
  onThemeSave = defaultSaveTheme
}) {
  let [themeSetting, setThemeSetting] = import_react3.useState(initialState ?? defaultInitialTheme), [previewTheme, setPreviewTheme] = import_react3.useState(null), [systemTheme, setSystemTheme] = import_react3.useState(() => (initialState ?? themeSetting) === "auto" ? getSystemThemeName() : "dark"), activeSetting = previewTheme ?? themeSetting, {
    internal_querier
  } = use_stdin_default();
  import_react3.useEffect(() => {}, [activeSetting, internal_querier]);
  let currentTheme = activeSetting === "auto" ? systemTheme : activeSetting, value = import_react3.useMemo(() => ({
    themeSetting,
    setThemeSetting: (newSetting) => {
      if (setThemeSetting(newSetting), setPreviewTheme(null), newSetting === "auto")
        setSystemTheme(getSystemThemeName());
      onThemeSave?.(newSetting);
    },
    setPreviewTheme: (newSetting_0) => {
      if (setPreviewTheme(newSetting_0), newSetting_0 === "auto")
        setSystemTheme(getSystemThemeName());
    },
    savePreview: () => {
      if (previewTheme !== null)
        setThemeSetting(previewTheme), setPreviewTheme(null), onThemeSave?.(previewTheme);
    },
    cancelPreview: () => {
      if (previewTheme !== null)
        setPreviewTheme(null);
    },
    currentTheme
  }), [themeSetting, previewTheme, currentTheme, onThemeSave]);
  return /* @__PURE__ */ jsx_dev_runtime.jsxDEV(ThemeContext.Provider, {
    value,
    children
  }, void 0, !1, void 0, this);
}
function useTheme() {
  let $3 = import_compiler_runtime.c(3), {
    currentTheme,
    setThemeSetting
  } = import_react3.useContext(ThemeContext), t0;
  if ($3[0] !== currentTheme || $3[1] !== setThemeSetting)
    t0 = [currentTheme, setThemeSetting], $3[0] = currentTheme, $3[1] = setThemeSetting, $3[2] = t0;
  else
    t0 = $3[2];
  return t0;
}
function useThemeSetting() {
  return import_react3.useContext(ThemeContext).themeSetting;
}
function usePreviewTheme() {
  let $3 = import_compiler_runtime.c(4), {
    setPreviewTheme,
    savePreview,
    cancelPreview
  } = import_react3.useContext(ThemeContext), t0;
  if ($3[0] !== cancelPreview || $3[1] !== savePreview || $3[2] !== setPreviewTheme)
    t0 = {
      setPreviewTheme,
      savePreview,
      cancelPreview
    }, $3[0] = cancelPreview, $3[1] = savePreview, $3[2] = setPreviewTheme, $3[3] = t0;
  else
    t0 = $3[3];
  return t0;
}
var import_compiler_runtime, import_react3, jsx_dev_runtime, DEFAULT_THEME = "dark", ThemeContext;
var init_ThemeProvider = __esm(() => {
  init_use_stdin();
  init_config4();
  import_compiler_runtime = __toESM(require_react_compiler_runtime_development(), 1), import_react3 = __toESM(require_react_development(), 1), jsx_dev_runtime = __toESM(require_react_jsx_dev_runtime_development(), 1), ThemeContext = import_react3.createContext({
    themeSetting: DEFAULT_THEME,
    setThemeSetting: () => {},
    setPreviewTheme: () => {},
    savePreview: () => {},
    cancelPreview: () => {},
    currentTheme: DEFAULT_THEME
  });
});

// node_modules/auto-bind/index.js
function autoBind(self2, { include, exclude } = {}) {
  let filter2 = (key) => {
    let match = (pattern) => typeof pattern === "string" ? key === pattern : pattern.test(key);
    if (include)
      return include.some(match);
    if (exclude)
      return !exclude.some(match);
    return !0;
  };
  for (let [object2, key] of getAllProperties(self2.constructor.prototype)) {
    if (key === "constructor" || !filter2(key))
      continue;
    let descriptor = Reflect.getOwnPropertyDescriptor(object2, key);
    if (descriptor && typeof descriptor.value === "function")
      self2[key] = self2[key].bind(self2);
  }
  return self2;
}
var getAllProperties = (object2) => {
  let properties = /* @__PURE__ */ new Set;
  do
    for (let key of Reflect.ownKeys(object2))
      properties.add([object2, key]);
  while ((object2 = Reflect.getPrototypeOf(object2)) && object2 !== Object.prototype);
  return properties;
};

// node_modules/lodash-es/noop.js
function noop7() {}
var noop_default;
var init_noop = __esm(() => {
  noop_default = noop7;
});

// node_modules/lodash-es/now.js
var now = function() {
  return _root_default.Date.now();
}, now_default;
var init_now = __esm(() => {
  init__root();
  now_default = now;
});

// node_modules/lodash-es/_trimmedEndIndex.js
function trimmedEndIndex(string4) {
  var index = string4.length;
  while (index-- && reWhitespace.test(string4.charAt(index)))
    ;
  return index;
}
var reWhitespace, _trimmedEndIndex_default;
var init__trimmedEndIndex = __esm(() => {
  reWhitespace = /\s/;
  _trimmedEndIndex_default = trimmedEndIndex;
});

// node_modules/lodash-es/_baseTrim.js
function baseTrim(string4) {
  return string4 ? string4.slice(0, _trimmedEndIndex_default(string4) + 1).replace(reTrimStart, "") : string4;
}
var reTrimStart, _baseTrim_default;
var init__baseTrim = __esm(() => {
  init__trimmedEndIndex();
  reTrimStart = /^\s+/;
  _baseTrim_default = baseTrim;
});

// node_modules/lodash-es/toNumber.js
function toNumber(value) {
  if (typeof value == "number")
    return value;
  if (isSymbol_default(value))
    return NAN;
  if (isObject_default(value)) {
    var other = typeof value.valueOf == "function" ? value.valueOf() : value;
    value = isObject_default(other) ? other + "" : other;
  }
  if (typeof value != "string")
    return value === 0 ? value : +value;
  value = _baseTrim_default(value);
  var isBinary = reIsBinary.test(value);
  return isBinary || reIsOctal.test(value) ? freeParseInt(value.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value) ? NAN : +value;
}
var NAN = NaN, reIsBadHex, reIsBinary, reIsOctal, freeParseInt, toNumber_default;
var init_toNumber = __esm(() => {
  init__baseTrim();
  init_isObject();
  init_isSymbol();
  reIsBadHex = /^[-+]0x[0-9a-f]+$/i, reIsBinary = /^0b[01]+$/i, reIsOctal = /^0o[0-7]+$/i, freeParseInt = parseInt;
  toNumber_default = toNumber;
});

// node_modules/lodash-es/debounce.js
function debounce(func, wait, options) {
  var lastArgs, lastThis, maxWait, result, timerId, lastCallTime, lastInvokeTime = 0, leading = !1, maxing = !1, trailing = !0;
  if (typeof func != "function")
    throw TypeError(FUNC_ERROR_TEXT2);
  if (wait = toNumber_default(wait) || 0, isObject_default(options))
    leading = !!options.leading, maxing = "maxWait" in options, maxWait = maxing ? nativeMax2(toNumber_default(options.maxWait) || 0, wait) : maxWait, trailing = "trailing" in options ? !!options.trailing : trailing;
  function invokeFunc(time3) {
    var args = lastArgs, thisArg = lastThis;
    return lastArgs = lastThis = void 0, lastInvokeTime = time3, result = func.apply(thisArg, args), result;
  }
  function leadingEdge(time3) {
    return lastInvokeTime = time3, timerId = setTimeout(timerExpired, wait), leading ? invokeFunc(time3) : result;
  }
  function remainingWait(time3) {
    var timeSinceLastCall = time3 - lastCallTime, timeSinceLastInvoke = time3 - lastInvokeTime, timeWaiting = wait - timeSinceLastCall;
    return maxing ? nativeMin(timeWaiting, maxWait - timeSinceLastInvoke) : timeWaiting;
  }
  function shouldInvoke(time3) {
    var timeSinceLastCall = time3 - lastCallTime, timeSinceLastInvoke = time3 - lastInvokeTime;
    return lastCallTime === void 0 || timeSinceLastCall >= wait || timeSinceLastCall < 0 || maxing && timeSinceLastInvoke >= maxWait;
  }
  function timerExpired() {
    var time3 = now_default();
    if (shouldInvoke(time3))
      return trailingEdge(time3);
    timerId = setTimeout(timerExpired, remainingWait(time3));
  }
  function trailingEdge(time3) {
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
    return timerId === void 0 ? result : trailingEdge(now_default());
  }
  function debounced() {
    var time3 = now_default(), isInvoking = shouldInvoke(time3);
    if (lastArgs = arguments, lastThis = this, lastCallTime = time3, isInvoking) {
      if (timerId === void 0)
        return leadingEdge(lastCallTime);
      if (maxing)
        return clearTimeout(timerId), timerId = setTimeout(timerExpired, wait), invokeFunc(lastCallTime);
    }
    if (timerId === void 0)
      timerId = setTimeout(timerExpired, wait);
    return result;
  }
  return debounced.cancel = cancel, debounced.flush = flush, debounced;
}
var FUNC_ERROR_TEXT2 = "Expected a function", nativeMax2, nativeMin, debounce_default;
var init_debounce = __esm(() => {
  init_isObject();
  init_now();
  init_toNumber();
  nativeMax2 = Math.max, nativeMin = Math.min;
  debounce_default = debounce;
});

// node_modules/lodash-es/throttle.js
function throttle2(func, wait, options) {
  var leading = !0, trailing = !0;
  if (typeof func != "function")
    throw TypeError(FUNC_ERROR_TEXT3);
  if (isObject_default(options))
    leading = "leading" in options ? !!options.leading : leading, trailing = "trailing" in options ? !!options.trailing : trailing;
  return debounce_default(func, wait, {
    leading,
    maxWait: wait,
    trailing
  });
}
var FUNC_ERROR_TEXT3 = "Expected a function", throttle_default2;
var init_throttle2 = __esm(() => {
  init_debounce();
  init_isObject();
  throttle_default2 = throttle2;
});

// node_modules/react-reconciler/cjs/react-reconciler-constants.development.js
var require_react_reconciler_constants_development = __commonJS((exports) => {
  exports.ConcurrentRoot = 1, exports.ContinuousEventPriority = 8, exports.DefaultEventPriority = 32, exports.DiscreteEventPriority = 2, exports.IdleEventPriority = 268435456, exports.LegacyRoot = 0, exports.NoEventPriority = 0;
});
