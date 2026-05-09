// Original: src/ink/node-cache.ts
function addPendingClear(parent, rect, isAbsolute5) {
  let existing = pendingClears.get(parent);
  if (existing)
    existing.push(rect);
  else
    pendingClears.set(parent, [rect]);
  if (isAbsolute5)
    absoluteNodeRemoved = !0;
}
function consumeAbsoluteRemovedFlag() {
  let had = absoluteNodeRemoved;
  return absoluteNodeRemoved = !1, had;
}
var nodeCache, pendingClears, absoluteNodeRemoved = !1;
var init_node_cache = __esm(() => {
  nodeCache = /* @__PURE__ */ new WeakMap, pendingClears = /* @__PURE__ */ new WeakMap;
});
