// function: splitLines2
function splitLines2(text2) {
  var hasTrailingNl = text2.endsWith(`
`), result = text2.split(`
`).map(function(line) {
    return line + `
`;
  });
  if (hasTrailingNl)
    result.pop();
  else
    result.push(result.pop().slice(0, -1));
  return result;
}
