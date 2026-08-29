// function: baseIsMap
function baseIsMap(value) {
  return isObjectLike_default(value) && _getTag_default(value) == mapTag5;
}
