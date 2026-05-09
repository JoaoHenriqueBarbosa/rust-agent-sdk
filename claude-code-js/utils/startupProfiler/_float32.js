// function: _float32
function _float32(Class2, params) {
  return new Class2({
    type: "number",
    check: "number_format",
    abort: !1,
    format: "float32",
    ...normalizeParams(params)
  });
}
