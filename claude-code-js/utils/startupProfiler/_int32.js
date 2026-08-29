// function: _int32
function _int32(Class2, params) {
  return new Class2({
    type: "number",
    check: "number_format",
    abort: !1,
    format: "int32",
    ...normalizeParams(params)
  });
}
