// function: determineBranch
function determineBranch(decodeTree, current, nodeIndex, char) {
  let branchCount = (current & BinTrieFlags.BRANCH_LENGTH) >> 7, jumpOffset = current & BinTrieFlags.JUMP_TABLE;
  if (branchCount === 0)
    return jumpOffset !== 0 && char === jumpOffset ? nodeIndex : -1;
  if (jumpOffset) {
    let value = char - jumpOffset;
    return value < 0 || value >= branchCount ? -1 : decodeTree[nodeIndex + value] - 1;
  }
  let packedKeySlots = branchCount + 1 >> 1, lo = 0, hi = branchCount - 1;
  while (lo <= hi) {
    let mid = lo + hi >>> 1, slot = mid >> 1, midKey = decodeTree[nodeIndex + slot] >> (mid & 1) * 8 & 255;
    if (midKey < char)
      lo = mid + 1;
    else if (midKey > char)
      hi = mid - 1;
    else
      return decodeTree[nodeIndex + packedKeySlots + mid];
  }
  return -1;
}
