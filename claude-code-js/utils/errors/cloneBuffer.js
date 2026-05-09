// function: cloneBuffer
function cloneBuffer(buffer, isDeep) {
  if (isDeep)
    return buffer.slice();
  var length = buffer.length, result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);
  return buffer.copy(result), result;
}
