// function: overlapCount
function overlapCount(a2, b) {
  var startA = 0;
  if (a2.length > b.length)
    startA = a2.length - b.length;
  var endB = b.length;
  if (a2.length < b.length)
    endB = a2.length;
  var map8 = Array(endB), k3 = 0;
  map8[0] = 0;
  for (var j4 = 1;j4 < endB; j4++) {
    if (b[j4] == b[k3])
      map8[j4] = map8[k3];
    else
      map8[j4] = k3;
    while (k3 > 0 && b[j4] != b[k3])
      k3 = map8[k3];
    if (b[j4] == b[k3])
      k3++;
  }
  k3 = 0;
  for (var i5 = startA;i5 < a2.length; i5++) {
    while (k3 > 0 && a2[i5] != b[k3])
      k3 = map8[k3];
    if (a2[i5] == b[k3])
      k3++;
  }
  return k3;
}
