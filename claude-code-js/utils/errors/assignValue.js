// function: assignValue
function assignValue(object, key, value) {
  var objValue = object[key];
  if (!(hasOwnProperty10.call(object, key) && eq_default(objValue, value)) || value === void 0 && !(key in object))
    _baseAssignValue_default(object, key, value);
}
