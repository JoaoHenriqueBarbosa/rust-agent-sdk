// function: applyEdits
function applyEdits(text, edits) {
  let sortedEdits = edits.slice(0).sort((a2, b) => {
    let diff = a2.offset - b.offset;
    if (diff === 0)
      return a2.length - b.length;
    return diff;
  }), lastModifiedOffset = text.length;
  for (let i2 = sortedEdits.length - 1;i2 >= 0; i2--) {
    let e = sortedEdits[i2];
    if (e.offset + e.length <= lastModifiedOffset)
      text = applyEdit(text, e);
    else
      throw Error("Overlapping edit");
    lastModifiedOffset = e.offset;
  }
  return text;
}
