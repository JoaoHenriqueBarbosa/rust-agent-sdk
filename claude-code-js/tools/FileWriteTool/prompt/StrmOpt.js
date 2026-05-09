// function: StrmOpt
function StrmOpt(opts, cb) {
  if (typeof opts == "function")
    cb = opts, opts = {};
  return this.ondata = cb, opts;
}
