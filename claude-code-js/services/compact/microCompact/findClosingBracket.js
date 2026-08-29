// function: findClosingBracket
function findClosingBracket(str, b) {
  if (str.indexOf(b[1]) === -1)
    return -1;
  let level = 0;
  for (let i5 = 0;i5 < str.length; i5++)
    if (str[i5] === "\\")
      i5++;
    else if (str[i5] === b[0])
      level++;
    else if (str[i5] === b[1]) {
      if (level--, level < 0)
        return i5;
    }
  if (level > 0)
    return -2;
  return -1;
}
