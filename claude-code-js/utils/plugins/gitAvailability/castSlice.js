// function: castSlice
function castSlice(array2, start, end) {
  var length = array2.length;
  return end = end === void 0 ? length : end, !start && end >= length ? array2 : _baseSlice_default(array2, start, end);
}
