// function: unzip
function unzip(data, opts, cb) {
  if (!cb)
    cb = opts, opts = {};
  if (typeof cb != "function")
    err(7);
  var term = [], tAll = function() {
    for (var i6 = 0;i6 < term.length; ++i6)
      term[i6]();
  }, files = {}, cbd = function(a2, b) {
    mt(function() {
      cb(a2, b);
    });
  };
  mt(function() {
    cbd = cb;
  });
  var e = data.length - 22;
  for (;b4(data, e) != 101010256; --e)
    if (!e || data.length - e > 65558)
      return cbd(err(13, 0, 1), null), tAll;
  var lft = b2(data, e + 8);
  if (lft) {
    var c3 = lft, o5 = b4(data, e + 16), z2 = o5 == 4294967295 || c3 == 65535;
    if (z2) {
      var ze = b4(data, e - 12);
      if (z2 = b4(data, ze) == 101075792, z2)
        c3 = lft = b4(data, ze + 32), o5 = b4(data, ze + 48);
    }
    var fltr = opts && opts.filter, _loop_3 = function(i6) {
      var _a3 = zh(data, o5, z2), c_1 = _a3[0], sc = _a3[1], su = _a3[2], fn = _a3[3], no = _a3[4], off = _a3[5], b = slzh(data, off);
      o5 = no;
      var cbl = function(e2, d) {
        if (e2)
          tAll(), cbd(e2, null);
        else {
          if (d)
            files[fn] = d;
          if (!--lft)
            cbd(null, files);
        }
      };
      if (!fltr || fltr({
        name: fn,
        size: sc,
        originalSize: su,
        compression: c_1
      }))
        if (!c_1)
          cbl(null, slc(data, b, b + sc));
        else if (c_1 == 8) {
          var infl = data.subarray(b, b + sc);
          if (su < 524288 || sc > 0.8 * su)
            try {
              cbl(null, inflateSync(infl, { out: new u8(su) }));
            } catch (e2) {
              cbl(e2, null);
            }
          else
            term.push(inflate(infl, { size: su }, cbl));
        } else
          cbl(err(14, "unknown compression type " + c_1, 1), null);
      else
        cbl(null, null);
    };
    for (var i5 = 0;i5 < c3; ++i5)
      _loop_3(i5);
  } else
    cbd(null, {});
  return tAll;
}
