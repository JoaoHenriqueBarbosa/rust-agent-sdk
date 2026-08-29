// function: keysIn
function keysIn(object) {
  return isArrayLike_default(object) ? _arrayLikeKeys_default(object, !0) : _baseKeysIn_default(object);
}
