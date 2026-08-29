// Original: src/vim/motions.ts
function resolveMotion(key3, cursor, count4) {
  let result = cursor;
  for (let i5 = 0;i5 < count4; i5++) {
    let next2 = applySingleMotion(key3, result);
    if (next2.equals(result))
      break;
    result = next2;
  }
  return result;
}
function applySingleMotion(key3, cursor) {
  switch (key3) {
    case "h":
      return cursor.left();
    case "l":
      return cursor.right();
    case "j":
      return cursor.downLogicalLine();
    case "k":
      return cursor.upLogicalLine();
    case "gj":
      return cursor.down();
    case "gk":
      return cursor.up();
    case "w":
      return cursor.nextVimWord();
    case "b":
      return cursor.prevVimWord();
    case "e":
      return cursor.endOfVimWord();
    case "W":
      return cursor.nextWORD();
    case "B":
      return cursor.prevWORD();
    case "E":
      return cursor.endOfWORD();
    case "0":
      return cursor.startOfLogicalLine();
    case "^":
      return cursor.firstNonBlankInLogicalLine();
    case "$":
      return cursor.endOfLogicalLine();
    case "G":
      return cursor.startOfLastLine();
    default:
      return cursor;
  }
}
function isInclusiveMotion(key3) {
  return "eE$".includes(key3);
}
function isLinewiseMotion(key3) {
  return "jkG".includes(key3) || key3 === "gg";
}
