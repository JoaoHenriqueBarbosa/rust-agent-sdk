// function: object
function object(shape, params) {
  let def = {
    type: "object",
    get shape() {
      return exports_util.assignProp(this, "shape", { ...shape }), this.shape;
    },
    ...exports_util.normalizeParams(params)
  };
  return new ZodObject(def);
}
