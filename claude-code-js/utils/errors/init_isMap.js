// var: init_isMap
var init_isMap = __esm(() => {
  init__baseIsMap();
  init__baseUnary();
  init__nodeUtil();
  nodeIsMap = _nodeUtil_default && _nodeUtil_default.isMap, isMap = nodeIsMap ? _baseUnary_default(nodeIsMap) : _baseIsMap_default, isMap_default = isMap;
});
