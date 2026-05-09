// function: zipSync
function zipSync(data, opts) {
  if (!opts)
    opts = {};
  var r4 = {}, files = [];
  fltn(data, "", r4, opts);
  var o5 = 0, tot = 0;
  for (var fn in r4) {
    var _a3 = r4[fn], file2 = _a3[0], p4 = _a3[1], compression = p4.level == 0 ? 0 : 8, f = strToU8(fn), s2 = f.length, com = p4.comment, m4 = com && strToU8(com), ms = m4 && m4.length, exl = exfl(p4.extra);
    if (s2 > 65535)
      err(11);
    var d = compression ? deflateSync(file2, p4) : file2, l3 = d.length, c3 = crc();
    c3.p(file2), files.push(mrg(p4, {
      size: file2.length,
      crc: c3.d(),
      c: d,
      f,
      m: m4,
      u: s2 != fn.length || m4 && com.length != ms,
      o: o5,
      compression
    })), o5 += 30 + s2 + exl + l3, tot += 76 + 2 * (s2 + exl) + (ms || 0) + l3;
  }
  var out = new u8(tot + 22), oe = o5, cdl = tot - o5;
  for (var i5 = 0;i5 < files.length; ++i5) {
    var f = files[i5];
    wzh(out, f.o, f, f.f, f.u, f.c.length);
    var badd = 30 + f.f.length + exfl(f.extra);
    out.set(f.c, f.o + badd), wzh(out, o5, f, f.f, f.u, f.c.length, f.o, f.m), o5 += 16 + badd + (f.m ? f.m.length : 0);
  }
  return wzf(out, o5, files.length, cdl, oe), out;
}
