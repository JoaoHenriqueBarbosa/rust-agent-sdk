// function: success
function success(innerType) {
  return new ZodSuccess({
    type: "success",
    innerType
  });
}
