// function: optional
function optional(innerType) {
  return new ZodOptional({
    type: "optional",
    innerType
  });
}
