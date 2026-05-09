// Original: src/ink/line-width-cache.ts
function lineWidth(line) {
  let cached2 = cache4.get(line);
  if (cached2 !== void 0)
    return cached2;
  let width = stringWidth(line);
  if (cache4.size >= MAX_CACHE_SIZE2)
    cache4.clear();
  return cache4.set(line, width), width;
}
var cache4, MAX_CACHE_SIZE2 = 4096;
var init_line_width_cache = __esm(() => {
  init_stringWidth();
  cache4 = /* @__PURE__ */ new Map;
});
