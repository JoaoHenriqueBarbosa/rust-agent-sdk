// function: parseDimension
function parseDimension(v2) {
  if (v2 === void 0)
    return UNDEFINED_VALUE;
  if (v2 === "auto")
    return AUTO_VALUE;
  if (typeof v2 === "number")
    return Number.isFinite(v2) ? pointValue(v2) : UNDEFINED_VALUE;
  if (typeof v2 === "string" && v2.endsWith("%"))
    return percentValue(parseFloat(v2));
  let n5 = parseFloat(v2);
  return isNaN(n5) ? UNDEFINED_VALUE : pointValue(n5);
}
