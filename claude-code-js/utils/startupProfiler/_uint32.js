// function: _uint32
function _uint32(Class2, params) {
  return new Class2({
    type: "number",
    check: "number_format",
    abort: !1,
    format: "uint32",
    ...normalizeParams(params)
  });
}
