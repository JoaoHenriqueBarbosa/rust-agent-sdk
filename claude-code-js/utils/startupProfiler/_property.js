// function: _property
function _property(property2, schema, params) {
  return new $ZodCheckProperty({
    check: "property",
    property: property2,
    schema,
    ...normalizeParams(params)
  });
}
