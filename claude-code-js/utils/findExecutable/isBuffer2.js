// function: isBuffer2
function isBuffer2(val) {
  return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor) && isFunction2(val.constructor.isBuffer) && val.constructor.isBuffer(val);
}
