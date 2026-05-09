// function: resolveEdges4Into
function resolveEdges4Into(edges, ownerSize, out) {
  let eH = edges[6], eV = edges[7], eA = edges[8], eS = edges[4], eE = edges[5], pctDenom = isNaN(ownerSize) ? NaN : ownerSize / 100, v2 = edges[0];
  if (v2.unit === 0)
    v2 = eH;
  if (v2.unit === 0)
    v2 = eA;
  if (v2.unit === 0)
    v2 = eS;
  if (out[0] = v2.unit === 1 ? v2.value : v2.unit === 2 ? v2.value * pctDenom : 0, v2 = edges[1], v2.unit === 0)
    v2 = eV;
  if (v2.unit === 0)
    v2 = eA;
  if (out[1] = v2.unit === 1 ? v2.value : v2.unit === 2 ? v2.value * pctDenom : 0, v2 = edges[2], v2.unit === 0)
    v2 = eH;
  if (v2.unit === 0)
    v2 = eA;
  if (v2.unit === 0)
    v2 = eE;
  if (out[2] = v2.unit === 1 ? v2.value : v2.unit === 2 ? v2.value * pctDenom : 0, v2 = edges[3], v2.unit === 0)
    v2 = eV;
  if (v2.unit === 0)
    v2 = eA;
  out[3] = v2.unit === 1 ? v2.value : v2.unit === 2 ? v2.value * pctDenom : 0;
}
