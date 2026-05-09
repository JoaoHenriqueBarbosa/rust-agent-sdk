// function: uint32ArrayFrom
function uint32ArrayFrom(a_lookUpTable) {
  if (!Uint32Array.from) {
    var return_array = new Uint32Array(a_lookUpTable.length), a_index = 0;
    while (a_index < a_lookUpTable.length)
      return_array[a_index] = a_lookUpTable[a_index], a_index += 1;
    return return_array;
  }
  return Uint32Array.from(a_lookUpTable);
}
