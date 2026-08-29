// Original: src/utils/set.ts
function every(a2, b) {
  for (let item of a2)
    if (!b.has(item))
      return !1;
  return !0;
}
