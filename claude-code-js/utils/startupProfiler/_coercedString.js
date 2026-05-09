// function: _coercedString
function _coercedString(Class2, params) {
  return new Class2({
    type: "string",
    coerce: !0,
    ...normalizeParams(params)
  });
}
