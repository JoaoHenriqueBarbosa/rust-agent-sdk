// function: _coercedNumber
function _coercedNumber(Class2, params) {
  return new Class2({
    type: "number",
    coerce: !0,
    checks: [],
    ...normalizeParams(params)
  });
}
