// function: extend4
function extend4(destination) {
  for (var i5 = 1;i5 < arguments.length; i5++) {
    var source = arguments[i5];
    for (var key3 in source)
      if (Object.prototype.hasOwnProperty.call(source, key3))
        destination[key3] = source[key3];
  }
  return destination;
}
