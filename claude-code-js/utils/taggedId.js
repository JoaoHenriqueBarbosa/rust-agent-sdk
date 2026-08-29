// Original: src/utils/taggedId.ts
function base58Encode(n5) {
  let base2 = BigInt(58), result = Array(22).fill("1"), i5 = 21, value = n5;
  while (value > 0n) {
    let rem = Number(value % base2);
    result[i5] = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"[rem], value = value / base2, i5--;
  }
  return result.join("");
}
function uuidToBigInt(uuid8) {
  let hex = uuid8.replace(/-/g, "");
  if (hex.length !== 32)
    throw Error(`Invalid UUID hex length: ${hex.length}`);
  return BigInt("0x" + hex);
}
function toTaggedId(tag2, uuid8) {
  let n5 = uuidToBigInt(uuid8);
  return `${tag2}_01${base58Encode(n5)}`;
}
