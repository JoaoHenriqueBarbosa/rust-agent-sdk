// function: peek2
function peek2(L2, off = 0) {
  return L2.i + off < L2.len ? L2.src[L2.i + off] : "";
}
