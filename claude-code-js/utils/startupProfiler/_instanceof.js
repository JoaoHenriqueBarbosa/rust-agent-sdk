// function: _instanceof
function _instanceof(cls, params = {
  error: `Input not instance of ${cls.name}`
}) {
  let inst = new ZodCustom({
    type: "custom",
    check: "custom",
    fn: (data) => data instanceof cls,
    abort: !0,
    ...exports_util.normalizeParams(params)
  });
  return inst._zod.bag.Class = cls, inst;
}
