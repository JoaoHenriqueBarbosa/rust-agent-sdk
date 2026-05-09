// function: gzipSync
function gzipSync(data, opts) {
  if (!opts)
    opts = {};
  var c3 = crc(), l3 = data.length;
  c3.p(data);
  var d = dopt(data, opts, gzhl(opts), 8), s2 = d.length;
  return gzh(d, opts), wbytes(d, s2 - 8, c3.d()), wbytes(d, s2 - 4, l3), d;
}
