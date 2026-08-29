// function: baseIsSet
function baseIsSet(value) {
  return isObjectLike_default(value) && _getTag_default(value) == setTag5;
}
