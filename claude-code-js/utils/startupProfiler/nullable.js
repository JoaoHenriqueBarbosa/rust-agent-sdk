// function: nullable
function nullable(innerType) {
  return new ZodNullable({
    type: "nullable",
    innerType
  });
}
