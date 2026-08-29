// function: tuple
function tuple(items, _paramsOrRest, _params) {
  let hasRest = _paramsOrRest instanceof $ZodType, params = hasRest ? _params : _paramsOrRest;
  return new ZodTuple({
    type: "tuple",
    items,
    rest: hasRest ? _paramsOrRest : null,
    ...exports_util.normalizeParams(params)
  });
}
