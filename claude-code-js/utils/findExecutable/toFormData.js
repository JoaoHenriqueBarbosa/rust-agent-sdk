// function: toFormData
function toFormData(obj, formData, options) {
  if (!utils_default.isObject(obj))
    throw TypeError("target must be an object");
  formData = formData || new (FormData_default || FormData), options = utils_default.toFlatObject(options, {
    metaTokens: !0,
    dots: !1,
    indexes: !1
  }, !1, function(option, source) {
    return !utils_default.isUndefined(source[option]);
  });
  let metaTokens = options.metaTokens, visitor = options.visitor || defaultVisitor, dots = options.dots, indexes = options.indexes, useBlob = (options.Blob || typeof Blob < "u" && Blob) && utils_default.isSpecCompliantForm(formData);
  if (!utils_default.isFunction(visitor))
    throw TypeError("visitor must be a function");
  function convertValue(value) {
    if (value === null)
      return "";
    if (utils_default.isDate(value))
      return value.toISOString();
    if (utils_default.isBoolean(value))
      return value.toString();
    if (!useBlob && utils_default.isBlob(value))
      throw new AxiosError_default("Blob is not supported. Use a Buffer instead.");
    if (utils_default.isArrayBuffer(value) || utils_default.isTypedArray(value))
      return useBlob && typeof Blob === "function" ? new Blob([value]) : Buffer.from(value);
    return value;
  }
  function defaultVisitor(value, key, path9) {
    let arr = value;
    if (utils_default.isReactNative(formData) && utils_default.isReactNativeBlob(value))
      return formData.append(renderKey(path9, key, dots), convertValue(value)), !1;
    if (value && !path9 && typeof value === "object") {
      if (utils_default.endsWith(key, "{}"))
        key = metaTokens ? key : key.slice(0, -2), value = JSON.stringify(value);
      else if (utils_default.isArray(value) && isFlatArray(value) || (utils_default.isFileList(value) || utils_default.endsWith(key, "[]")) && (arr = utils_default.toArray(value)))
        return key = removeBrackets(key), arr.forEach(function(el, index) {
          !(utils_default.isUndefined(el) || el === null) && formData.append(indexes === !0 ? renderKey([key], index, dots) : indexes === null ? key : key + "[]", convertValue(el));
        }), !1;
    }
    if (isVisitable(value))
      return !0;
    return formData.append(renderKey(path9, key, dots), convertValue(value)), !1;
  }
  let stack = [], exposedHelpers = Object.assign(predicates, {
    defaultVisitor,
    convertValue,
    isVisitable
  });
  function build(value, path9) {
    if (utils_default.isUndefined(value))
      return;
    if (stack.indexOf(value) !== -1)
      throw Error("Circular reference detected in " + path9.join("."));
    stack.push(value), utils_default.forEach(value, function(el, key) {
      if ((!(utils_default.isUndefined(el) || el === null) && visitor.call(formData, el, utils_default.isString(key) ? key.trim() : key, path9, exposedHelpers)) === !0)
        build(el, path9 ? path9.concat(key) : [key]);
    }), stack.pop();
  }
  if (!utils_default.isObject(obj))
    throw TypeError("data must be an object");
  return build(obj), formData;
}
