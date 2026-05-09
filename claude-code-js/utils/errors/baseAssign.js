// function: baseAssign
function baseAssign(object, source) {
  return object && _copyObject_default(source, keys_default(source), object);
}
