// function: byteAt
function byteAt(L2, charIdx) {
  if (L2.byteTable)
    return L2.byteTable[charIdx];
  let t2 = new Uint32Array(L2.len + 1), b = 0, i5 = 0;
  while (i5 < L2.len) {
    t2[i5] = b;
    let c3 = L2.src.charCodeAt(i5);
    if (c3 < 128)
      b++, i5++;
    else if (c3 < 2048)
      b += 2, i5++;
    else if (c3 >= 55296 && c3 <= 56319)
      t2[i5 + 1] = b + 2, b += 4, i5 += 2;
    else
      b += 3, i5++;
  }
  return t2[L2.len] = b, L2.byteTable = t2, t2[charIdx];
}
