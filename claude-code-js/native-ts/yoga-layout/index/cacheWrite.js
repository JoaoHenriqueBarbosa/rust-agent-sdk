// function: cacheWrite
function cacheWrite(node, aW, aH, wM, hM, oW, oH, fW, fH, wasDirty) {
  if (!node._cIn)
    node._cIn = new Float64Array(CACHE_SLOTS * 8), node._cOut = new Float64Array(CACHE_SLOTS * 2);
  if (wasDirty && node._cGen !== _generation)
    node._cN = 0, node._cWr = 0;
  let i4 = node._cWr++ % CACHE_SLOTS;
  if (node._cN < CACHE_SLOTS)
    node._cN = node._cWr;
  let o5 = i4 * 8, cIn = node._cIn;
  cIn[o5] = aW, cIn[o5 + 1] = aH, cIn[o5 + 2] = wM, cIn[o5 + 3] = hM, cIn[o5 + 4] = oW, cIn[o5 + 5] = oH, cIn[o5 + 6] = fW ? 1 : 0, cIn[o5 + 7] = fH ? 1 : 0, node._cOut[i4 * 2] = node.layout.width, node._cOut[i4 * 2 + 1] = node.layout.height, node._cGen = _generation;
}
