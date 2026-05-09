// function: trimTrailingNewlines
function trimTrailingNewlines(string5) {
  var indexEnd = string5.length;
  while (indexEnd > 0 && string5[indexEnd - 1] === `
`)
    indexEnd--;
  return string5.substring(0, indexEnd);
}
