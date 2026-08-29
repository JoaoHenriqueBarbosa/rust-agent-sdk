// Original: src/utils/zodToJsonSchema.ts
function zodToJsonSchema3(schema5) {
  let hit = cache5.get(schema5);
  if (hit)
    return hit;
  let result = toJSONSchema(schema5);
  return cache5.set(schema5, result), result;
}
var cache5;
var init_zodToJsonSchema2 = __esm(() => {
  init_v4();
  cache5 = /* @__PURE__ */ new WeakMap;
});
