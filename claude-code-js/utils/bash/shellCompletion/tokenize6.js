// function: tokenize6
function tokenize6(pattern) {
  let tokens = [], len = pattern.length, i5 = 0;
  while (i5 < len) {
    while (i5 < len && pattern[i5] === " ")
      i5++;
    if (i5 >= len)
      break;
    let j4 = i5;
    while (j4 < len && pattern[j4] !== " " && pattern[j4] !== '"')
      j4++;
    if (j4 < len && pattern[j4] === '"') {
      j4++;
      while (j4 < len) {
        if (pattern[j4] === '"') {
          let next2 = j4 + 1;
          if (next2 >= len || pattern[next2] === " ") {
            j4++;
            break;
          }
          if (pattern[next2] === "$" && (next2 + 1 >= len || pattern[next2 + 1] === " ")) {
            j4 += 2;
            break;
          }
        }
        j4++;
      }
      tokens.push(pattern.substring(i5, j4)), i5 = j4;
    } else {
      while (j4 < len && pattern[j4] !== " ")
        j4++;
      tokens.push(pattern.substring(i5, j4)), i5 = j4;
    }
  }
  return tokens;
}
