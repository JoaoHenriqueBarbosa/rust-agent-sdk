// function: splitCells
function splitCells(tableRow, count3) {
  let row = tableRow.replace(other.findPipe, (match, offset, str) => {
    let escaped = !1, curr = offset;
    while (--curr >= 0 && str[curr] === "\\")
      escaped = !escaped;
    if (escaped)
      return "|";
    else
      return " |";
  }), cells = row.split(other.splitPipe), i5 = 0;
  if (!cells[0].trim())
    cells.shift();
  if (cells.length > 0 && !cells.at(-1)?.trim())
    cells.pop();
  if (count3)
    if (cells.length > count3)
      cells.splice(count3);
    else
      while (cells.length < count3)
        cells.push("");
  for (;i5 < cells.length; i5++)
    cells[i5] = cells[i5].trim().replace(other.slashPipe, "|");
  return cells;
}
