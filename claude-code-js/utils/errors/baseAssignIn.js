// function: baseAssignIn
function baseAssignIn(object, source) {
  return object && _copyObject_default(source, keysIn_default(source), object);
}
