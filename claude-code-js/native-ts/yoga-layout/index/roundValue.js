// function: roundValue
function roundValue(v2, scale, forceCeil, forceFloor) {
  let scaled = v2 * scale, frac = scaled - Math.floor(scaled);
  if (frac < 0)
    frac += 1;
  if (frac < 0.0001)
    scaled = Math.floor(scaled);
  else if (frac > 0.9999)
    scaled = Math.ceil(scaled);
  else if (forceCeil)
    scaled = Math.ceil(scaled);
  else if (forceFloor)
    scaled = Math.floor(scaled);
  else
    scaled = Math.floor(scaled) + (frac >= 0.4999 ? 1 : 0);
  return scaled / scale;
}
