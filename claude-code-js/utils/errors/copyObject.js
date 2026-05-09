// function: copyObject
function copyObject(source, props, object, customizer) {
  var isNew = !object;
  object || (object = {});
  var index = -1, length = props.length;
  while (++index < length) {
    var key = props[index], newValue = customizer ? customizer(object[key], source[key], key, object, source) : void 0;
    if (newValue === void 0)
      newValue = source[key];
    if (isNew)
      _baseAssignValue_default(object, key, newValue);
    else
      _assignValue_default(object, key, newValue);
  }
  return object;
}
