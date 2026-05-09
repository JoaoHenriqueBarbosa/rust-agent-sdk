// function: strToU8
function strToU8(str, latin1) {
  if (latin1) {
    var ar_1 = new u8(str.length);
    for (var i5 = 0;i5 < str.length; ++i5)
      ar_1[i5] = str.charCodeAt(i5);
    return ar_1;
  }
  if (te)
    return te.encode(str);
  var l3 = str.length, ar = new u8(str.length + (str.length >> 1)), ai = 0, w2 = function(v2) {
    ar[ai++] = v2;
  };
  for (var i5 = 0;i5 < l3; ++i5) {
    if (ai + 5 > ar.length) {
      var n5 = new u8(ai + 8 + (l3 - i5 << 1));
      n5.set(ar), ar = n5;
    }
    var c3 = str.charCodeAt(i5);
    if (c3 < 128 || latin1)
      w2(c3);
    else if (c3 < 2048)
      w2(192 | c3 >> 6), w2(128 | c3 & 63);
    else if (c3 > 55295 && c3 < 57344)
      c3 = 65536 + (c3 & 1047552) | str.charCodeAt(++i5) & 1023, w2(240 | c3 >> 18), w2(128 | c3 >> 12 & 63), w2(128 | c3 >> 6 & 63), w2(128 | c3 & 63);
    else
      w2(224 | c3 >> 12), w2(128 | c3 >> 6 & 63), w2(128 | c3 & 63);
  }
  return slc(ar, 0, ai);
}
