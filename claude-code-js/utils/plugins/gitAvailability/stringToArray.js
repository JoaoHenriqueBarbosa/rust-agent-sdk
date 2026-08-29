// function: stringToArray
function stringToArray(string4) {
  return _hasUnicode_default(string4) ? _unicodeToArray_default(string4) : _asciiToArray_default(string4);
}
