// function: rtrim
function rtrim(str, c3, invert) {
  let l3 = str.length;
  if (l3 === 0)
    return "";
  let suffLen = 0;
  while (suffLen < l3) {
    let currChar = str.charAt(l3 - suffLen - 1);
    if (currChar === c3 && !invert)
      suffLen++;
    else if (currChar !== c3 && invert)
      suffLen++;
    else
      break;
  }
  return str.slice(0, l3 - suffLen);
}
