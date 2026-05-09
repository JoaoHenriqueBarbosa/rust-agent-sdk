// function: generateXAxisLabels
function generateXAxisLabels(data, _chartWidth, yAxisOffset) {
  if (data.length === 0)
    return "";
  let numLabels = Math.min(4, Math.max(2, Math.floor(data.length / 8))), usableLength = data.length - 6, step = Math.floor(usableLength / (numLabels - 1)) || 1, labelPositions = [];
  for (let i5 = 0;i5 < numLabels; i5++) {
    let idx = Math.min(i5 * step, data.length - 1), label = new Date(data[idx].date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric"
    });
    labelPositions.push({
      pos: idx,
      label
    });
  }
  let result = " ".repeat(yAxisOffset), currentPos = 0;
  for (let {
    pos,
    label
  } of labelPositions) {
    let spaces = Math.max(1, pos - currentPos);
    result += " ".repeat(spaces) + label, currentPos = pos + label.length;
  }
  return result;
}
