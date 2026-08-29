// function: _int64
function _int64(Class2, params) {
  return new Class2({
    type: "bigint",
    check: "bigint_format",
    abort: !1,
    format: "int64",
    ...normalizeParams(params)
  });
}
