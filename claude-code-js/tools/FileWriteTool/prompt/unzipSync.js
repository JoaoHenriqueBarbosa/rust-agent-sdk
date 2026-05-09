// function: unzipSync
function unzipSync(data, opts) {
  var files = {}, e = data.length - 22;
  for (;b4(data, e) != 101010256; --e)
    if (!e || data.length - e > 65558)
      err(13);
  var c3 = b2(data, e + 8);
  if (!c3)
    return {};
  var o5 = b4(data, e + 16), z2 = o5 == 4294967295 || c3 == 65535;
  if (z2) {
    var ze = b4(data, e - 12);
    if (z2 = b4(data, ze) == 101075792, z2)
      c3 = b4(data, ze + 32), o5 = b4(data, ze + 48);
  }
  var fltr = opts && opts.filter;
  for (var i5 = 0;i5 < c3; ++i5) {
    var _a3 = zh(data, o5, z2), c_2 = _a3[0], sc = _a3[1], su = _a3[2], fn = _a3[3], no = _a3[4], off = _a3[5], b = slzh(data, off);
    if (o5 = no, !fltr || fltr({
      name: fn,
      size: sc,
      originalSize: su,
      compression: c_2
    }))
      if (!c_2)
        files[fn] = slc(data, b, b + sc);
      else if (c_2 == 8)
        files[fn] = inflateSync(data.subarray(b, b + sc), { out: new u8(su) });
      else
        err(14, "unknown compression type " + c_2);
  }
  return files;
}
