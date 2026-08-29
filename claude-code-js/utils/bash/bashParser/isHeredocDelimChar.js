// function: isHeredocDelimChar
function isHeredocDelimChar(c3) {
  return c3 !== "" && c3 !== " " && c3 !== "\t" && c3 !== `
` && c3 !== "<" && c3 !== ">" && c3 !== "|" && c3 !== "&" && c3 !== ";" && c3 !== "(" && c3 !== ")" && c3 !== "'" && c3 !== '"' && c3 !== "`" && c3 !== "\\";
}
