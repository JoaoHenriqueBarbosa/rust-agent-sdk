// function: partialRecord
function partialRecord(keyType, valueType, params) {
  return new ZodRecord({
    type: "record",
    keyType: union([keyType, never()]),
    valueType,
    ...exports_util.normalizeParams(params)
  });
}
