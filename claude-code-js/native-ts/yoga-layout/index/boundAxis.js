// function: boundAxis
function boundAxis(style, isWidth, value, ownerWidth, ownerHeight) {
  let minV = isWidth ? style.minWidth : style.minHeight, maxV = isWidth ? style.maxWidth : style.maxHeight, minU = minV.unit, maxU = maxV.unit;
  if (minU === 0 && maxU === 0)
    return value;
  let owner = isWidth ? ownerWidth : ownerHeight, v2 = value;
  if (maxU === 1) {
    if (v2 > maxV.value)
      v2 = maxV.value;
  } else if (maxU === 2) {
    let m4 = maxV.value * owner / 100;
    if (m4 === m4 && v2 > m4)
      v2 = m4;
  }
  if (minU === 1) {
    if (v2 < minV.value)
      v2 = minV.value;
  } else if (minU === 2) {
    let m4 = minV.value * owner / 100;
    if (m4 === m4 && v2 < m4)
      v2 = m4;
  }
  return v2;
}
