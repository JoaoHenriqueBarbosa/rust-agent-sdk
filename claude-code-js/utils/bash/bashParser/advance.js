// function: advance
function advance(L2) {
  let c3 = L2.src.charCodeAt(L2.i);
  if (L2.i++, c3 < 128)
    L2.b++;
  else if (c3 < 2048)
    L2.b += 2;
  else if (c3 >= 55296 && c3 <= 56319)
    L2.b += 4, L2.i++;
  else
    L2.b += 3;
}
