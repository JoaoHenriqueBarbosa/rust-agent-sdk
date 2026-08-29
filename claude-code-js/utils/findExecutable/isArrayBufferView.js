// function: isArrayBufferView
function isArrayBufferView(val) {
  let result;
  if (typeof ArrayBuffer < "u" && ArrayBuffer.isView)
    result = ArrayBuffer.isView(val);
  else
    result = val && val.buffer && isArrayBuffer2(val.buffer);
  return result;
}
