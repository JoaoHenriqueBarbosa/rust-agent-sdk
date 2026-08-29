// function: isEndOfTagSection
function isEndOfTagSection(c3) {
  return c3 === CharCodes2.Slash || c3 === CharCodes2.Gt || isWhitespace(c3);
}
