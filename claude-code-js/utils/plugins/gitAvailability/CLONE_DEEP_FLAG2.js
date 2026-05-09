// var: CLONE_DEEP_FLAG2
var CLONE_DEEP_FLAG2 = 1, CLONE_FLAT_FLAG2 = 2, CLONE_SYMBOLS_FLAG2 = 4, omit2, omit_default;
var init_omit = __esm(() => {
  init__arrayMap();
  init__baseClone();
  init__baseUnset();
  init__castPath();
  init__copyObject();
  init__customOmitClone();
  init__flatRest();
  init__getAllKeysIn();
  omit2 = _flatRest_default(function(object2, paths2) {
    var result = {};
    if (object2 == null)
      return result;
    var isDeep = !1;
    if (paths2 = _arrayMap_default(paths2, function(path16) {
      return path16 = _castPath_default(path16, object2), isDeep || (isDeep = path16.length > 1), path16;
    }), _copyObject_default(object2, _getAllKeysIn_default(object2), result), isDeep)
      result = _baseClone_default(result, CLONE_DEEP_FLAG2 | CLONE_FLAT_FLAG2 | CLONE_SYMBOLS_FLAG2, _customOmitClone_default);
    var length = paths2.length;
    while (length--)
      _baseUnset_default(result, paths2[length]);
    return result;
  }), omit_default = omit2;
});
