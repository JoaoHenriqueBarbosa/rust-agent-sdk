// function: edgeWhitespace
function edgeWhitespace(string5) {
  var m4 = string5.match(/^(([ \t\r\n]*)(\s*))(?:(?=\S)[\s\S]*\S)?((\s*?)([ \t\r\n]*))$/);
  return {
    leading: m4[1],
    leadingAscii: m4[2],
    leadingNonAscii: m4[3],
    trailing: m4[4],
    trailingNonAscii: m4[5],
    trailingAscii: m4[6]
  };
}
