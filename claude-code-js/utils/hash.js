// Original: src/utils/hash.ts
function djb2Hash(str) {
  let hash = 0;
  for (let i2 = 0;i2 < str.length; i2++)
    hash = (hash << 5) - hash + str.charCodeAt(i2) | 0;
  return hash;
}
function hashContent(content) {
  if (typeof Bun < "u")
    return Bun.hash(content).toString();
  return __require("crypto").createHash("sha256").update(content).digest("hex");
}
function hashPair(a2, b) {
  if (typeof Bun < "u")
    return Bun.hash(b, Bun.hash(a2)).toString();
  return __require("crypto").createHash("sha256").update(a2).update("\x00").update(b).digest("hex");
}
