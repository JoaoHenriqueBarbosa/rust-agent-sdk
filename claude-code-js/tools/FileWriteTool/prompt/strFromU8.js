// function: strFromU8
function strFromU8(dat, latin1) {
  if (latin1) {
    var r4 = "";
    for (var i5 = 0;i5 < dat.length; i5 += 16384)
      r4 += String.fromCharCode.apply(null, dat.subarray(i5, i5 + 16384));
    return r4;
  } else if (td)
    return td.decode(dat);
  else {
    var _a3 = dutf8(dat), s2 = _a3.s, r4 = _a3.r;
    if (r4.length)
      err(8);
    return s2;
  }
}
