// function: transform
function transform(fn) {
  return new ZodTransform({
    type: "transform",
    transform: fn
  });
}
