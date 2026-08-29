// function: promise
function promise(innerType) {
  return new ZodPromise({
    type: "promise",
    innerType
  });
}
