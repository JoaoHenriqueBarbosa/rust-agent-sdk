// function: withFormatting
function withFormatting(text, edit, options) {
  if (!options.formattingOptions)
    return [edit];
  let newText = applyEdit(text, edit), begin = edit.offset, end = edit.offset + edit.content.length;
  if (edit.length === 0 || edit.content.length === 0) {
    while (begin > 0 && !isEOL(newText, begin - 1))
      begin--;
    while (end < newText.length && !isEOL(newText, end))
      end++;
  }
  let edits = format2(newText, { offset: begin, length: end - begin }, { ...options.formattingOptions, keepLines: !1 });
  for (let i2 = edits.length - 1;i2 >= 0; i2--) {
    let edit2 = edits[i2];
    newText = applyEdit(newText, edit2), begin = Math.min(begin, edit2.offset), end = Math.max(end, edit2.offset + edit2.length), end += edit2.content.length - edit2.length;
  }
  let editLength = text.length - (newText.length - end) - begin;
  return [{ offset: begin, length: editLength, content: newText.substring(begin, end) }];
}
