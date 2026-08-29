// function: createZodEnum
function createZodEnum(values2, params) {
  return new ZodEnum2({
    values: values2,
    typeName: ZodFirstPartyTypeKind.ZodEnum,
    ...processCreateParams(params)
  });
}
