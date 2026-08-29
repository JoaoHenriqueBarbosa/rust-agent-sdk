// function: deflateSync
function deflateSync(data, opts) {
  return dopt(data, opts || {}, 0, 0);
}
