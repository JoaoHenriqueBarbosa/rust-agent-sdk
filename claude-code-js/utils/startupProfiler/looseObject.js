// function: looseObject
function looseObject(shape, params) {
  return new ZodObject({
    type: "object",
    get shape() {
      return exports_util.assignProp(this, "shape", { ...shape }), this.shape;
    },
    catchall: unknown(),
    ...exports_util.normalizeParams(params)
  });
}
