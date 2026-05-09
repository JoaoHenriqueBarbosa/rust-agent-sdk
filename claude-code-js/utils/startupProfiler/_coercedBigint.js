// function: _coercedBigint
function _coercedBigint(Class2, params) {
  return new Class2({
    type: "bigint",
    coerce: !0,
    ...normalizeParams(params)
  });
}
