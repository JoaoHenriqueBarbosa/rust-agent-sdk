// function: _coercedBoolean
function _coercedBoolean(Class2, params) {
  return new Class2({
    type: "boolean",
    coerce: !0,
    ...normalizeParams(params)
  });
}
