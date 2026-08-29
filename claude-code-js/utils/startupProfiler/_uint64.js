// function: _uint64
function _uint64(Class2, params) {
  return new Class2({
    type: "bigint",
    check: "bigint_format",
    abort: !1,
    format: "uint64",
    ...normalizeParams(params)
  });
}
