// function: getEOL
function getEOL(options, text) {
  for (let i2 = 0;i2 < text.length; i2++) {
    let ch = text.charAt(i2);
    if (ch === "\r") {
      if (i2 + 1 < text.length && text.charAt(i2 + 1) === `
`)
        return `\r
`;
      return "\r";
    } else if (ch === `
`)
      return `
`;
  }
  return options && options.eol || `
`;
}
