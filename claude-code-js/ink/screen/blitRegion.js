// function: blitRegion
function blitRegion(dst, src, regionX, regionY, maxX, maxY) {
  if (regionX = Math.max(0, regionX), regionY = Math.max(0, regionY), regionX >= maxX || regionY >= maxY)
    return;
  let rowLen = maxX - regionX, srcStride = src.width << 1, dstStride = dst.width << 1, rowBytes = rowLen << 1, srcCells = src.cells, dstCells = dst.cells, srcNoSel = src.noSelect, dstNoSel = dst.noSelect;
  if (dst.softWrap.set(src.softWrap.subarray(regionY, maxY), regionY), regionX === 0 && maxX === src.width && src.width === dst.width) {
    let srcStart = regionY * srcStride, totalBytes = (maxY - regionY) * srcStride;
    dstCells.set(srcCells.subarray(srcStart, srcStart + totalBytes), srcStart);
    let nsStart = regionY * src.width, nsLen = (maxY - regionY) * src.width;
    dstNoSel.set(srcNoSel.subarray(nsStart, nsStart + nsLen), nsStart);
  } else {
    let srcRowCI = regionY * srcStride + (regionX << 1), dstRowCI = regionY * dstStride + (regionX << 1), srcRowNS = regionY * src.width + regionX, dstRowNS = regionY * dst.width + regionX;
    for (let y2 = regionY;y2 < maxY; y2++)
      dstCells.set(srcCells.subarray(srcRowCI, srcRowCI + rowBytes), dstRowCI), dstNoSel.set(srcNoSel.subarray(srcRowNS, srcRowNS + rowLen), dstRowNS), srcRowCI += srcStride, dstRowCI += dstStride, srcRowNS += src.width, dstRowNS += dst.width;
  }
  let regionRect = {
    x: regionX,
    y: regionY,
    width: rowLen,
    height: maxY - regionY
  };
  if (dst.damage)
    dst.damage = unionRect(dst.damage, regionRect);
  else
    dst.damage = regionRect;
  if (maxX < dst.width) {
    let srcLastCI = regionY * src.width + (maxX - 1) << 1, dstSpacerCI = regionY * dst.width + maxX << 1, wroteSpacerOutsideRegion = !1;
    for (let y2 = regionY;y2 < maxY; y2++) {
      if ((srcCells[srcLastCI + 1] & WIDTH_MASK) === 1 /* Wide */)
        dstCells[dstSpacerCI] = SPACER_CHAR_INDEX, dstCells[dstSpacerCI + 1] = packWord1(dst.emptyStyleId, 0, 2 /* SpacerTail */), wroteSpacerOutsideRegion = !0;
      srcLastCI += srcStride, dstSpacerCI += dstStride;
    }
    if (wroteSpacerOutsideRegion && dst.damage) {
      if (dst.damage.x + dst.damage.width === maxX)
        dst.damage = { ...dst.damage, width: dst.damage.width + 1 };
    }
  }
}
