// function: baseZipObject
function baseZipObject(props, values3, assignFunc) {
  var index = -1, length = props.length, valsLength = values3.length, result = {};
  while (++index < length) {
    var value = index < valsLength ? values3[index] : void 0;
    assignFunc(result, props[index], value);
  }
  return result;
}
