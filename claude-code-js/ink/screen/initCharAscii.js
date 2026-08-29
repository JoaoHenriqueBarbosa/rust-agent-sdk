// function: initCharAscii
function initCharAscii() {
  let table = new Int32Array(128);
  return table.fill(-1), table[32] = EMPTY_CHAR_INDEX, table;
}
