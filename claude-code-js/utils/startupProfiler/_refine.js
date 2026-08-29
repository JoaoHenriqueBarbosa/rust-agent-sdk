// function: _refine
function _refine(Class2, fn, _params) {
  return new Class2({
    type: "custom",
    check: "custom",
    fn,
    ...normalizeParams(_params)
  });
}
