// function: wrapWithSoftWrap
function wrapWithSoftWrap(plainText, maxWidth, textWrap) {
  if (textWrap !== "wrap" && textWrap !== "wrap-trim")
    return {
      wrapped: wrapText2(plainText, maxWidth, textWrap),
      softWrap: void 0
    };
  let origLines = plainText.split(`
`), outLines = [], softWrap = [];
  for (let orig of origLines) {
    let pieces = wrapText2(orig, maxWidth, textWrap).split(`
`);
    for (let i4 = 0;i4 < pieces.length; i4++)
      outLines.push(pieces[i4]), softWrap.push(i4 > 0);
  }
  return { wrapped: outLines.join(`
`), softWrap };
}
