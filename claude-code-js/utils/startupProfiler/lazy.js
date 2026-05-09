// function: lazy
function lazy(getter) {
  return new ZodLazy({
    type: "lazy",
    getter
  });
}
