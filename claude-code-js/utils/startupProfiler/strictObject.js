// function: strictObject
function strictObject(shape, params) {
  return new ZodObject({
    type: "object",
    get shape() {
      return exports_util.assignProp(this, "shape", { ...shape }), this.shape;
    },
    catchall: never(),
    ...exports_util.normalizeParams(params)
  });
}
