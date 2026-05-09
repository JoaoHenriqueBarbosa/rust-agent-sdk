// Original: src/ink/layout/geometry.ts
function unionRect(a2, b) {
  let minX = Math.min(a2.x, b.x), minY = Math.min(a2.y, b.y), maxX = Math.max(a2.x + a2.width, b.x + b.width), maxY = Math.max(a2.y + a2.height, b.y + b.height);
  return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
}
function clamp(value, min, max) {
  if (min !== void 0 && value < min)
    return min;
  if (max !== void 0 && value > max)
    return max;
  return value;
}
var init_geometry = () => {};
