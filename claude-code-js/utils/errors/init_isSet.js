// var: init_isSet
var init_isSet = __esm(() => {
  init__baseIsSet();
  init__baseUnary();
  init__nodeUtil();
  nodeIsSet = _nodeUtil_default && _nodeUtil_default.isSet, isSet = nodeIsSet ? _baseUnary_default(nodeIsSet) : _baseIsSet_default, isSet_default = isSet;
});
