// function: _custom
function _custom(Class2, fn, _params) {
  let norm = normalizeParams(_params);
  return norm.abort ?? (norm.abort = !0), new Class2({
    type: "custom",
    check: "custom",
    fn,
    ...norm
  });
}
