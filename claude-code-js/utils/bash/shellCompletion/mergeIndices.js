// function: mergeIndices
function mergeIndices(indices) {
  if (indices.length <= 1)
    return indices;
  indices.sort((a2, b) => a2[0] - b[0] || a2[1] - b[1]);
  let merged = [indices[0]];
  for (let i5 = 1, len = indices.length;i5 < len; i5 += 1) {
    let last2 = merged[merged.length - 1], curr = indices[i5];
    if (curr[0] <= last2[1] + 1)
      last2[1] = Math.max(last2[1], curr[1]);
    else
      merged.push(curr);
  }
  return merged;
}
