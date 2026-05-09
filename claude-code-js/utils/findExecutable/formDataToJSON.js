// function: formDataToJSON
function formDataToJSON(formData) {
  function buildPath(path9, value, target, index) {
    let name = path9[index++];
    if (name === "__proto__")
      return !0;
    let isNumericKey = Number.isFinite(+name), isLast = index >= path9.length;
    if (name = !name && utils_default.isArray(target) ? target.length : name, isLast) {
      if (utils_default.hasOwnProp(target, name))
        target[name] = [target[name], value];
      else
        target[name] = value;
      return !isNumericKey;
    }
    if (!target[name] || !utils_default.isObject(target[name]))
      target[name] = [];
    if (buildPath(path9, value, target[name], index) && utils_default.isArray(target[name]))
      target[name] = arrayToObject(target[name]);
    return !isNumericKey;
  }
  if (utils_default.isFormData(formData) && utils_default.isFunction(formData.entries)) {
    let obj = {};
    return utils_default.forEachEntry(formData, (name, value) => {
      buildPath(parsePropPath(name), value, obj, 0);
    }), obj;
  }
  return null;
}
