// function: baseIndexOf
function baseIndexOf(array2, value, fromIndex) {
  return value === value ? _strictIndexOf_default(array2, value, fromIndex) : _baseFindIndex_default(array2, _baseIsNaN_default, fromIndex);
}
