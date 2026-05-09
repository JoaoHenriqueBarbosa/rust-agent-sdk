// function: zip
function zip(data, opts, cb) {
  if (!cb)
    cb = opts, opts = {};
  if (typeof cb != "function")
    err(7);
  var r4 = {};
  fltn(data, "", r4, opts);
  var k3 = Object.keys(r4), lft = k3.length, o5 = 0, tot = 0, slft = lft, files = Array(lft), term = [], tAll = function() {
    for (var i6 = 0;i6 < term.length; ++i6)
      term[i6]();
  }, cbd = function(a2, b) {
    mt(function() {
      cb(a2, b);
    });
  };
  mt(function() {
    cbd = cb;
  });
  var cbf = function() {
    var out = new u8(tot + 22), oe = o5, cdl = tot - o5;
    tot = 0;
    for (var i6 = 0;i6 < slft; ++i6) {
      var f = files[i6];
      try {
        var l3 = f.c.length;
        wzh(out, tot, f, f.f, f.u, l3);
        var badd = 30 + f.f.length + exfl(f.extra), loc = tot + badd;
        out.set(f.c, loc), wzh(out, o5, f, f.f, f.u, l3, tot, f.m), o5 += 16 + badd + (f.m ? f.m.length : 0), tot = loc + l3;
      } catch (e) {
        return cbd(e, null);
      }
    }
    wzf(out, o5, files.length, cdl, oe), cbd(null, out);
  };
  if (!lft)
    cbf();
  var _loop_1 = function(i6) {
    var fn = k3[i6], _a3 = r4[fn], file2 = _a3[0], p4 = _a3[1], c3 = crc(), size = file2.length;
    c3.p(file2);
    var f = strToU8(fn), s2 = f.length, com = p4.comment, m4 = com && strToU8(com), ms = m4 && m4.length, exl = exfl(p4.extra), compression = p4.level == 0 ? 0 : 8, cbl = function(e, d) {
      if (e)
        tAll(), cbd(e, null);
      else {
        var l3 = d.length;
        if (files[i6] = mrg(p4, {
          size,
          crc: c3.d(),
          c: d,
          f,
          m: m4,
          u: s2 != fn.length || m4 && com.length != ms,
          compression
        }), o5 += 30 + s2 + exl + l3, tot += 76 + 2 * (s2 + exl) + (ms || 0) + l3, !--lft)
          cbf();
      }
    };
    if (s2 > 65535)
      cbl(err(11, 0, 1), null);
    if (!compression)
      cbl(null, file2);
    else if (size < 160000)
      try {
        cbl(null, deflateSync(file2, p4));
      } catch (e) {
        cbl(e, null);
      }
    else
      term.push(deflate(file2, p4, cbl));
  };
  for (var i5 = 0;i5 < slft; ++i5)
    _loop_1(i5);
  return tAll;
}
