// function: merge
function merge(a, b) {
  return clone2(a, {
    ...a._zod.def,
    get shape() {
      let _shape = { ...a._zod.def.shape, ...b._zod.def.shape };
      return assignProp(this, "shape", _shape), _shape;
    },
    catchall: b._zod.def.catchall,
    checks: []
  });
}
