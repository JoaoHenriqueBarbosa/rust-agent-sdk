// function: zlibSync
function zlibSync(data, opts) {
  if (!opts)
    opts = {};
  var a2 = adler();
  a2.p(data);
  var d = dopt(data, opts, opts.dictionary ? 6 : 2, 4);
  return zlh(d, opts), wbytes(d, d.length - 4, a2.d()), d;
}
