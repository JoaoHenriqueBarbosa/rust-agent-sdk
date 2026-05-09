// function: _stringbool
function _stringbool(Classes, _params) {
  let params = normalizeParams(_params), truthyArray = params.truthy ?? ["true", "1", "yes", "on", "y", "enabled"], falsyArray = params.falsy ?? ["false", "0", "no", "off", "n", "disabled"];
  if (params.case !== "sensitive")
    truthyArray = truthyArray.map((v) => typeof v === "string" ? v.toLowerCase() : v), falsyArray = falsyArray.map((v) => typeof v === "string" ? v.toLowerCase() : v);
  let truthySet = new Set(truthyArray), falsySet = new Set(falsyArray), _Pipe = Classes.Pipe ?? $ZodPipe, _Boolean = Classes.Boolean ?? $ZodBoolean, _String = Classes.String ?? $ZodString, tx = new (Classes.Transform ?? $ZodTransform)({
    type: "transform",
    transform: (input, payload) => {
      let data = input;
      if (params.case !== "sensitive")
        data = data.toLowerCase();
      if (truthySet.has(data))
        return !0;
      else if (falsySet.has(data))
        return !1;
      else
        return payload.issues.push({
          code: "invalid_value",
          expected: "stringbool",
          values: [...truthySet, ...falsySet],
          input: payload.value,
          inst: tx
        }), {};
    },
    error: params.error
  }), innerPipe = new _Pipe({
    type: "pipe",
    in: new _String({ type: "string", error: params.error }),
    out: tx,
    error: params.error
  });
  return new _Pipe({
    type: "pipe",
    in: innerPipe,
    out: new _Boolean({
      type: "boolean",
      error: params.error
    }),
    error: params.error
  });
}
