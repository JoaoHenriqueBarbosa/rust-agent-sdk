// function: custom3
function custom3(check3, _params = {}, fatal) {
  if (check3)
    return ZodAny2.create().superRefine((data, ctx) => {
      let r4 = check3(data);
      if (r4 instanceof Promise)
        return r4.then((r5) => {
          if (!r5) {
            let params = cleanParams(_params, data), _fatal = params.fatal ?? fatal ?? !0;
            ctx.addIssue({ code: "custom", ...params, fatal: _fatal });
          }
        });
      if (!r4) {
        let params = cleanParams(_params, data), _fatal = params.fatal ?? fatal ?? !0;
        ctx.addIssue({ code: "custom", ...params, fatal: _fatal });
      }
      return;
    });
  return ZodAny2.create();
}
