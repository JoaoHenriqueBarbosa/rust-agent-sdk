// function: convertMaskToIndices
function convertMaskToIndices(matchmask = [], minMatchCharLength = Config2.minMatchCharLength) {
  let indices = [], start = -1, end = -1, i5 = 0;
  for (let len = matchmask.length;i5 < len; i5 += 1) {
    let match = matchmask[i5];
    if (match && start === -1)
      start = i5;
    else if (!match && start !== -1) {
      if (end = i5 - 1, end - start + 1 >= minMatchCharLength)
        indices.push([start, end]);
      start = -1;
    }
  }
  if (matchmask[i5 - 1] && i5 - start >= minMatchCharLength)
    indices.push([start, i5 - 1]);
  return indices;
}
