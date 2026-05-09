// function: diffEach
function diffEach(prev, next, cb) {
  let prevWidth = prev.width, nextWidth = next.width, prevHeight = prev.height, nextHeight = next.height, region;
  if (prevWidth === 0 && prevHeight === 0)
    region = { x: 0, y: 0, width: nextWidth, height: nextHeight };
  else if (next.damage) {
    if (region = next.damage, prev.damage)
      region = unionRect(region, prev.damage);
  } else if (prev.damage)
    region = prev.damage;
  else
    region = { x: 0, y: 0, width: 0, height: 0 };
  if (prevHeight > nextHeight)
    region = unionRect(region, {
      x: 0,
      y: nextHeight,
      width: prevWidth,
      height: prevHeight - nextHeight
    });
  if (prevWidth > nextWidth)
    region = unionRect(region, {
      x: nextWidth,
      y: 0,
      width: prevWidth - nextWidth,
      height: prevHeight
    });
  let maxHeight = Math.max(prevHeight, nextHeight), maxWidth = Math.max(prevWidth, nextWidth), endY = Math.min(region.y + region.height, maxHeight), endX = Math.min(region.x + region.width, maxWidth);
  if (prevWidth === nextWidth)
    return diffSameWidth(prev, next, region.x, endX, region.y, endY, cb);
  return diffDifferentWidth(prev, next, region.x, endX, region.y, endY, cb);
}
