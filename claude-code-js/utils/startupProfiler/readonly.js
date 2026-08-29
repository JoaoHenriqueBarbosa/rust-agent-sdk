// function: readonly
function readonly(innerType) {
  return new ZodReadonly({
    type: "readonly",
    innerType
  });
}
