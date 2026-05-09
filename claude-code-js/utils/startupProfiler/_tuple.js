// function: _tuple
function _tuple(Class2, items, _paramsOrRest, _params) {
  let hasRest = _paramsOrRest instanceof $ZodType;
  return new Class2({
    type: "tuple",
    items,
    rest: hasRest ? _paramsOrRest : null,
    ...normalizeParams(hasRest ? _params : _paramsOrRest)
  });
}
