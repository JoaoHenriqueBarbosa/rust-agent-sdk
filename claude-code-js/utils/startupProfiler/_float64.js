// function: _float64
function _float64(Class2, params) {
  return new Class2({
    type: "number",
    check: "number_format",
    abort: !1,
    format: "float64",
    ...normalizeParams(params)
  });
}
