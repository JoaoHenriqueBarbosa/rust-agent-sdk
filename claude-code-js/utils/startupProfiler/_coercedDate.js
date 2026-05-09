// function: _coercedDate
function _coercedDate(Class2, params) {
  return new Class2({
    type: "date",
    coerce: !0,
    ...normalizeParams(params)
  });
}
