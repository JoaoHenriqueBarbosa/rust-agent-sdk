// Original: src/utils/array.ts
function intersperse(as, separator) {
  return as.flatMap((a2, i2) => i2 ? [separator(i2), a2] : [a2]);
}
function count2(arr, pred) {
  let n2 = 0;
  for (let x of arr)
    n2 += +!!pred(x);
  return n2;
}
function uniq(xs) {
  return [...new Set(xs)];
}
