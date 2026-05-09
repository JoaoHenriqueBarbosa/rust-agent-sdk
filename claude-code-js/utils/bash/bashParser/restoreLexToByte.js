// function: restoreLexToByte
function restoreLexToByte(P2, targetByte) {
  if (!P2.L.byteTable)
    byteAt(P2.L, 0);
  let t2 = P2.L.byteTable, lo = 0, hi = P2.src.length;
  while (lo < hi) {
    let m4 = lo + hi >>> 1;
    if (t2[m4] < targetByte)
      lo = m4 + 1;
    else
      hi = m4;
  }
  P2.L.i = lo, P2.L.b = targetByte;
}
